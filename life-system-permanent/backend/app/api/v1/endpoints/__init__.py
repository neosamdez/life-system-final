"""Endpoints module - Endpoints da API."""

from .auth import router as auth_router

__all__ = ["auth_router"]
