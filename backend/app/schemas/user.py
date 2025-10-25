from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


# Schema para criação de usuário
class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_lenght=72)


# Schema para login
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Schema de resposta do usuário (não inclui senha)
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    is_active: bool
    custom_text: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True  # Permite conversão de ORM models


# Schema de resposta do token
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Schema para validação do token
class TokenData(BaseModel):
    user_id: Optional[int] = None


# Schema para atualizar texto customizado
class UpdateCustomText(BaseModel):
    custom_text: str = Field(..., min_length=1, max_length=1000)


# Schema de resposta do texto
class CustomTextResponse(BaseModel):
    custom_text: Optional[str] = None
    user_id: int
    username: str
