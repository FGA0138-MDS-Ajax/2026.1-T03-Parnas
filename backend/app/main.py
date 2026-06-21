"""Ponto de entrada da aplicação FastAPI — KeepUnB."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import auth, users, tickets, technicians, comments, admin
from app.core.error_handlers import register_error_handlers
from app.core.openapi import configure_openapi

BACKEND_DIR = Path(__file__).resolve().parents[1]
UPLOADS_DIR = BACKEND_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="KeepUnB API",
    description="API para o sistema KeepUnB de gestão de manutenção",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

register_error_handlers(app)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

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
app.include_router(technicians.router)
app.include_router(comments.router)
app.include_router(admin.router)
configure_openapi(app)


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
