from app.schemas.chamada import (
    ChamadaCreate,
    ChamadaResponse,
    ChamadaUpdate,
)
from app.schemas.cliente import (
    ClienteLeadCreate,
    ClienteLeadResponse,
    ClienteLeadUpdate,
)
from app.schemas.historico_chat import (
    HistoricoChatCreate,
    HistoricoChatResponse,
)
from app.schemas.sugestao_ia import (
    SugestaoIACreate,
    SugestaoIAResponse,
    SugestaoIAUpdate,
)
from app.schemas.user import (
    Token,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.schemas.venda import (
    VendaCreate,
    VendaResponse,
    VendaUpdate,
)

__all__ = [
    # User
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "Token",
    # Cliente
    "ClienteLeadCreate",
    "ClienteLeadUpdate",
    "ClienteLeadResponse",
    # Venda
    "VendaCreate",
    "VendaUpdate",
    "VendaResponse",
    # Chamada
    "ChamadaCreate",
    "ChamadaUpdate",
    "ChamadaResponse",
    # Sugestão IA
    "SugestaoIACreate",
    "SugestaoIAUpdate",
    "SugestaoIAResponse",
    # Histórico Chat
    "HistoricoChatCreate",
    "HistoricoChatResponse",
]
