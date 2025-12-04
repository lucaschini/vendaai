import uuid

from sqlalchemy import Boolean, Column, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.utils.database import Base


class SugestaoIA(Base):
    __tablename__ = "sugestoesia"

    id_sugestao = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    conteudo = Column(Text, nullable=False)
    momento = Column(Integer, nullable=True)  # Momento da chamada em segundos
    aceita = Column(Boolean, default=False)
    id_chamada = Column(
        UUID(as_uuid=True),
        ForeignKey("chamadas.id_chamada", ondelete="CASCADE"),
        nullable=False,
    )

    # Relacionamentos
    chamada = relationship("Chamada", backref="sugestoes")

    def __repr__(self):
        return f"<SugestaoIA - Aceita: {self.aceita}>"
