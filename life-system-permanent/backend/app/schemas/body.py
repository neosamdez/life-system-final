from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class BodyMetricBase(BaseModel):
    date: datetime
    weight: float
    muscle_mass: Optional[float] = None
    fat_percentage: Optional[float] = None
    photo_url: Optional[str] = None

class BodyMetricCreate(BodyMetricBase):
    pass

class BodyMetricResponse(BodyMetricBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
