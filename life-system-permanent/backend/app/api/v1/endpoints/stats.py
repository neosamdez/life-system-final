from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_stats():
    return [{"id": 1, "name": "Stats Placeholder"}]
