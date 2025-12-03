from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# Schema para criação de cliente
class ClienteLeadCreate(BaseModel):
    nome: str = Field(..., min_length=3, max_length=100)
    telefone: Optional[str] = Field(None, max_length=15)
    e_mail: Optional[EmailStr] = None
    empresa: Optional[str] = Field(None, max_length=100)
    observacao: Optional[str] = Field(None, max_length=100)
    # id_usuario será atribuído automaticamente pelo backend usando current_user
    # Não precisa ser enviado pelo frontend


# Schema para atualização de cliente
class ClienteLeadUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=3, max_length=100)
    telefone: Optional[str] = Field(None, max_length=15)
    e_mail: Optional[EmailStr] = None
    empresa: Optional[str] = Field(None, max_length=100)
    observacao: Optional[str] = Field(None, max_length=100)


# Schema de resposta do cliente
class ClienteLeadResponse(BaseModel):
    id_cliente: UUID
    nome: str
    telefone: Optional[str]
    e_mail: Optional[str]
    empresa: Optional[str]
    observacao: Optional[str]
    id_usuario: UUID  # ✅ NOVO: ID do usuário que criou o cliente

    class Config:
        from_attributes = True
