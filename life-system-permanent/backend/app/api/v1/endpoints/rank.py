from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_rank():
    return [{"id": 1, "name": "Rank Placeholder"}]
