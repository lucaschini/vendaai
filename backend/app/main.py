from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, chamada, clientes, historico_chat, sugestoes, user, vendas
from app.utils.database import Base, engine

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
    allow_origins=settings.ALLOWED_ORIGINS,  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(chamada.router)
app.include_router(clientes.router)
app.include_router(sugestoes.router)
app.include_router(vendas.router)
app.include_router(historico_chat.router)


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
