# KeepUnB - Sistema de Gestão de solicitações de manutenção da UnB-FCTE

O **KeepUnB** é uma plataforma centralizada e inteligente desenvolvida para otimizar, automatizar e rastrear as solicitações de manutenção corretiva e preventiva na Universidade de Brasília (UnB). 

O sistema permite que os solicitantes relatem problemas de infraestrutura, enquanto fornece ferramentas robustas para administradores, gerentes de equipe e técnicos gerenciarem o ciclo de vida de cada chamado.

---

## Principais Funcionalidades

- **Abertura de Chamados** 
- **Painéis Customizados por Perfil**:
  - **Solicitante**: Acompanha seus chamados e cria novos relatos de manutenção.
  - **Técnico**: Acessa a fila de tarefas designadas e atualiza o andamento das ordens de serviço.
  - **Gerente**: Distribui chamados para equipes técnicas e acompanha o andamento das tarefas em tempo real.
  - **Admin**: Gerencia o cadastro de usuários e configurações gerais do sistema.
- **Rastreamento em Tempo Real**: Histórico detalhado de atualizações e comentários em cada chamado.


---

## Especificações Técnicas

A arquitetura do KeepUnB é dividida em serviços independentes utilizando tecnologias modernas e de alta performance:

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router) & [React 18](https://react.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: Vanilla CSS (CSS Variables & Design Tokens customizados)
- **Ambiente de Execução (Runtime)**: [Node.js 20+](https://nodejs.org/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (Assíncrono)
- **Migrações**: [Alembic](https://alembic.sqlalchemy.org/)
- **Banco de Dados**: [PostgreSQL 16](https://www.postgresql.org/) (com driver assíncrono [asyncpg](https://github.com/MagicStack/asyncpg))
- **Validação de Dados**: [Pydantic v2](https://docs.pydantic.dev/)

### Infraestrutura & Devops
- **Containers**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## Como Rodar o Projeto Localmente

### Pré-requisitos Básicos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

1. **Git** (para controle de versão)
2. **Docker & Docker Compose** (para rodar a aplicação localmente)
3. **Python 3.12+** (para rodar ferramentas de qualidade locais)
4. **Node.js 20+** (para o frontend)


### Passo a Passo de Inicialização

### 1. Clonar o Repositório e Navegar até a Branch Correta

O desenvolvimento principal do projeto ocorre a partir da branch `developer`.

```bash
# Clone o repositório
git clone "https://github.com/FGA0138-MDS-Ajax/2026.1-T03-Parnas.git" keep-unb
cd keep-unb

# Garanta que você está na branch de desenvolvimento
git checkout developer
```

### 2. Configurar os Arquivos de Variáveis de Ambiente (`.env`)

Tanto o backend quanto o frontend possuem modelos de configuração (`.env.example`). Você precisa copiá-los e criar as configurações locais:

```bash
# Configuração do Backend
cp backend/.env.example backend/.env

# Configuração do Frontend
cp frontend/.env.example frontend/.env
```


**As configurações padrões contidas nos arquivos `.env.example` já estão preparadas para funcionar imediatamente com o Docker Compose local.**


### 3. Subir o Ambiente com Docker Compose

O Docker subirá o banco de dados (PostgreSQL), o backend (FastAPI) e o frontend (Next.js):

```bash
docker compose up --build
```

Após o build e a inicialização, você poderá acessar:

- **Frontend (Next.js):** http://localhost:3000
- **Backend API (FastAPI):** http://localhost:8000
- **Documentação Automática da API (Swagger UI):** http://localhost:8000/docs

### 4. Popular o Banco com Usuários e Chamados de Teste (Seed)

Para testar as diferentes funcionalidades, permissões e fluxos de chamados do sistema, execute as migrações de banco e o script de seed oficial:

```bash
# Rodar as migrações do banco
docker compose exec backend alembic upgrade head

# Criar os usuários e chamados de teste (Seed Oficial)
docker compose exec backend python scripts/seed_test_5.py
```

Você poderá acessar o sistema utilizando as seguintes credenciais:
* **Senha para todos:** `123`
* **E-mails por perfil:**
  * **Solicitantes:** `solicitante1@unb.br`, `solicitante2@unb.br`, `solicitante3@unb.br`
  * **Técnicos (Ativos):** `tecnico1@unb.br`, `tecnico2@unb.br`
  * **Técnico (Pendente):** `tecnico_pendente@unb.br`
  * **Técnico (Reprovado):** `tecnico_reprovado@unb.br`
  * **Gerentes:** `gerente1@unb.br`, `gerente2@unb.br`
  * **Administradores:** `admin1@unb.br`, `admin2@unb.br`

##  Estrutura do Repositório

```text
keep-unb/
├── backend/            # Código-fonte do servidor FastAPI
│   ├── app/            # Módulos principais (core, models, repositories, routers, schemas, services, utils)
│   ├── migrations/     # Arquivos de migração de banco gerados pelo Alembic
│   └── tests/          # Testes automatizados do backend com PyTest
├── frontend/           # Aplicação web em Next.js (TypeScript)
│   ├── src/
│   │   ├── app/        # Páginas e rotas da aplicação (App Router)
│   │   ├── features/   # Componentes e lógica agrupados por funcionalidade (Ex: landing)
│   │   └── styles/     # Arquivos de estilo globais
│   └── public/         # Ativos estáticos e logotipos oficiais
├── docs/               # Guias rápidos de desenvolvimento e relatórios de sprint
└── docker-compose.yml  # Configuração de containers de desenvolvimento
```


