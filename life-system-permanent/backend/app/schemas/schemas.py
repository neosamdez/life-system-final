"""
Pydantic Schemas - Validação de entrada e saída
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from enum import Enum


# ============== AUTH ==============

class UserRegister(BaseModel):
    """Schema para registro de usuário."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema para login."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema de resposta com token."""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Schema de resposta do usuário."""
    id: int
    email: str
    username: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============== PLAYER STATS ==============

class PlayerStatsResponse(BaseModel):
    """Schema de resposta de estatísticas do jogador."""
    id: int
    user_id: int
    level: int
    current_xp: int
    hp: int
    strength: int
    intelligence: int
    focus: int
    
    class Config:
        from_attributes = True


# ============== QUESTS ==============

class QuestDifficultyEnum(str, Enum):
    """Enum de dificuldade."""
    E = "E"
    D = "D"
    C = "C"
    B = "B"
    A = "A"
    S = "S"


class AttributeRewardEnum(str, Enum):
    """Enum de recompensa de atributo."""
    STR = "STR"
    INT = "INT"
    FOC = "FOC"


class QuestCreate(BaseModel):
    """Schema para criar quest."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    difficulty: QuestDifficultyEnum = QuestDifficultyEnum.E
    xp_reward: int = Field(..., ge=0)
    attribute_reward: Optional[AttributeRewardEnum] = None
    due_date: Optional[datetime] = None


class QuestResponse(BaseModel):
    """Schema de resposta de quest."""
    id: int
    user_id: int
    title: str
    description: Optional[str]
    difficulty: QuestDifficultyEnum
    xp_reward: int
    attribute_reward: Optional[AttributeRewardEnum]
    is_completed: bool
    due_date: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuestCompleteResponse(BaseModel):
    """Schema de resposta ao completar quest."""
    quest: QuestResponse
    xp_gained: int
    level_up: bool
    new_level: Optional[int]
    old_level: Optional[int]
    message: str


# ============== FINANCE ==============

class FinanceTypeEnum(str, Enum):
    """Enum de tipo de finança."""
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"


class FinanceLogCreate(BaseModel):
    """Schema para criar registro financeiro."""
    type: FinanceTypeEnum
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None


class FinanceLogResponse(BaseModel):
    """Schema de resposta de registro financeiro."""
    id: int
    user_id: int
    type: FinanceTypeEnum
    amount: float
    category: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
