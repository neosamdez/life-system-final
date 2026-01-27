from fastapi import APIRouter

from app.api.v1.endpoints import auth, gamification, finance, quests, stats, rank, body

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(gamification.router, prefix="", tags=["gamification"])
api_router.include_router(finance.router, prefix="/finance", tags=["finance"])
api_router.include_router(quests.router, prefix="/quests", tags=["quests"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(rank.router, prefix="/rank", tags=["rank"])
api_router.include_router(body.router, prefix="/body", tags=["body"])
