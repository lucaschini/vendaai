from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# Schema para criação de usuário
class UserCreate(BaseModel):
    nome: str = Field(..., min_length=3, max_length=100)
    e_mail: EmailStr
    senha: str = Field(..., min_length=6, max_length=72, alias="password")
    tipo_usuario: Optional[str] = "vendedor"


# Schema para login
class UserLogin(BaseModel):
    e_mail: EmailStr = Field(..., alias="e_mail")
    senha: str = Field(..., alias="password")


# Schema de resposta do usuário
class UserResponse(BaseModel):
    id_usuario: UUID
    nome: str
    e_mail: str
    tipo_usuario: Optional[str]
    data_criacao: date
    ultimo_login: Optional[date]

    class Config:
        from_attributes = True


# Schema de resposta do token
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
