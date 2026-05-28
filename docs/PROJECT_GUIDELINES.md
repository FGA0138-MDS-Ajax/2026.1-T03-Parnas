# PROJECT GUIDELINES — KeepUnB

> **Versão:** 1.0  
> **Última atualização:** 2026-05-28  
> **Responsável:** Carlos Costa — Arquiteto de Software  
> **Propósito:** Servir como referência única de convenções técnicas para a equipe de desenvolvimento e agentes de IA.

---

## 1. Visão Geral do Sistema

O **KeepUnB** é uma plataforma web para centralizar e automatizar a gestão de solicitações de manutenção da FCTE/UnB, substituindo o processo atual baseado em e-mails. O sistema atende **quatro perfis de usuário** com permissões distintas:

| Perfil          | Descrição                          | Principais Permissões                                      |
| --------------- | ---------------------------------- | ---------------------------------------------------------- |
| **Solicitante** | Comunidade acadêmica               | Abrir, acompanhar e avaliar solicitações                   |
| **Técnico**     | Executores da manutenção           | Visualizar fila de chamados, atualizar status              |
| **Gerente**     | Supervisão e análise               | Monitorar métricas, gerar relatórios, delegar tarefas      |
| **Administrador** | Gestão técnica e de contas       | Gerenciar usuários, configurações do sistema, perfis de acesso |

---

## 2. Stack Tecnológica

| Camada         | Tecnologia                  | Justificativa                                       |
| -------------- | --------------------------- | --------------------------------------------------- |
| **Backend**    | Python 3.12+ / FastAPI      | Performance assíncrona, tipagem forte, docs automática |
| **Banco de Dados** | PostgreSQL 16+          | Robustez, suporte a JSON, extensibilidade           |
| **ORM**        | SQLAlchemy 2.x + Alembic    | Mapeamento relacional, migrações versionadas        |
| **Frontend**   | Next.js 14+ (React 18+)     | SSR/SSG, roteamento por App Router, performance     |
| **Estilização**| CSS Modules ou Tailwind CSS | Escopo por componente, utilitários rápidos           |
| **Containerização** | Docker + Docker Compose | Ambiente padronizado, deploy reprodutível           |
| **Integração** | REST API (JSON via HTTPS)   | Contrato claro entre front e back                   |
| **CI/CD**      | GitHub Actions              | Automação de testes, lint e deploy                  |
| **Controle de Versão** | Git / GitHub        | Branching model, code review                        |

---

## 3. Padrões Arquiteturais

### 3.1 Backend — MVC (Model-View-Controller)

O backend segue o padrão **MVC adaptado** para FastAPI:

- **Model:** Entidades do banco de dados (SQLAlchemy) e schemas de validação (Pydantic).
- **View (Router):** Definições de endpoints REST — recebe requisições, chama o controller/service e retorna respostas.
- **Controller (Service):** Lógica de negócio. Orquestra operações entre models e repositórios.

Camadas adicionais:
- **Repository:** Abstração de acesso a dados (queries ao banco).
- **Schema:** Objetos Pydantic para request/response (validação e serialização).
- **Core:** Configurações, segurança, dependências e utilitários transversais.

### 3.2 Frontend — Feature-Based por Perfil de Usuário

O frontend adota uma arquitetura **Feature-Based** onde cada módulo de funcionalidade é organizado dentro do perfil de usuário que o utiliza. Features compartilhadas ficam em `shared/`.

Cada feature é **autocontida**: possui seus componentes, hooks, serviços, tipos e estilos.

---

## 4. Estrutura de Pastas

### 4.1 Raiz do Projeto

```
keep-unb/
├── backend/                  # Aplicação FastAPI (MVC)
├── frontend/                 # Aplicação Next.js (Feature-Based)
├── docker-compose.yml        # Orquestração dos serviços
├── .github/                  # Workflows CI/CD
│   └── workflows/
├── docs/                     # Documentação do projeto
├── PROJECT_GUIDELINES.md     # Este documento
└── README.md
```

