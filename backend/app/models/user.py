import uuid
from datetime import date

from sqlalchemy import Column, Date, String
from sqlalchemy.dialects.postgresql import UUID

from app.utils.database import Base


class User(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    nome = Column(String(100), nullable=False)
    e_mail = Column(String(100), unique=True, nullable=False, index=True)
    senha_hash = Column(String(255), nullable=False)
    tipo_usuario = Column(String(20), nullable=True)
    data_criacao = Column(Date, default=date.today)
    ultimo_login = Column(Date, nullable=True)

    def __repr__(self):
        return f"<User {self.nome} ({self.tipo_usuario})>"
