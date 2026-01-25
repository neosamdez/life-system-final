from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any

from backend.app.core.database import get_db
from backend.app.models import User, Quest, PlayerStats, QuestStatusEnum
from backend.app.api.dependencies import get_current_user

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
    # quest.completed_at = func.now() # Opcional, se tiver o campo
    
    # 4. Atualiza PlayerStats
    # Busca stats do jogador
    stats_result = await db.execute(
        select(PlayerStats).where(PlayerStats.user_id == current_user.id)
    )
    player_stats = stats_result.scalars().first()
    
    if not player_stats:
        # Se não existir (erro de integridade, mas vamos prevenir), cria um
        player_stats = PlayerStats(user_id=current_user.id, level=1, total_xp=0)
        db.add(player_stats)
    
    # Adiciona XP
    player_stats.total_xp += xp_reward
    player_stats.quests_completed += 1
    
    # 5. Lógica de Level Up
    # Se XP Atual >= Nível * 100
    current_level = player_stats.level
    xp_threshold = current_level * 100
    
    level_up = False
    new_level = current_level
    
    if player_stats.total_xp >= xp_threshold:
        level_up = True
        player_stats.level += 1
        new_level = player_stats.level
        
        # Ajuste do XP: "resete/ajuste". 
        # Vamos subtrair o custo do nível para manter o excedente (padrão RPG justo)
        # Ex: Nível 1 (precisa 100). Tem 120. Upa para 2. Sobra 20.
        player_stats.total_xp = player_stats.total_xp - xp_threshold
        
    # Salva tudo
    await db.commit()
    await db.refresh(quest)
    await db.refresh(player_stats)
    
    return {
        "success": True,
        "level_up": level_up,
        "new_level": new_level,
        "xp_gained": xp_reward,
        "current_xp": player_stats.total_xp,
        "next_level_xp": new_level * 100
    }
