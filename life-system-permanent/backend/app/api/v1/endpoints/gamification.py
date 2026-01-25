from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime

from backend.app.core import get_db
from backend.app.api.v1.dependencies import get_current_user
from backend.app.models import User, PlayerStats, Quest, QuestDifficultyEnum, AttributeRewardEnum
from backend.app.schemas import (
    PlayerStatsResponse,
    QuestCreate,
    QuestResponse,
    QuestCompleteResponse,
    QuestDifficultyEnum as QuestDifficultyEnumSchema,
    AttributeRewardEnum as AttributeRewardEnumSchema
)

router = APIRouter()

@router.get("/stats", response_model=PlayerStatsResponse)
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Obtém estatísticas do jogador atual."""
    # Ensure stats exist (should be created on user registration, but just in case)
    stmt = select(PlayerStats).where(PlayerStats.user_id == current_user.id)
    result = await db.execute(stmt)
    stats = result.scalar_one_or_none()
    
    if not stats:
        # Create default stats if missing
        stats = PlayerStats(user_id=current_user.id)
        db.add(stats)
        await db.commit()
        await db.refresh(stats)
        
    return stats

@router.get("/quests", response_model=list[QuestResponse])
async def get_quests(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lista quests ativas do usuário."""
    stmt = select(Quest).where(
        Quest.user_id == current_user.id,
        Quest.is_completed == False
    ).order_by(Quest.created_at.desc())
    result = await db.execute(stmt)
    quests = result.scalars().all()
    return quests

@router.post("/quests", response_model=QuestResponse)
async def create_quest(
    quest_in: QuestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cria uma nova quest."""
    quest = Quest(
        user_id=current_user.id,
        title=quest_in.title,
        description=quest_in.description,
        difficulty=quest_in.difficulty,
        xp_reward=quest_in.xp_reward,
        attribute_reward=quest_in.attribute_reward,
        due_date=quest_in.due_date,
        is_completed=False
    )
    
    db.add(quest)
    await db.commit()
    await db.refresh(quest)
    return quest

@router.post("/quests/{quest_id}/complete", response_model=QuestCompleteResponse)
async def complete_quest(
    quest_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Completa uma quest e atribui recompensas.
    Lógica de Level Up: Se current_xp >= level * 100 -> Level Up.
    """
    # 1. Get Quest
    stmt = select(Quest).where(Quest.id == quest_id, Quest.user_id == current_user.id)
    result = await db.execute(stmt)
    quest = result.scalar_one_or_none()
    
    if not quest:
        raise HTTPException(status_code=404, detail="Quest não encontrada")
        
    if quest.is_completed:
        raise HTTPException(status_code=400, detail="Quest já completada")
        
    # 2. Get Player Stats
    stmt_stats = select(PlayerStats).where(PlayerStats.user_id == current_user.id)
    result_stats = await db.execute(stmt_stats)
    stats = result_stats.scalar_one_or_none()
    
    if not stats:
        stats = PlayerStats(user_id=current_user.id)
        db.add(stats)
    
    # 3. Apply Rewards
    quest.is_completed = True
    quest.completed_at = datetime.now()
    
    xp_gained = quest.xp_reward
    stats.current_xp += xp_gained
    
    # Attribute Reward
    attribute_updated = "None"
    if quest.attribute_reward:
        if quest.attribute_reward == AttributeRewardEnum.STR:
            stats.strength += 1
            attribute_updated = "Strength"
        elif quest.attribute_reward == AttributeRewardEnum.INT:
            stats.intelligence += 1
            attribute_updated = "Intelligence"
        elif quest.attribute_reward == AttributeRewardEnum.FOC:
            stats.focus += 1
            attribute_updated = "Focus"
            
    # 4. Level Up Logic
    level_up = False
    old_level = stats.level
    new_level = stats.level
    
    xp_threshold = stats.level * 100
    
    if stats.current_xp >= xp_threshold:
        level_up = True
        stats.level += 1
        stats.current_xp -= xp_threshold  # Carry over remainder
        stats.hp += 10  # Increase HP
        new_level = stats.level
        
    await db.commit()
    await db.refresh(quest)
    
    message = f"Quest completada! Ganhou {xp_gained} XP."
    if level_up:
        message += f" LEVEL UP! Você alcançou o nível {new_level}!"
        
    return QuestCompleteResponse(
        quest=quest,
        xp_gained=xp_gained,
        level_up=level_up,
        new_level=new_level if level_up else None,
        old_level=old_level if level_up else None,
        message=message,
        attribute_updated=attribute_updated
    )
