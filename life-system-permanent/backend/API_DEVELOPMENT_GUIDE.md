# API Development Standards & Architecture Guide

## Overview
This document defines the **Standard Flow** for adding new features to the Life System backend. It establishes a strict separation of concerns to ensure maintainability, scalability, and consistency.

**Core Principle**: The API Layer (Endpoints) should **never** contain database logic. All database interactions must be isolated in the CRUD Layer.

---

## The 5-Step Architecture

### Step 1: Pydantic Schemas (`app/schemas/`)
Define the data shape for input (Create/Update) and output (Response).
*   **Location**: `backend/app/schemas/[feature].py`
*   **Rule**: Always use explicit typing.
*   **Naming Convention**: `[Model]Create`, `[Model]Update`, `[Model]Response`.
*   **JSON Convention**: **CamelCase** for JSON output (Frontend), **snake_case** for internal Python/DB.

### Step 2: CRUD Logic (`app/crud/`)
Isolate all database queries here. This layer handles the "How" of data access.
*   **Location**: `backend/app/crud/crud_[feature].py`
*   **Rule**: Never write SQL (`select`, `insert`) directly in the endpoint.
*   **Pattern**: Create a class `CRUD[Model]` or standalone functions if simple.

### Step 3: API Endpoint (`app/api/v1/endpoints/`)
Connect the router to the CRUD layer. This layer handles the "What" (HTTP request/response).
*   **Location**: `backend/app/api/v1/endpoints/[feature].py`
*   **Rule**: Handle HTTP Exceptions gracefully. Validate inputs via Schemas.
*   **Standard Response**: All endpoints must return standard JSON structures.

### Step 4: Router Registration (`app/api/v1/api.py`)
Connect the new endpoint router to the main API router.
*   **Location**: `backend/app/api/v1/api.py`
*   **Action**: Import the router and add it to `api_router`.

### Step 5: Frontend Integration
*   **Convention**: The backend uses `snake_case` (Python standard). The frontend typically expects `camelCase` (JS standard).
*   **Layered Architecture**: `models` -> `schemas` (Pydantic) -> `crud` -> `api/endpoints`.

---

## Boilerplate Code

### 1. Standard CRUD File (`app/crud/crud_example.py`)

```python
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.example import ExampleModel
from app.schemas.example import ExampleCreate, ExampleUpdate

class CRUDExample:
    async def get(self, db: AsyncSession, id: int) -> Optional[ExampleModel]:
        result = await db.execute(select(ExampleModel).where(ExampleModel.id == id))
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[ExampleModel]:
        result = await db.execute(select(ExampleModel).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_in: ExampleCreate) -> ExampleModel:
        db_obj = ExampleModel(**obj_in.dict())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, db_obj: ExampleModel, obj_in: ExampleUpdate) -> ExampleModel:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, id: int) -> Optional[ExampleModel]:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

example = CRUDExample()
```

### 2. Standard Endpoint File (`app/api/v1/endpoints/example.py`)

```python
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app import crud, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.ExampleResponse])
async def read_examples(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve examples.
    """
    examples = await crud.example.get_multi(db, skip=skip, limit=limit)
    return examples

@router.post("/", response_model=schemas.ExampleResponse)
async def create_example(
    *,
    db: AsyncSession = Depends(get_db),
    example_in: schemas.ExampleCreate,
) -> Any:
    """
    Create new example.
    """
    example = await crud.example.create(db=db, obj_in=example_in)
    return example

@router.get("/{id}", response_model=schemas.ExampleResponse)
async def read_example(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
) -> Any:
    """
    Get example by ID.
    """
    example = await crud.example.get(db=db, id=id)
    if not example:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Example not found",
        )
    return example
```

---

## Error Handling Standard

All API errors must be returned as standard HTTP Exceptions.

*   **404 Not Found**: When a resource (User, Quest, etc.) does not exist.
    ```python
    raise HTTPException(status_code=404, detail="Item not found")
    ```
*   **400 Bad Request**: When business logic fails (e.g., "Not enough gold", "Quest already completed").
    ```python
    raise HTTPException(status_code=400, detail="Insufficient funds")
    ```
*   **401 Unauthorized**: When authentication fails.
*   **403 Forbidden**: When the user is authenticated but doesn't have permission.
*   **500 Internal Server Error**: Unexpected server crashes (should be rare).

**Do not return dictionaries** like `{"error": "message"}` directly. Always use `HTTPException`.
