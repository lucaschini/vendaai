from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Segurança
    SECRET_KEY: str = "sua-chave-secreta-mude-isso-em-producao"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Banco de Dados
    DATABASE_URL: str = "sqlite:///./app.db"

    # CORS - Permite requests da extensão
    ALLOWED_ORIGINS: list = ["chrome-extension://*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
