from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app import crud
from app.schemas.finance import FinanceTransactionResponse, FinanceTransactionCreate
from app.api.v1.dependencies import get_current_user
from app.models import User

router = APIRouter()

@router.get("/", response_model=List[FinanceTransactionResponse])
async def read_finance_transactions(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve finance transactions.
    """
    transactions = await crud.finance.get_multi_by_owner(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return transactions

@router.post("/", response_model=FinanceTransactionResponse)
async def create_finance_transaction(
    *,
    db: AsyncSession = Depends(get_db),
    transaction_in: FinanceTransactionCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new finance transaction.
    """
    transaction = await crud.finance.create(
        db=db, obj_in=transaction_in, user_id=current_user.id
    )
    return transaction
