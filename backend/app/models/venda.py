import uuid
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.utils.database import Base


class Venda(Base):
    __tablename__ = "vendas"

    id_venda = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    titulo = Column(String(200), nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), nullable=False, default="em_negociacao", index=True)
    data_fechamento = Column(Date, nullable=True)
    observacoes = Column(Text, nullable=True)
    id_cliente = Column(
        UUID(as_uuid=True),
        ForeignKey("clientesleads.id_cliente", ondelete="CASCADE"),
        nullable=False,
    )
    id_usuario = Column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.id_usuario", ondelete="SET NULL"),
        nullable=True,
    )
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relacionamentos
    cliente = relationship("ClienteLead", backref="vendas")
    usuario = relationship("User", backref="vendas")

    def __repr__(self):
        return f"<Venda {self.titulo} - R$ {self.valor}>"
