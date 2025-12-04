from app.models.chamada import Chamada
from app.models.cliente import ClienteLead
from app.models.historico_chat import HistoricoChat
from app.models.sugestao_ia import SugestaoIA
from app.models.user import User
from app.models.venda import Venda

__all__ = [
    "User",
    "ClienteLead",
    "Venda",
    "Chamada",
    "SugestaoIA",
    "HistoricoChat",
]
