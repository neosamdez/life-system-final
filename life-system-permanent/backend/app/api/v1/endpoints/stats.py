from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.api.v1.dependencies import get_current_user
from app.models import User, PlayerStats

router = APIRouter()

@router.get("/", response_model=Any)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user stats.
    """
    result = await db.execute(select(PlayerStats).where(PlayerStats.user_id == current_user.id))
    stats = result.scalars().first()
    
    if not stats:
        # Create default if missing
        stats = PlayerStats(user_id=current_user.id)
        db.add(stats)
        await db.commit()
        await db.refresh(stats)
        
    return stats
