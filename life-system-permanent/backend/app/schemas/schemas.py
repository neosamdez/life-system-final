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

class AttributeStatsResponse(BaseModel):
    """Schema de resposta de um atributo."""
    level: int
    xp: int
    xp_to_next_level: int
    progress_percentage: float


class PlayerStatsResponse(BaseModel):
    """Schema de resposta de estatísticas do jogador."""
    id: int
    user_id: int
    level: int
    total_xp: int
    strength: AttributeStatsResponse
    intelligence: AttributeStatsResponse
    charisma: AttributeStatsResponse
    vitality: AttributeStatsResponse
    wisdom: AttributeStatsResponse
    agility: AttributeStatsResponse
    quests_completed: int
    streak_days: int
    last_activity: Optional[datetime]
    
    class Config:
        from_attributes = True


# ============== QUESTS ==============

class QuestDifficultyEnum(str, Enum):
    """Enum de dificuldade."""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EPIC = "epic"


class QuestStatusEnum(str, Enum):
    """Enum de status."""
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AttributeEnum(str, Enum):
    """Enum de atributos."""
    STRENGTH = "strength"
    INTELLIGENCE = "intelligence"
    CHARISMA = "charisma"
    VITALITY = "vitality"
    WISDOM = "wisdom"
    AGILITY = "agility"


class QuestCreate(BaseModel):
    """Schema para criar quest."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    difficulty: QuestDifficultyEnum = QuestDifficultyEnum.MEDIUM
    attribute: AttributeEnum
    due_date: Optional[datetime] = None


class QuestResponse(BaseModel):
    """Schema de resposta de quest."""
    id: int
    user_id: int
    title: str
    description: Optional[str]
    difficulty: str
    attribute: str
    status: str
    xp_reward: int
    due_date: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuestCompleteResponse(BaseModel):
    """Schema de resposta ao completar quest."""
    quest: QuestResponse
    xp_gained: int
    attribute_updated: str
    level_up: bool
    new_level: Optional[int]
    old_level: Optional[int]
    message: str


# ============== FINANCE ==============

class TransactionTypeEnum(str, Enum):
    """Enum de tipo de transação."""
    INCOME = "income"
    EXPENSE = "expense"


class TransactionCreate(BaseModel):
    """Schema para criar transação."""
    description: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0)
    type: TransactionTypeEnum
    category: str = Field(..., min_length=1, max_length=100)
    date: Optional[datetime] = None


class TransactionResponse(BaseModel):
    """Schema de resposta de transação."""
    id: int
    user_id: int
    description: str
    amount: float
    type: str
    category: str
    date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class CategorySummary(BaseModel):
    """Schema de resumo por categoria."""
    category: str
    total: float
    percentage: float
    count: int


class FinanceSummary(BaseModel):
    """Schema de resumo financeiro."""
    total_income: float
    total_expense: float
    balance: float
    income_by_category: list[CategorySummary]
    expense_by_category: list[CategorySummary]
    transaction_count: int
    period: str


class MonthlyTrend(BaseModel):
    """Schema de tendência mensal."""
    month: str
    year: int
    income: float
    expense: float
    balance: float


class FinanceTrends(BaseModel):
    """Schema de tendências financeiras."""
    trends: list[MonthlyTrend]
    average_income: float
    average_expense: float
