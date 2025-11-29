from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.sugestao_ia import SugestaoIA
from app.models.user import User
from app.schemas.sugestao_ia import (
    SugestaoIACreate,
    SugestaoIAResponse,
    SugestaoIAUpdate,
)
from app.utils.database import get_db
from app.utils.security import get_current_user

router = APIRouter(prefix="/sugestoes", tags=["Sugestões IA"])


@router.post(
    "/", response_model=SugestaoIAResponse, status_code=status.HTTP_201_CREATED
)
def criar_sugestao(
    sugestao: SugestaoIACreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria uma nova sugestão de IA"""
    nova_sugestao = SugestaoIA(
        conteudo=sugestao.conteudo,
        momento=sugestao.momento,
        aceita=sugestao.aceita,
        id_chamada=sugestao.id_chamada,
    )
    db.add(nova_sugestao)
    db.commit()
    db.refresh(nova_sugestao)
    return nova_sugestao


@router.get("/", response_model=list[SugestaoIAResponse])
def listar_sugestoes(
    skip: int = 0,
    limit: int = 100,
    aceita: bool = None,
    id_chamada: UUID = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista todas as sugestões de IA vinculadas às chamadas do usuário"""
    # Join com Chamada para filtrar pelo usuário autenticado
    query = (
        db.query(SugestaoIA)
        .join(SugestaoIA.chamada)
        .filter(SugestaoIA.chamada.has(id_usuario=current_user.id_usuario))
    )

    if aceita is not None:
        query = query.filter(SugestaoIA.aceita == aceita)

    if id_chamada:
        query = query.filter(SugestaoIA.id_chamada == id_chamada)

    sugestoes = query.offset(skip).limit(limit).all()
    return sugestoes


@router.get("/{id_sugestao}", response_model=SugestaoIAResponse)
def obter_sugestao(
    id_sugestao: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém uma sugestão específica"""
    sugestao = (
        db.query(SugestaoIA)
        .join(SugestaoIA.chamada)
        .filter(
            SugestaoIA.id_sugestao == id_sugestao,
            SugestaoIA.chamada.has(id_usuario=current_user.id_usuario),
        )
        .first()
    )

    if not sugestao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sugestão não encontrada"
        )
    return sugestao


@router.put("/{id_sugestao}", response_model=SugestaoIAResponse)
def atualizar_sugestao(
    id_sugestao: UUID,
    sugestao_update: SugestaoIAUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza uma sugestão existente (marcar como aceita/não aceita)"""
    sugestao = (
        db.query(SugestaoIA)
        .join(SugestaoIA.chamada)
        .filter(
            SugestaoIA.id_sugestao == id_sugestao,
            SugestaoIA.chamada.has(id_usuario=current_user.id_usuario),
        )
        .first()
    )

    if not sugestao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sugestão não encontrada"
        )

    update_data = sugestao_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sugestao, field, value)

    db.commit()
    db.refresh(sugestao)
    return sugestao


@router.patch("/{id_sugestao}/aceitar", response_model=SugestaoIAResponse)
def aceitar_sugestao(
    id_sugestao: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Marca uma sugestão como aceita"""
    sugestao = (
        db.query(SugestaoIA)
        .join(SugestaoIA.chamada)
        .filter(
            SugestaoIA.id_sugestao == id_sugestao,
            SugestaoIA.chamada.has(id_usuario=current_user.id_usuario),
        )
        .first()
    )

    if not sugestao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sugestão não encontrada"
        )

    sugestao.aceita = True
    db.commit()
    db.refresh(sugestao)
    return sugestao


@router.delete("/{id_sugestao}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_sugestao(
    id_sugestao: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deleta uma sugestão"""
    sugestao = (
        db.query(SugestaoIA)
        .join(SugestaoIA.chamada)
        .filter(
            SugestaoIA.id_sugestao == id_sugestao,
            SugestaoIA.chamada.has(id_usuario=current_user.id_usuario),
        )
        .first()
    )

    if not sugestao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sugestão não encontrada"
        )

    db.delete(sugestao)
    db.commit()
    return None
