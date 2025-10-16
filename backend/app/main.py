from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth
from app.utils.database import engine, Base
from app.config import settings

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Inicializar FastAPI
app = FastAPI(
    title="backend venda ai",
    description="API com autenticação JWT para extensão de navegador",
    version="1.0.0",
)

# Configurar CORS para permitir requests da extensão
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "message": "API de Autenticação para Extensão de Navegador",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
