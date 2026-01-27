"""
SQLAlchemy Models - Definição das tabelas do banco de dados
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Enum, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core import Base


class QuestStatusEnum(str, enum.Enum):
    AVAILABLE = "available"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class User(Base):
    """Modelo de usuário."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    player_stats = relationship("PlayerStats", back_populates="user", uselist=False, cascade="all, delete-orphan")
    quests = relationship("Quest", back_populates="user", cascade="all, delete-orphan")
    finance_transactions = relationship("FinanceTransaction", back_populates="user", cascade="all, delete-orphan")
    body_metrics = relationship("BodyMetric", back_populates="user", cascade="all, delete-orphan")


class PlayerStats(Base):
    """Modelo de estatísticas do jogador."""
    __tablename__ = "player_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Core RPG Stats
    level = Column(Integer, default=1)
    current_xp = Column(Integer, default=0)
    hp = Column(Integer, default=100)
    
    # Attributes
    strength = Column(Integer, default=1)
    intelligence = Column(Integer, default=1)
    focus = Column(Integer, default=1)
    
    quests_completed = Column(Integer, default=0)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="player_stats")


class QuestDifficultyEnum(str, enum.Enum):
    """Enum de dificuldade de quest."""
    E = "E"
    D = "D"
    C = "C"
    B = "B"
    A = "A"
    S = "S"


class AttributeRewardEnum(str, enum.Enum):
    """Enum de recompensa de atributo."""
    STR = "STR"
    INT = "INT"
    FOC = "FOC"


class QuestCategoryEnum(str, enum.Enum):
    """Enum de categoria de quest."""
    DAILY = "Daily"
    STORY = "Story"
    SIDE_QUEST = "Side-Quest"


class Quest(Base):
    """Modelo de quest."""
    __tablename__ = "quests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(Enum(QuestDifficultyEnum), default=QuestDifficultyEnum.E)
    category = Column(Enum(QuestCategoryEnum), default=QuestCategoryEnum.SIDE_QUEST)
    
    xp_reward = Column(Integer, default=0)
    attribute_reward = Column(Enum(AttributeRewardEnum), nullable=True)
    
    # Hardcore Mode / Punishment
    penalty_hp = Column(Integer, default=0, comment="HP lost if failed/missed")
    is_healing = Column(Boolean, default=False, comment="If True, restores HP on completion")
    
    status = Column(Enum(QuestStatusEnum), default=QuestStatusEnum.AVAILABLE)
    is_completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="quests")


class FinanceTypeEnum(str, enum.Enum):
    """Enum de tipo de finança."""
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"


class FinanceTransaction(Base):
    """Modelo de transação financeira (The Wallet)."""
    __tablename__ = "finance_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    type = Column(Enum(FinanceTypeEnum), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    
    date = Column(DateTime, server_default=func.now(), nullable=False)
    is_fixed = Column(Boolean, default=False, comment="Recurring monthly bill")
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="finance_transactions")


class BodyMetric(Base):
    """Modelo de métricas corporais (Solo Leveling Growth)."""
    __tablename__ = "body_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    date = Column(DateTime, server_default=func.now(), nullable=False)
    weight = Column(Float, nullable=False)
    muscle_mass = Column(Float, nullable=True)
    fat_percentage = Column(Float, nullable=True)
    photo_url = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="body_metrics")

# Punishment System Logic (Plan):
# A background task (Celery/APScheduler) or a check on User Login will:
# 1. Query all 'DAILY' quests where due_date < now() AND status != COMPLETED.
# 2. For each missed quest, deduct 'penalty_hp' from User.player_stats.hp.
# 3. If HP <= 0, trigger 'Death' state (level down or xp loss).
# 4. Mark quest as FAILED.
