"""
Auth Service - Lógica de autenticação
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta

from app.models import User, PlayerStats
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas import UserRegister, TokenResponse


class AuthService:
    """Serviço de autenticação."""
    
    @staticmethod
    async def register(db: AsyncSession, user_data: UserRegister) -> User:
        """Registra um novo usuário."""
        # Verifica se email já existe
        result = await db.execute(select(User).where(User.email == user_data.email))
        if result.scalars().first():
            raise ValueError("Email já registrado")
        
        # Verifica se username já existe
        result = await db.execute(select(User).where(User.username == user_data.username))
        if result.scalars().first():
            raise ValueError("Username já existe")
        
        # Cria novo usuário
        user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hash_password(user_data.password[:72]),
        )
        db.add(user)
        await db.flush()
        
        # Cria estatísticas do jogador
        player_stats = PlayerStats(user_id=user.id)
        db.add(player_stats)
        
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def login(db: AsyncSession, email: str, password: str) -> tuple[User, str]:
        """Faz login e retorna usuário e token."""
        # Busca usuário por email
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if not user or not verify_password(password, user.hashed_password):
            raise ValueError("Email ou senha incorretos")
        
        if not user.is_active:
            raise ValueError("Usuário inativo")
        
        # Cria token
        token = create_access_token({"sub": str(user.id)})
        
        return user, token
    
    @staticmethod
    async def get_current_user(db: AsyncSession, user_id: int) -> User:
        """Obtém usuário atual."""
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        
        if not user:
            raise ValueError("Usuário não encontrado")
        
        return user
