from .app.config import settings

print(f"✅ SECRET_KEY carregada: {settings.SECRET_KEY[:10]}...")
print(f"✅ DATABASE_URL: {settings.DATABASE_URL}")
print(f"✅ Tipo de EXPIRE_MINUTES: {type(settings.ACCESS_TOKEN_EXPIRE_MINUTES)}")
