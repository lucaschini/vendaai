from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# Schema para criação de mensagem
class HistoricoChatCreate(BaseModel):
    interacao: str = Field(..., min_length=1)
    id_usuario: UUID


# Schema de resposta da mensagem
class HistoricoChatResponse(BaseModel):
    id_mensagem: UUID
    interacao: str
    data_envio: datetime
    id_usuario: UUID

    class Config:
        from_attributes = True
