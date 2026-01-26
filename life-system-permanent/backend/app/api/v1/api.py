from fastapi import APIRouter

from app.api.v1.endpoints import auth, gamification, finance

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(gamification.router, prefix="", tags=["gamification"])
api_router.include_router(finance.router, prefix="/finance", tags=["finance"])
