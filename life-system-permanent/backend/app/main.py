"""
Main Application - FastAPI App Setup
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import init_db, close_db
from app.api.v1.api import api_router

# Cria aplicação FastAPI
app = FastAPI(
    title="Life System API",
    description="API para o sistema de gamificação Life System",
    version="1.0.0",
)

# CORS - Permite requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Eventos de startup e shutdown
@app.on_event("startup")
async def startup_event():
    """Inicializa o banco de dados ao iniciar."""
    await init_db()
    print("✅ Banco de dados inicializado")


@app.on_event("shutdown")
async def shutdown_event():
    """Fecha conexões ao desligar."""
    await close_db()
    print("❌ Conexões fechadas")


# Rotas
app.include_router(api_router, prefix="/api/v1")


# Health check
@app.get("/health")
async def health_check():
    """Verifica se a API está online."""
    return {"status": "ok", "message": "Life System API is running"}


@app.get("/")
async def root():
    """Rota raiz."""
    return {
        "name": "Life System API",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
