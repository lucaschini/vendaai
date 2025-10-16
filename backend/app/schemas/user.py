from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


# Schema para criação de usuário
class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


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
