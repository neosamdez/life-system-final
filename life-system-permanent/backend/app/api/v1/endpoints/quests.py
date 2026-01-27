from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any

from app.core.database import get_db
from app.models import User, Quest, PlayerStats, QuestStatusEnum
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.patch("/{quest_id}/complete", response_model=Any)
async def complete_quest(
    quest_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Marca uma quest como completa e atribui XP ao usuário.
    Realiza lógica de Level Up se necessário.
    """
    
    # 1. Busca a quest
    result = await db.execute(
        select(Quest).where(Quest.id == quest_id, Quest.user_id == current_user.id)
    )
    quest = result.scalars().first()
    
    if not quest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quest não encontrada ou não pertence ao usuário."
        )
        
    if quest.status == QuestStatusEnum.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta quest já foi concluída."
        )
        
    # 2. Define XP baseado na dificuldade
    xp_reward = 0
    difficulty_xp_map = {
        "easy": 10,
        "medium": 30,
        "hard": 50,
        "epic": 100 # Bônus caso exista
    }
    
    # Garante que usamos o valor do enum como string para o mapa
    difficulty_str = quest.difficulty.value if hasattr(quest.difficulty, 'value') else str(quest.difficulty)
    xp_reward = difficulty_xp_map.get(difficulty_str, 10) # Default 10
    
    # 3. Atualiza status da quest
    quest.status = QuestStatusEnum.COMPLETED
    quest.xp_reward = xp_reward # Salva quanto valeu
    quest.completed_at = func.now() # Opcional, se tiver o campo
    
    # 4. Atualiza PlayerStats
    # Busca stats do jogador
    stats_result = await db.execute(
        select(PlayerStats).where(PlayerStats.user_id == current_user.id)
    )
    player_stats = stats_result.scalars().first()
    
    if not player_stats:
        # Se não existir (erro de integridade, mas vamos prevenir), cria um
        player_stats = PlayerStats(user_id=current_user.id, level=1, current_xp=0)
        db.add(player_stats)
    
    # Adiciona XP
    player_stats.current_xp += xp_reward
    player_stats.quests_completed += 1
    
    # 5. Lógica de Level Up
    # Se XP Atual >= Nível * 100
    current_level = player_stats.level
    xp_threshold = current_level * 100
    
    level_up = False
    new_level = current_level
    
    if player_stats.current_xp >= xp_threshold:
        level_up = True
        player_stats.level += 1
        new_level = player_stats.level
        
        # Ajuste do XP: "resete/ajuste". 
        # Vamos subtrair o custo do nível para manter o excedente (padrão RPG justo)
        # Ex: Nível 1 (precisa 100). Tem 120. Upa para 2. Sobra 20.
        player_stats.current_xp = player_stats.current_xp - xp_threshold
        
    # Salva tudo
    await db.commit()
    await db.refresh(quest)
    await db.refresh(player_stats)
    
    return {
        "success": True,
        "level_up": level_up,
        "new_level": new_level,
        "xp_gained": xp_reward,
        "current_xp": player_stats.current_xp,
        "next_level_xp": new_level * 100
    }

@router.post("/check-dailies", response_model=Any)
async def check_dailies(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Verifica quests diárias atrasadas e aplica penalidades.
    Deve ser chamado ao logar ou periodicamente.
    """
    # 1. Busca quests diárias atrasadas e não completadas
    # Note: In a real app, 'daily' reset logic might be more complex (e.g. reset at midnight)
    # Here we assume if due_date < now and not completed, it's missed.
    
    result = await db.execute(
        select(Quest).where(
            Quest.user_id == current_user.id,
            Quest.category == "DAILY", # Using string match for simplicity or Enum
            Quest.status != QuestStatusEnum.COMPLETED,
            Quest.status != QuestStatusEnum.FAILED,
            Quest.due_date < func.now()
        )
    )
    missed_quests = result.scalars().all()
    
    if not missed_quests:
        return {"message": "No missed daily quests."}
        
    # 2. Get Player Stats
    stats_result = await db.execute(
        select(PlayerStats).where(PlayerStats.user_id == current_user.id)
    )
    player_stats = stats_result.scalars().first()
    
    if not player_stats:
         return {"message": "Player stats not found."}

    total_damage = 0
    processed_quests = []

    for quest in missed_quests:
        # Apply penalty
        damage = quest.penalty_hp or 0
        player_stats.hp -= damage
        total_damage += damage
        
        # Mark as failed
        quest.status = QuestStatusEnum.FAILED
        processed_quests.append(quest.id)
        
    # 3. Check for Death
    is_dead = False
    if player_stats.hp <= 0:
        is_dead = True
        player_stats.hp = 0
        # Implement Death Logic here (e.g. lose XP, level down)
        # For now, just reset HP to 1 to be kind? Or keep at 0.
        # Let's keep at 0 and frontend handles "You Died" screen.

    await db.commit()
    
    return {
        "processed_quests": processed_quests,
        "total_damage": total_damage,
        "current_hp": player_stats.hp,
        "is_dead": is_dead
    }
