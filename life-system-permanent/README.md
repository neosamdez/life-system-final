# Life System - Gamificação Pessoal + Gestão Financeira

Uma aplicação web completa para gamificação pessoal com sistema de quests, atributos RPG e gestão financeira integrada.

## 🏗️ Arquitetura

```
life-system-permanent/
├── backend/                 # FastAPI + SQLAlchemy
│   └── app/
│       ├── api/            # Endpoints
│       ├── models/         # SQLAlchemy models
│       ├── schemas/        # Pydantic schemas
│       ├── services/       # Lógica de negócio
│       └── core/           # Configurações
├── client/                 # Next.js Frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── requirements.txt        # Dependências Python
├── Procfile               # Deploy no Render
└── README.md
```

## 🚀 Início Rápido

### Backend (Python)

1. **Instale as dependências**:
```bash
pip install -r requirements.txt
```

2. **Configure o banco de dados**:
```bash
# Crie um arquivo .env com:
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
SECRET_KEY=seu-secret-key
```

3. **Inicie o servidor**:
```bash
uvicorn backend.app.main:app --reload
```

A API estará disponível em `http://localhost:8000`

### Frontend (Next.js)

1. **Instale as dependências**:
```bash
cd client
npm install
```

2. **Configure a URL da API**:
```bash
# Crie um arquivo .env.local com:
VITE_API_URL=http://localhost:8000/api/v1
```

3. **Inicie o servidor**:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação
- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Fazer login
- `GET /api/v1/auth/me` - Obter dados do usuário atual

## 🗄️ Banco de Dados

### Tabelas
- **users** - Usuários do sistema
- **player_stats** - Estatísticas de gamificação
- **quests** - Missões do jogador
- **transactions** - Transações financeiras

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação.

1. O usuário faz login com email e senha
2. Recebe um token JWT
3. Envia o token no header `Authorization: Bearer <token>` para requisições autenticadas

## 📦 Deploy

### Backend (Render)

1. Faça push do código para GitHub
2. Crie uma nova aplicação no [Render](https://render.com)
3. Conecte o repositório GitHub
4. Configure as variáveis de ambiente:
   - `DATABASE_URL` - URL do PostgreSQL (Supabase)
   - `SECRET_KEY` - Chave secreta
5. Deploy automático ao fazer push

### Frontend (Vercel)

1. Faça push do código para GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente:
   - `VITE_API_URL` - URL da API no Render
4. Deploy automático

## 🛠️ Desenvolvimento

### Adicionar novo endpoint

1. Crie um novo arquivo em `backend/app/api/endpoints/`
2. Defina os schemas em `backend/app/schemas/`
3. Implemente a lógica em `backend/app/services/`
4. Registre o router em `backend/app/main.py`

### Adicionar novo modelo

1. Defina o modelo em `backend/app/models/models.py`
2. Crie os schemas correspondentes
3. Execute `alembic upgrade head` para migrar o banco

## 📝 Tecnologias

### Backend
- **FastAPI** - Framework web
- **SQLAlchemy 2.0** - ORM
- **PostgreSQL** - Banco de dados
- **Pydantic** - Validação de dados
- **PyJWT** - Autenticação

### Frontend
- **Next.js** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️

---

**Documentação completa**: Veja `ARCHITECTURE_GUIDE.md` para detalhes sobre a arquitetura.
