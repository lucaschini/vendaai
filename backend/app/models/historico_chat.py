import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.utils.database import Base


class HistoricoChat(Base):
    __tablename__ = "historicochat"

    id_mensagem = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    interacao = Column(Text, nullable=False)
    data_envio = Column(DateTime, default=datetime.utcnow)
    id_usuario = Column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.id_usuario", ondelete="CASCADE"),
        nullable=False,
    )

    # Relacionamentos
    usuario = relationship("User", backref="historico_chat")

    def __repr__(self):
        return f"<HistoricoChat {self.data_envio}>"
