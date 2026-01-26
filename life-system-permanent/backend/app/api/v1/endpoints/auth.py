"""
Auth Endpoints - Endpoints de autenticação
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services import AuthService
from app.api.v1.dependencies import get_current_user
from app.models import User

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Registra um novo usuário."""
    try:
        user = await AuthService.register(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Faz login e retorna token."""
    try:
        user, token = await AuthService.login(db, credentials.email, credentials.password)
        return TokenResponse(access_token=token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Obtém dados do usuário atual."""
    return current_user
