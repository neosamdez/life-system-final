from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.models import FinanceTypeEnum

class FinanceTransactionBase(BaseModel):
    type: FinanceTypeEnum
    amount: float
    category: str
    description: Optional[str] = None
    date: datetime
    is_fixed: bool = False

class FinanceTransactionCreate(FinanceTransactionBase):
    pass

class FinanceTransactionResponse(FinanceTransactionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
