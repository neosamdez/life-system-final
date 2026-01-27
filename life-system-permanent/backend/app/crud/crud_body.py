from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.models import BodyMetric
from app.schemas.body import BodyMetricCreate

class CRUDBody:
    async def get_multi_by_owner(
        self, db: AsyncSession, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[BodyMetric]:
        result = await db.execute(
            select(BodyMetric)
            .where(BodyMetric.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(BodyMetric.date.desc())
        )
        return result.scalars().all()

    async def create(
        self, db: AsyncSession, *, obj_in: BodyMetricCreate, user_id: int
    ) -> BodyMetric:
        db_obj = BodyMetric(
            **obj_in.dict(),
            user_id=user_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

body = CRUDBody()
