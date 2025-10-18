from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Segurança (OBRIGATÓRIO no .env)
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # Banco de Dados (OBRIGATÓRIO no .env)
    DATABASE_URL: str

    # CORS - Permite requests da extensão
    ALLOWED_ORIGINS: list

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
