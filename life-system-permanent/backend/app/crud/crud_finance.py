from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.models import FinanceTransaction
from app.schemas.finance import FinanceTransactionCreate

class CRUDFinance:
    async def get_multi_by_owner(
        self, db: AsyncSession, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[FinanceTransaction]:
        result = await db.execute(
            select(FinanceTransaction)
            .where(FinanceTransaction.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(FinanceTransaction.date.desc())
        )
        return result.scalars().all()

    async def create(
        self, db: AsyncSession, *, obj_in: FinanceTransactionCreate, user_id: int
    ) -> FinanceTransaction:
        db_obj = FinanceTransaction(
            **obj_in.dict(),
            user_id=user_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

finance = CRUDFinance()