### 4.2 Backend (`backend/`)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Ponto de entrada (FastAPI app)
│   │
│   ├── core/                      # Configurações e utilitários transversais
│   │   ├── __init__.py
│   │   ├── config.py              # Variáveis de ambiente (Settings)
│   │   ├── database.py            # Engine, SessionLocal, Base
│   │   ├── security.py            # Hash de senhas, JWT, autenticação
│   │   └── dependencies.py        # Dependências injetáveis (get_db, get_current_user)
│   │
│   ├── models/                    # Entidades SQLAlchemy (Model do MVC)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── solicitacao.py
│   │   ├── chamado.py
│   │   └── categoria.py
│   │
│   ├── schemas/                   # Schemas Pydantic (request/response)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── solicitacao.py
│   │   ├── chamado.py
│   │   └── auth.py
│   │
│   ├── repositories/              # Acesso a dados (queries)
│   │   ├── __init__.py
│   │   ├── user_repository.py
│   │   ├── solicitacao_repository.py
│   │   └── chamado_repository.py
│   │
│   ├── services/                  # Lógica de negócio (Controller do MVC)
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   ├── solicitacao_service.py
│   │   ├── chamado_service.py
│   │   └── auth_service.py
│   │
│   ├── routers/                   # Endpoints REST (View do MVC)
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── solicitacoes.py
│   │   └── chamados.py
│   │
│   └── utils/                     # Funções auxiliares genéricas
│       ├── __init__.py
│       └── helpers.py
│
├── migrations/                    # Alembic (migrações do banco)
│   ├── env.py
│   └── versions/
│
├── tests/                         # Testes do backend
│   ├── __init__.py
│   ├── conftest.py                # Fixtures compartilhadas (TestClient, DB)
│   ├── test_services/
│   ├── test_routers/
│   └── test_repositories/
│
├── alembic.ini
├── requirements.txt               # Dependências Python
├── Dockerfile
└── .env.example
```

### 4.3 Frontend (`frontend/`) — Feature-Based por Perfil

```
frontend/
├── public/                        # Arquivos estáticos (favicon, imagens)
│
├── src/
│   ├── app/                       # App Router do Next.js (rotas/páginas)
│   │   ├── layout.tsx             # Layout raiz
│   │   ├── page.tsx               # Página inicial (landing/login)
│   │   ├── (auth)/                # Grupo de rotas de autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── registro/
│   │   │       └── page.tsx
│   │   ├── solicitante/           # Rotas do perfil Solicitante
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── nova-solicitacao/
│   │   │   │   └── page.tsx
│   │   │   └── minhas-solicitacoes/
│   │   │       └── page.tsx
│   │   ├── tecnico/               # Rotas do perfil Técnico
│   │   │   ├── layout.tsx
│   │   │   ├── fila/
│   │   │   │   └── page.tsx
│   │   │   └── chamado/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── gerente/               # Rotas do perfil Gerente
│   │   │   ├── layout.tsx
│   │   │   ├── painel/
│   │   │   │   └── page.tsx
│   │   │   ├── relatorios/
│   │   │   │   └── page.tsx
│   │   │   └── atribuicao/
│   │   │       └── page.tsx
│   │   └── admin/                 # Rotas do perfil Administrador
│   │       ├── layout.tsx
│   │       ├── usuarios/
│   │       │   └── page.tsx
│   │       └── configuracoes/
│   │           └── page.tsx
│   │
│   ├── features/                  # Features organizadas por perfil
│   │   ├── shared/                # Features e componentes compartilhados
│   │   │   ├── components/        # Componentes reutilizáveis (Button, Modal, Table, etc.)
│   │   │   │   ├── ui/            # Componentes de UI genéricos
│   │   │   │   └── layout/        # Header, Sidebar, Footer
│   │   │   ├── hooks/             # Hooks globais (useAuth, useToast, etc.)
│   │   │   ├── services/          # Serviços de API compartilhados (apiClient, authService)
│   │   │   ├── types/             # Tipos TypeScript globais
│   │   │   ├── utils/             # Funções utilitárias (formatDate, masks, etc.)
│   │   │   ├── contexts/          # React Contexts (AuthContext, ThemeContext)
│   │   │   └── constants/         # Constantes da aplicação
│   │   │
│   │   ├── solicitante/           # Features do perfil Solicitante
│   │   │   ├── components/        # Componentes exclusivos (FormSolicitacao, CardStatus)
│   │   │   ├── hooks/             # Hooks específicos (useSolicitacoes, useNovaSolicitacao)
│   │   │   ├── services/          # Chamadas de API do solicitante
│   │   │   └── types/             # Tipos específicos do solicitante
│   │   │
│   │   ├── tecnico/               # Features do perfil Técnico
│   │   │   ├── components/        # Componentes exclusivos (FilaChamados, CardChamado)
│   │   │   ├── hooks/             # Hooks específicos (useFilaChamados, useAtualizarStatus)
│   │   │   ├── services/          # Chamadas de API do técnico
│   │   │   └── types/             # Tipos específicos do técnico
│   │   │
│   │   ├── gerente/               # Features do perfil Gerente
│   │   │   ├── components/        # Componentes exclusivos (Dashboard, GraficoMetricas)
│   │   │   ├── hooks/             # Hooks específicos (useIndicadores, useRelatorios)
│   │   │   ├── services/          # Chamadas de API do gerente
│   │   │   └── types/             # Tipos específicos do gerente
│   │   │
│   │   └── admin/                 # Features do perfil Administrador
│   │       ├── components/        # Componentes exclusivos (TabelaUsuarios, FormUsuario)
│   │       ├── hooks/             # Hooks específicos (useGerenciarUsuarios)
│   │       ├── services/          # Chamadas de API do admin
│   │       └── types/             # Tipos específicos do admin
│   │
│   └── styles/                    # Estilos globais
│       └── globals.css
│
├── tests/                         # Testes do frontend
│   ├── components/
│   └── features/
│
├── next.config.js
├── tsconfig.json
├── package.json
├── Dockerfile
└── .env.example
```

---

## 5. Convenções de Código

### 5.1 Geral

- **Idioma do código:** Inglês para nomes de variáveis, funções, classes e arquivos. Português apenas em conteúdo de UI visível ao usuário.
- **Commits:** Conventional Commits — `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- **Branches:** `feature/<nome>`, `fix/<nome>`, `hotfix/<nome>`, partindo sempre de `developer`.
- **Pull Requests:** Obrigatórios para merge em `developer`. Mínimo de 1 review.

