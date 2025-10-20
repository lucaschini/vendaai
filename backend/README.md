#Backend para Extensão

API REST desenvolvida em Python com FastAPI, fornecendo sistema completo de autenticação JWT e gerenciamento de dados de usuários para extensões de navegador.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação](#-autenticação)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Contribuindo](#-contribuindo)

## ✨ Características

- 🔐 **Autenticação JWT** completa (login, registro, refresh token)
- 👤 **Gerenciamento de usuários** com validação de dados
- 📝 **Textos personalizados** por usuário
- 🔒 **Rotas protegidas** com middleware de autenticação
- 🗄️ **Suporte a PostgreSQL e SQLite**
- 📚 **Documentação automática** com Swagger/OpenAPI
- 🌐 **CORS configurado** para extensões de navegador
- 🛡️ **Senhas criptografadas** com bcrypt
- ✅ **Validação de dados** com Pydantic

## 🛠 Tecnologias

- **Python 3.8+**
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **PostgreSQL/SQLite** - Banco de dados
- **JWT** - JSON Web Tokens para autenticação
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI
- **Passlib + Bcrypt** - Hash de senhas

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

## 🔌 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/register` | Registrar novo usuário | Não |
| POST | `/auth/login` | Fazer login | Não |
| GET | `/auth/me` | Obter usuário atual | ✅ |
| POST | `/auth/refresh` | Renovar token | ✅ |

### Usuário

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/user/text` | Buscar texto personalizado | ✅ |
| POST | `/user/text` | Criar/atualizar texto | ✅ |
| DELETE | `/user/text` | Deletar texto | ✅ |

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Status da API |
| GET | `/health` | Health check |

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Registro**: Crie uma conta com email, username e senha
2. **Login**: Receba um token JWT
3. **Uso**: Envie o token no header `Authorization: Bearer <token>`
4. **Refresh**: Renove o token quando necessário

### Exemplo de Header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 💡 Exemplos de Uso

### Registrar Usuário

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "username": "meu_usuario",
    "password": "senha_segura123"
  }'
```

### Fazer Login

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha_segura123"
  }'
```

### Acessar Rota Protegida

```bash
curl -X GET "http://localhost:8000/user/text" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Salvar Texto Personalizado

```bash
curl -X POST "http://localhost:8000/user/text" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "custom_text": "Meu texto personalizado"
  }'
```

## 🌐 Integração com Extensão

### JavaScript/TypeScript

```javascript
// Login
async function login(email, password) {
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  // Salvar token
  await chrome.storage.local.set({ token: data.access_token });
  return data;
}

// Buscar dados protegidos
async function fetchUserText() {
  const { token } = await chrome.storage.local.get(['token']);

  const response = await fetch('http://localhost:8000/user/text', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return await response.json();
}
```


## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Seu Nome
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Email: seu-email@email.com

## 🐛 Problemas Conhecidos

- No plano gratuito do Render, o servidor hiberna após 15min de inatividade

## 📚 Recursos Adicionais

- [Documentação FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!
