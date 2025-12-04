from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# Schema para criação de venda
class VendaCreate(BaseModel):
    titulo: str = Field(..., min_length=5, max_length=200)
    valor: Decimal = Field(..., gt=0, decimal_places=2)
    status: str = Field(
        default="em_negociacao", pattern="^(em_negociacao|fechada|perdida|cancelada)$"
    )
    data_fechamento: Optional[date] = None
    observacoes: Optional[str] = None
    id_cliente: UUID
    id_usuario: Optional[UUID] = None


# Schema para atualização de venda
class VendaUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=5, max_length=200)
    valor: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    status: Optional[str] = Field(
        None, pattern="^(em_negociacao|fechada|perdida|cancelada)$"
    )
    data_fechamento: Optional[date] = None
    observacoes: Optional[str] = None


# Schema de resposta da venda
class VendaResponse(BaseModel):
    id_venda: UUID
    titulo: str
    valor: Decimal
    status: str
    data_fechamento: Optional[date]
    observacoes: Optional[str]
    id_cliente: UUID
    id_usuario: Optional[UUID]
    data_criacao: datetime
    data_atualizacao: datetime

    class Config:
        from_attributes = True
