"""API module - Rotas e endpoints."""

from .endpoints.auth import router as auth_router
from .endpoints.gamification import router as gamification_router
from .endpoints.finance import router as finance_router

__all__ = ["auth_router", "gamification_router", "finance_router"]
