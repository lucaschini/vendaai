import uuid

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

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

    def __repr__(self):
        return f"<ClienteLead {self.nome}>"
