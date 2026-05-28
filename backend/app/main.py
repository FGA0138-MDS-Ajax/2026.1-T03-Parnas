"""Ponto de entrada da aplicação FastAPI — KeepUnB."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, users, tickets

app = FastAPI(
    title="KeepUnB API",
    description="API para o sistema KeepUnB de gestão de manutenção",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tickets.router)


@app.get("/")
async def root():
    return {
        "message": "Bem-vindo à API do KeepUnB!",
        "status": "healthy",
        "docs": "/docs",
    }


@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "keepunb-backend"}
