"""
SQLAlchemy Models - Definição das tabelas do banco de dados
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Enum, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from backend.app.core import Base


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
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")


class PlayerStats(Base):
    """Modelo de estatísticas do jogador."""
    __tablename__ = "player_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    level = Column(Integer, default=1)
    total_xp = Column(Integer, default=0)
    
    # Atributos individuais
    strength_level = Column(Integer, default=1)
    strength_xp = Column(Integer, default=0)
    
    intelligence_level = Column(Integer, default=1)
    intelligence_xp = Column(Integer, default=0)
    
    charisma_level = Column(Integer, default=1)
    charisma_xp = Column(Integer, default=0)
    
    vitality_level = Column(Integer, default=1)
    vitality_xp = Column(Integer, default=0)
    
    wisdom_level = Column(Integer, default=1)
    wisdom_xp = Column(Integer, default=0)
    
    agility_level = Column(Integer, default=1)
    agility_xp = Column(Integer, default=0)
    
    # Streak
    streak_days = Column(Integer, default=0)
    last_activity = Column(DateTime, nullable=True)
    
    # Quests
    quests_completed = Column(Integer, default=0)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="player_stats")


class QuestDifficultyEnum(str, enum.Enum):
    """Enum de dificuldade de quest."""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EPIC = "epic"


class QuestStatusEnum(str, enum.Enum):
    """Enum de status de quest."""
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AttributeEnum(str, enum.Enum):
    """Enum de atributos."""
    STRENGTH = "strength"
    INTELLIGENCE = "intelligence"
    CHARISMA = "charisma"
    VITALITY = "vitality"
    WISDOM = "wisdom"
    AGILITY = "agility"


class Quest(Base):
    """Modelo de quest."""
    __tablename__ = "quests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(Enum(QuestDifficultyEnum), default=QuestDifficultyEnum.MEDIUM)
    attribute = Column(Enum(AttributeEnum), nullable=False)
    status = Column(Enum(QuestStatusEnum), default=QuestStatusEnum.ACTIVE)
    xp_reward = Column(Integer, default=0)
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="quests")


class TransactionTypeEnum(str, enum.Enum):
    """Enum de tipo de transação."""
    INCOME = "income"
    EXPENSE = "expense"


class Transaction(Base):
    """Modelo de transação financeira."""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String(255), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    type = Column(Enum(TransactionTypeEnum), nullable=False)
    category = Column(String(100), nullable=False)
    date = Column(DateTime, nullable=False, default=func.now())
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="transactions")
