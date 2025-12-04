from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.historico_chat import HistoricoChat
from app.models.user import User
from app.schemas.historico_chat import HistoricoChatCreate, HistoricoChatResponse
from app.utils.database import get_db
from app.utils.security import get_current_user

router = APIRouter(prefix="/historico-chat", tags=["Histórico de Chat"])


@router.post(
    "/", response_model=HistoricoChatResponse, status_code=status.HTTP_201_CREATED
)
def criar_mensagem(
    mensagem: HistoricoChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria uma nova mensagem no histórico de chat"""
    nova_mensagem = HistoricoChat(
        interacao=mensagem.interacao,
        id_usuario=mensagem.id_usuario,
    )
    db.add(nova_mensagem)
    db.commit()
    db.refresh(nova_mensagem)
    return nova_mensagem


@router.get("/", response_model=list[HistoricoChatResponse])
def listar_mensagens(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista todo o histórico de chat do usuário atual"""
    mensagens = (
        db.query(HistoricoChat)
        .filter(HistoricoChat.id_usuario == current_user.id_usuario)
        .order_by(HistoricoChat.data_envio.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return mensagens


@router.get("/{id_mensagem}", response_model=HistoricoChatResponse)
def obter_mensagem(
    id_mensagem: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém uma mensagem específica do histórico"""
    mensagem = (
        db.query(HistoricoChat)
        .filter(
            HistoricoChat.id_mensagem == id_mensagem,
            HistoricoChat.id_usuario == current_user.id_usuario,
        )
        .first()
    )

    if not mensagem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Mensagem não encontrada"
        )
    return mensagem


@router.delete("/{id_mensagem}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_mensagem(
    id_mensagem: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deleta uma mensagem do histórico"""
    mensagem = (
        db.query(HistoricoChat)
        .filter(
            HistoricoChat.id_mensagem == id_mensagem,
            HistoricoChat.id_usuario == current_user.id_usuario,
        )
        .first()
    )

    if not mensagem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Mensagem não encontrada"
        )

    db.delete(mensagem)
    db.commit()
    return None


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def limpar_historico(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Limpa todo o histórico de chat do usuário"""
    db.query(HistoricoChat).filter(
        HistoricoChat.id_usuario == current_user.id_usuario
    ).delete()
    db.commit()
    return None
