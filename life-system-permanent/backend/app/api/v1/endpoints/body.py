from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app import crud
from app.schemas.body import BodyMetricResponse, BodyMetricCreate
from app.api.v1.dependencies import get_current_user
from app.models import User

router = APIRouter()

@router.get("/", response_model=List[BodyMetricResponse])
async def read_body_metrics(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve body metrics.
    """
    metrics = await crud.body.get_multi_by_owner(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return metrics

@router.post("/", response_model=BodyMetricResponse)
async def create_body_metric(
    *,
    db: AsyncSession = Depends(get_db),
    metric_in: BodyMetricCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new body metric.
    """
    metric = await crud.body.create(
        db=db, obj_in=metric_in, user_id=current_user.id
    )
    return metric
