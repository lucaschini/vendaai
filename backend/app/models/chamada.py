import uuid
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.utils.database import Base


class Chamada(Base):
    __tablename__ = "chamadas"

    id_chamada = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    data_hora = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    duracao = Column(Integer, nullable=True)  # Duração em segundos
    resultado = Column(
        String(50),
        CheckConstraint("resultado IN ('sucesso', 'falha', 'em_andamento')"),
        nullable=True,
    )
    transcricao = Column(Text, nullable=True)
    id_usuario = Column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.id_usuario", ondelete="CASCADE"),
        nullable=False,
    )
    id_cliente = Column(
        UUID(as_uuid=True),
        ForeignKey("clientesleads.id_cliente", ondelete="CASCADE"),
        nullable=False,
    )
    id_venda = Column(
        UUID(as_uuid=True),
        ForeignKey("vendas.id_venda", ondelete="SET NULL"),
        nullable=True,
    )

    # Relacionamentos
    usuario = relationship("User", backref="chamadas")
    cliente = relationship("ClienteLead", backref="chamadas")
    venda = relationship("Venda", backref="chamadas")

    def __repr__(self):
        return f"<Chamada {self.resultado} - {self.data_hora}>"
