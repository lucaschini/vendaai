from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# Schema para criação de sugestão
class SugestaoIACreate(BaseModel):
    conteudo: str = Field(..., min_length=10)
    momento: Optional[int] = Field(None, ge=0)
    aceita: bool = False
    id_chamada: UUID


# Schema para atualização de sugestão
class SugestaoIAUpdate(BaseModel):
    aceita: Optional[bool] = None


# Schema de resposta da sugestão
class SugestaoIAResponse(BaseModel):
    id_sugestao: UUID
    conteudo: str
    momento: Optional[int]
    aceita: bool
    id_chamada: UUID

    class Config:
        from_attributes = True
