from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserResponse
from app.utils.database import get_db
from app.utils.security import get_current_user

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/dashboard", response_model=UserResponse)
async def get_dashboard(current_user: User = Depends(get_current_user)):
    """
    Endpoint protegido - Dashboard do usuário
    Retorna informações do usuário autenticado
    """
    return current_user


@router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    return {"total_vendas": 150, "receita_mes": 5000.00, "clientes_ativos": 42}
