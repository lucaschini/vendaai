from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UpdateCustomText, CustomTextResponse, UserResponse
from app.models.user import User
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


@router.get("/text", response_model=CustomTextResponse)
async def get_user_text(current_user: User = Depends(get_current_user)):
    """
    Retorna o texto personalizado do usuário autenticado
    Rota protegida - requer token JWT válido
    """
    if not current_user.custom_text:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário ainda não possui texto personalizado",
        )

    return {
        "custom_text": current_user.custom_text,
        "user_id": current_user.id,
        "username": current_user.username,
    }


@router.post("/text", response_model=CustomTextResponse)
async def create_or_update_text(
    text_data: UpdateCustomText,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Cria ou atualiza o texto personalizado do usuário
    Rota protegida - requer token JWT válido
    """
    current_user.custom_text = text_data.custom_text
    db.commit()
    db.refresh(current_user)

    return {
        "custom_text": current_user.custom_text,
        "user_id": current_user.id,
        "username": current_user.username,
    }


@router.delete("/text")
async def delete_user_text(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Remove o texto personalizado do usuário
    Rota protegida - requer token JWT válido
    """
    if not current_user.custom_text:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não possui texto para deletar",
        )

    current_user.custom_text = None
    db.commit()

    return {"message": "Texto deletado com sucesso"}
