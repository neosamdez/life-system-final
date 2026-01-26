from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.api.v1.dependencies import get_current_user
from app.models import User, FinanceLog, FinanceTypeEnum
from app.schemas import FinanceLogCreate, FinanceLogResponse

router = APIRouter()

@router.get("/transactions", response_model=List[FinanceLogResponse])
async def get_transactions(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lista transações financeiras do usuário."""
    stmt = select(FinanceLog).where(FinanceLog.user_id == current_user.id).offset(skip).limit(limit).order_by(FinanceLog.created_at.desc())
    result = await db.execute(stmt)
    transactions = result.scalars().all()
    return transactions

@router.post("/transactions", response_model=FinanceLogResponse)
async def create_transaction(
    transaction_in: FinanceLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cria uma nova transação financeira."""
    transaction = FinanceLog(
        user_id=current_user.id,
        type=transaction_in.type,
        amount=transaction_in.amount,
        category=transaction_in.category,
        description=transaction_in.description
    )
    
    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)
    return transaction
