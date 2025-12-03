import uuid

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.utils.database import Base


class ClienteLead(Base):
    __tablename__ = "clientesleads"

    id_cliente = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    nome = Column(String(100), nullable=False, index=True)
    telefone = Column(String(15), nullable=True)
    e_mail = Column(String(100), nullable=True)
    empresa = Column(String(100), nullable=True)
    observacao = Column(String(100), nullable=True)

    # NOVO: Relacionamento com o usuário que criou o cliente
    id_usuario = Column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.id_usuario", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Relacionamento
    usuario = relationship("User", backref="clientes")

    def __repr__(self):
        return f"<ClienteLead {self.nome}>"
