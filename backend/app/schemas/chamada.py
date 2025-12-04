from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# Schema para criação de chamada
class ChamadaCreate(BaseModel):
    data_hora: Optional[datetime] = None
    duracao: Optional[int] = Field(None, ge=0)
    resultado: Optional[str] = Field(None, pattern="^(sucesso|falha|em_andamento)$")
    transcricao: Optional[str] = None
    id_usuario: UUID
    id_cliente: UUID
    id_venda: Optional[UUID] = None


# Schema para atualização de chamada
class ChamadaUpdate(BaseModel):
    duracao: Optional[int] = Field(None, ge=0)
    resultado: Optional[str] = Field(None, pattern="^(sucesso|falha|em_andamento)$")
    transcricao: Optional[str] = None
    id_venda: Optional[UUID] = None


# Schema de resposta da chamada
class ChamadaResponse(BaseModel):
    id_chamada: UUID
    data_hora: datetime
    duracao: Optional[int]
    resultado: Optional[str]
    transcricao: Optional[str]
    id_usuario: UUID
    id_cliente: UUID
    id_venda: Optional[UUID]

    class Config:
        from_attributes = True
