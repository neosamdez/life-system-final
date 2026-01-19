"""API module - Rotas e endpoints."""

from .endpoints.auth import router as auth_router
from .endpoints.quests import router as quests_router

__all__ = ["auth_router", "quests_router"]