### 5.2 Backend (Python)

| Item             | Convenção                                         |
| ---------------- | ------------------------------------------------- |
| Formatação       | `black` (line-length=88) [Apenas Local / Opcional] |
| Linting          | `ruff` [Apenas Local / Opcional]                  |
| Tipagem          | Type hints obrigatórios em funções públicas        |
| Nomenclatura     | `snake_case` para funções/variáveis, `PascalCase` para classes |
| Docstrings       | Google Style (obrigatórias em services e routers)  |
| Testes           | `pytest` + `pytest-asyncio`                       |
| Variáveis de ambiente | via `pydantic-settings` (nunca hardcoded)     |

**Fluxo de uma requisição no backend:**
```
Router (View) → Service (Controller) → Repository → Model (DB)
                    ↕
               Schema (Pydantic)
```

### 5.3 Frontend (TypeScript/React)

| Item             | Convenção                                         |
| ---------------- | ------------------------------------------------- |
| Linguagem        | TypeScript strict mode                            |
| Formatação       | `prettier`                                        |
| Linting          | `eslint` (config Next.js)                         |
| Componentes      | Functional components com arrow functions          |
| Nomenclatura     | `PascalCase` para componentes, `camelCase` para funções/variáveis, `kebab-case` para arquivos de páginas |
| Hooks customizados | Prefixo `use` — ex: `useSolicitacoes`           |
| Testes           | `jest` + `React Testing Library`                  |
| Requisições API  | Centralizadas em `services/` de cada feature      |

**Regra de imports no frontend:**
```
✅ features/solicitante/ pode importar de → features/shared/
✅ features/tecnico/     pode importar de → features/shared/
❌ features/solicitante/ NÃO pode importar de → features/tecnico/
❌ features/gerente/     NÃO pode importar de → features/admin/
```

> Cada feature de perfil é isolada. Dependências cruzadas entre perfis são proibidas. O que for comum deve estar em `shared/`.

---

## 6. Docker

### 6.1 Serviços

O `docker-compose.yml` deve definir no mínimo:

| Serviço      | Imagem / Build     | Porta  |
| ------------ | ------------------ | ------ |
| `backend`    | `./backend`        | 8000   |
| `frontend`   | `./frontend`       | 3000   |
| `db`         | `postgres:16`      | 5432   |

### 6.2 Regras

- Cada serviço tem seu próprio `Dockerfile`.
- Variáveis de ambiente via `.env` (nunca commitado; apenas `.env.example`).
- Volumes para persistência do banco e hot-reload em desenvolvimento.

---

## 7. API REST — Convenções

| Item                | Padrão                                           |
| ------------------- | ------------------------------------------------ |
| Base path           | `/api/v1/`                                       |
| Nomenclatura rotas  | Substantivos no plural, `kebab-case` — ex: `/api/v1/solicitacoes` |
| Métodos HTTP        | `GET` (leitura), `POST` (criação), `PUT` (atualização completa), `PATCH` (parcial), `DELETE` |
| Autenticação        | JWT Bearer Token via header `Authorization`      |
| Respostas de erro   | JSON padronizado: `{ "detail": "mensagem" }`     |
| Status codes        | `200`, `201`, `204`, `400`, `401`, `403`, `404`, `422`, `500` |
| Paginação           | Query params `?page=1&size=20`                   |

