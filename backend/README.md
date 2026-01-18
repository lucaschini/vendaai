
API REST desenvolvida em Python com FastAPI, fornecendo sistema completo de autenticação JWT e gerenciamento de dados de usuários para extensões de navegador.

## ✨ Características

- 🔐 **Autenticação JWT** completa (login, registro, refresh token)
- 👤 **Gerenciamento de usuários** com validação de dados
- 🔒 **Rotas protegidas** com middleware de autenticação
- 🗄️ **Suporte a PostgreSQL e SQLite**
- 📚 **Documentação automática** com Swagger/OpenAPI
- 🌐 **CORS configurado** para extensões de navegador
- 🛡️ **Senhas criptografadas** com argon2
- ✅ **Validação de dados** com Pydantic

## 🛠 Tecnologias

- **Python 3.8+**
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **PostgreSQL/SQLite** - Banco de dados
- **JWT** - JSON Web Tokens para autenticação
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI
- **Passlib + Argon2** - Hash de senhas

## 📁 Estrutura do Projeto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicação principal
│   ├── config.py               # Configurações e variáveis de ambiente
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py            # Modelo de usuário
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── user.py            # Schemas Pydantic
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py            # Rotas de autenticação
│   │   └── user.py            # Rotas de usuário
│   └── utils/
│       ├── __init__.py
│       ├── security.py        # Funções de segurança e JWT
│       └── database.py        # Configuração do banco
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Crie um ambiente virtual

```bash
python -m venv venv

# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

## ⚙️ Configuração

### 1. Configure o banco de dados

**Opção A: SQLite (Desenvolvimento)**

Crie o arquivo `.env`:

```bash
SECRET_KEY=sua-chave-secreta-super-segura-aqui
DATABASE_URL=sqlite:///./app.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Opção B: PostgreSQL (Produção)**

```bash
SECRET_KEY=sua-chave-secreta-super-segura-aqui
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. Gere uma SECRET_KEY segura

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
uvicorn app.main:app --reload
```

A API estará disponível em: `http://localhost:8000`

### Documentação Interativa

Acesse a documentação automática do Swagger:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc


