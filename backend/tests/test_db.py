from app.utils.database import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        version = result.fetchone()
        print("✅ Conexão bem-sucedida!")
        print(f"PostgreSQL version: {version[0]}")
except Exception as e:
    print(f"❌ Erro na conexão: {e}")