---

## 8. Banco de Dados

- **Nomenclatura de tabelas:** `snake_case`, plural — ex: `solicitacoes`, `users`.
- **Nomenclatura de colunas:** `snake_case` — ex: `created_at`, `user_id`.
- **Migrações:** Sempre via Alembic. Nunca alterar o banco manualmente.
- **Chaves estrangeiras:** Nomeadas como `fk_<tabela_origem>_<tabela_destino>`.
- **Índices:** Criar para colunas frequentemente filtradas/buscadas.
- **Soft delete:** Utilizar coluna `deleted_at` (nullable timestamp) em vez de deletar registros.

### 8.1 Guia de Migrations (Alembic)

Para manter a integridade do banco de dados e a consistência técnica no time, as seguintes diretrizes de migração devem ser respeitadas:

#### Regras
- **Naming convention:** `{YYYY_MM_DD}_{descricao_snake_case}` (ex: `2026_05_22_criar_tabela_solicitacoes`).
- **Nunca editar migrations já mergeadas na main.** Se for necessário corrigir uma migração que já foi para a main, crie uma nova migration de correção.
- **Sempre testar rollback:** Execute e valide o rollback (`alembic downgrade -1`) localmente antes de realizar o merge da Pull Request.
- **Migrations manuais:** Não usar `--autogenerate` de forma indiscriminada para evitar códigos excessivamente verbosos ou desnecessários. Prefira escrever as alterações manualmente de maneira limpa.
- **Executar dentro do docker:** Rode os comandos do Alembic sempre dentro do container do Docker para garantir a consistência do ambiente de banco de dados.

### Comandos Padrão
```bash
# Criar nova migration (manual - sem autogenerate)
docker compose exec backend alembic revision -m "2026_05_22_criar_tabela_solicitacoes"

# Aplicar migrations
docker compose exec backend alembic upgrade head

# Reverter última migration
docker compose exec backend alembic downgrade -1

# Listar migrations
docker compose exec backend alembic history
```

---

## 9. Segurança

- Senhas hasheadas com `bcrypt`.
- Tokens JWT com expiração configurável.
- Middleware de CORS configurado para origens permitidas.
- Validação de entrada em todas as rotas via Pydantic schemas.
- Controle de acesso por perfil via dependências do FastAPI (`Depends`).
- Variáveis sensíveis apenas em `.env` — nunca no código-fonte.

---

## 10. Testes e Qualidade

- **Cobertura mínima:** 80% para código novo (backend e frontend).
- **PR bloqueado** se cobertura ficar abaixo de 80%.
- **Níveis:** Unitários, Integração e Sistema (E2E).
- **CI/CD:** GitHub Actions executa testes no backend e lint no frontend em todo PR para `developer`.

---

## 11. Git Flow

```
main (produção)
 └── developer (desenvolvimento)
      ├── feature/criar-solicitacao
      ├── feature/fila-chamados
      ├── fix/corrigir-login
      └── hotfix/seguranca-jwt
```

- `main`: Código em produção. Merge apenas de `developer` após validação.
- `developer`: Branch de integração. Todo desenvolvimento parte daqui.
- `feature/*`: Branches de funcionalidades.
- `fix/*`: Correções de bugs.
- `hotfix/*`: Correções críticas (merge direto em `main` e `developer`).

---

## 12. Referência Rápida — Onde Colocar Cada Coisa

| O que você quer fazer?                      | Onde colocar?                                    |
| ------------------------------------------- | ------------------------------------------------ |
| Nova tabela no banco                        | `backend/app/models/`                            |
| Nova rota de API                            | `backend/app/routers/`                           |
| Lógica de negócio                           | `backend/app/services/`                          |
| Query ao banco                              | `backend/app/repositories/`                      |
| Schema de request/response                  | `backend/app/schemas/`                           |
| Componente de UI reutilizável               | `frontend/src/features/shared/components/`       |
| Hook compartilhado                          | `frontend/src/features/shared/hooks/`            |
| Componente exclusivo do solicitante         | `frontend/src/features/solicitante/components/`  |
| Nova página do gerente                      | `frontend/src/app/gerente/<rota>/page.tsx`        |
| Chamada de API do técnico                   | `frontend/src/features/tecnico/services/`        |
| Tipo TypeScript global                      | `frontend/src/features/shared/types/`            |
| Migração de banco                           | `backend/migrations/versions/`                   |
| Configuração de ambiente                    | `.env.example` (template) / `.env` (local)       |

---

> **Este documento é vivo.** Atualize-o conforme o projeto evolui. Toda alteração arquitetural deve ser refletida aqui antes de ser implementada.
