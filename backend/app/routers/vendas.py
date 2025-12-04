from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.venda import Venda
from app.schemas.venda import VendaCreate, VendaResponse, VendaUpdate
from app.utils.database import get_db
from app.utils.security import get_current_user

router = APIRouter(prefix="/vendas", tags=["Vendas"])


@router.post("/", response_model=VendaResponse, status_code=status.HTTP_201_CREATED)
def criar_venda(
    venda: VendaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria uma nova venda"""
    nova_venda = Venda(
        titulo=venda.titulo,
        valor=venda.valor,
        status=venda.status,
        data_fechamento=venda.data_fechamento,
        observacoes=venda.observacoes,
        id_cliente=venda.id_cliente,
        id_usuario=venda.id_usuario or current_user.id_usuario,
    )
    db.add(nova_venda)
    db.commit()
    db.refresh(nova_venda)
    return nova_venda


@router.get("/", response_model=list[VendaResponse])
def listar_vendas(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista todas as vendas do usuário atual"""
    query = db.query(Venda).filter(Venda.id_usuario == current_user.id_usuario)

    if status_filter:
        query = query.filter(Venda.status == status_filter)

    vendas = query.offset(skip).limit(limit).all()
    return vendas


@router.get("/{id_venda}", response_model=VendaResponse)
def obter_venda(
    id_venda: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém uma venda específica"""
    venda = (
        db.query(Venda)
        .filter(Venda.id_venda == id_venda, Venda.id_usuario == current_user.id_usuario)
        .first()
    )

    if not venda:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Venda não encontrada"
        )
    return venda


@router.put("/{id_venda}", response_model=VendaResponse)
def atualizar_venda(
    id_venda: UUID,
    venda_update: VendaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza uma venda existente"""
    venda = (
        db.query(Venda)
        .filter(Venda.id_venda == id_venda, Venda.id_usuario == current_user.id_usuario)
        .first()
    )

    if not venda:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Venda não encontrada"
        )

    update_data = venda_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(venda, field, value)

    db.commit()
    db.refresh(venda)
    return venda


@router.delete("/{id_venda}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_venda(
    id_venda: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deleta uma venda"""
    venda = (
        db.query(Venda)
        .filter(Venda.id_venda == id_venda, Venda.id_usuario == current_user.id_usuario)
        .first()
    )

    if not venda:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Venda não encontrada"
        )

    db.delete(venda)
    db.commit()
    return None
