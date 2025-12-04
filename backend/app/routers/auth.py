# app/routers/auth.py - ATUALIZADO PARA UUID

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse
from app.utils.database import get_db
from app.utils.security import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registrar novo usuário"""

    # Verificar se email já existe
    if db.query(User).filter(User.e_mail == user_data.e_mail).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado"
        )

    # Criar o novo usuário
    new_user = User(
        nome=user_data.nome,
        e_mail=user_data.e_mail,
        senha_hash=get_password_hash(user_data.senha),
        tipo_usuario=user_data.tipo_usuario,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Gera token de acesso (UUID convertido para string)
    access_token = create_access_token(data={"sub": str(new_user.id_usuario)})

    return {"access_token": access_token, "token_type": "bearer", "user": new_user}


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Realiza login do usuário"""

    # Busca usuário pelo email
    user = db.query(User).filter(User.e_mail == user_data.e_mail).first()

    if not user or not verify_password(user_data.senha, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Atualizar último login
    user.ultimo_login = date.today()
    db.commit()

    # Gera token de acesso (UUID convertido para string)
    access_token = create_access_token(data={"sub": str(user.id_usuario)})

    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Retorna dados do usuário autenticado"""
    return current_user


@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Renova o token de acesso"""
    access_token = create_access_token(data={"sub": str(current_user.id_usuario)})

    return {"access_token": access_token, "token_type": "bearer", "user": current_user}
