# Life System - Gamificação Pessoal + Gestão Financeira

Uma aplicação web completa para gamificação pessoal com sistema de quests, atributos RPG e gestão financeira integrada.

## � Funcionalidades Principais

- **Gamificação Pessoal**: Transforme tarefas em quests e ganhe XP.
- **Sistema de Level Up**: Suba de nível ao completar tarefas (Easy=10xp, Medium=30xp, Hard=50xp).
- **Atributos RPG**: Melhore Força, Inteligência, Carisma, etc.
- **Gestão Financeira**: Controle receitas e despesas com categorias personalizadas.
- **Dashboard Interativo**: Visualize seu progresso e status atual.

## �🏗️ Arquitetura

```
life-system-permanent/
├── backend/                 # FastAPI + SQLAlchemy (Async)
│   └── app/
│       ├── api/            # Endpoints (Auth, Quests, Players)
│       ├── models/         # SQLAlchemy models
│       ├── schemas/        # Pydantic schemas
│       ├── services/       # Lógica de negócio
│       └── core/           # Configurações
├── client/                 # Next.js Frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── services/       # Integração API (Axios)
│       └── types/
├── requirements.txt        # Dependências Python
├── Procfile               # Deploy no Render
└── README.md
```

## 🚀 Início Rápido

### Backend (Python)

1. **Instale as dependências** (Recomendado usar `venv`):

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

2. **Configure o banco de dados**:
   Crie um arquivo `.env` na raiz com sua string de conexão:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
SECRET_KEY=sua-chave-secreta-aqui
```

3. **Inicialize o Banco de Dados**:

```bash
source venv/bin/activate
python backend/init_db.py
```

4. **Inicie o servidor**:

```bash
source venv/bin/activate
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
   Crie um arquivo `.env.local` em `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Inicie o servidor**:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Obter dados do usuário atual

### Quests

- `GET /quests` - Listar quests
- `POST /quests` - Criar nova quest
- `PATCH /quests/{id}/complete` - Completar quest (Ganha XP e verifica Level Up)

### Player

- `GET /player/stats` - Ver estatísticas e nível

## 🗄️ Banco de Dados

### Tabelas

- **users** - Usuários do sistema
- **player_stats** - Estatísticas de gamificação (XP, Nível, Atributos)
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
   - `NEXT_PUBLIC_API_URL` - URL da API no Render
4. Deploy automático

## Tecnologias

### Backend

- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy 2.0 (Async)** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Pydantic** - Validação de dados robusta

### Frontend

- **Next.js** - Framework React para produção
- **TypeScript** - Segurança de tipos
- **Tailwind CSS** - Estilização utilitária
- **Axios** - Cliente HTTP otimizado

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️ para o projeto Life System.
