from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.chamada import Chamada
from app.models.user import User
from app.schemas.chamada import ChamadaCreate, ChamadaResponse, ChamadaUpdate
from app.utils.database import get_db
from app.utils.security import get_current_user

router = APIRouter(prefix="/chamadas", tags=["Chamadas"])


@router.post("/", response_model=ChamadaResponse, status_code=status.HTTP_201_CREATED)
def criar_chamada(
    chamada: ChamadaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria um novo registro de chamada"""
    nova_chamada = Chamada(
        data_hora=chamada.data_hora,
        duracao=chamada.duracao,
        resultado=chamada.resultado,
        transcricao=chamada.transcricao,
        id_usuario=chamada.id_usuario,
        id_cliente=chamada.id_cliente,
        id_venda=chamada.id_venda,
    )
    db.add(nova_chamada)
    db.commit()
    db.refresh(nova_chamada)
    return nova_chamada


@router.get("/", response_model=list[ChamadaResponse])
def listar_chamadas(
    skip: int = 0,
    limit: int = 100,
    resultado: str = None,
    id_cliente: UUID = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista todas as chamadas do usuário atual"""
    query = db.query(Chamada).filter(Chamada.id_usuario == current_user.id_usuario)

    if resultado:
        query = query.filter(Chamada.resultado == resultado)

    if id_cliente:
        query = query.filter(Chamada.id_cliente == id_cliente)

    chamadas = query.order_by(Chamada.data_hora.desc()).offset(skip).limit(limit).all()
    return chamadas


@router.get("/{id_chamada}", response_model=ChamadaResponse)
def obter_chamada(
    id_chamada: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém uma chamada específica"""
    chamada = (
        db.query(Chamada)
        .filter(
            Chamada.id_chamada == id_chamada,
            Chamada.id_usuario == current_user.id_usuario,
        )
        .first()
    )

    if not chamada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chamada não encontrada"
        )
    return chamada


@router.put("/{id_chamada}", response_model=ChamadaResponse)
def atualizar_chamada(
    id_chamada: UUID,
    chamada_update: ChamadaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza uma chamada existente"""
    chamada = (
        db.query(Chamada)
        .filter(
            Chamada.id_chamada == id_chamada,
            Chamada.id_usuario == current_user.id_usuario,
        )
        .first()
    )

    if not chamada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chamada não encontrada"
        )

    update_data = chamada_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(chamada, field, value)

    db.commit()
    db.refresh(chamada)
    return chamada


@router.delete("/{id_chamada}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_chamada(
    id_chamada: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deleta uma chamada"""
    chamada = (
        db.query(Chamada)
        .filter(
            Chamada.id_chamada == id_chamada,
            Chamada.id_usuario == current_user.id_usuario,
        )
        .first()
    )

    if not chamada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chamada não encontrada"
        )

    db.delete(chamada)
    db.commit()
    return None
