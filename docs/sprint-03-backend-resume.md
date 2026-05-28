# Resumo da Implementação do Backend — Sprint 3 (Tarefas 1 a 6)

Este documento descreve o estado atual da implementação do backend para a Sprint 3 do **KeepUnB**, englobando as tarefas de **1 a 6**. O desenvolvimento seguiu rigorosamente os padrões técnicos descritos em `PROJECT_GUIDELINES.md` e a arquitetura MVC adaptada para FastAPI.

---

## 🏗️ 1. Arquitetura Geral & Tecnologias
*   **Engine & Session**: SQLAlchemy 2.0 com suporte nativo assíncrono (`AsyncEngine` e `AsyncSession`).
*   **Padrão MVC**:
    *   **Model**: Entidades do banco de dados representadas com a sintaxe moderna do SQLAlchemy (`Mapped` e `mapped_column`).
    *   **View (Routers)**: Endpoints FastAPI organizados em `/api/v1/` com validações rigorosas de entrada e saída por schemas Pydantic.
    *   **Controller (Services)**: Camada de negócios isolando as ações dos routers.
    *   **Repository**: Abstração da camada de persistência com queries em SQL puro via SQLAlchemy Core/ORM assíncrono.

---

## 📋 2. Detalhamento das Tarefas Implementadas

### 👤 Tarefa 1 — Criar Model de Usuário (`User`)
*   **Descrição**: Representa os usuários do sistema.
*   **Campos Implementados**:
    *   `matricula` (String(9) - Chave Primária): Validação por restrição de integridade via check constraint de 9 dígitos.
    *   `nome` (String(100))
    *   `email` (String(150) - Único, Indexado)
    *   `senha_hash` (String(255))
    *   `role` (Enum `UserRole`): `SOLICITANTE`, `GERENTE`, `TECNICO`, `ADMIN`
    *   `ativo` (Boolean - Default True)
    *   `created_at` e `updated_at` (DateTime com Timezone)
*   **Arquivo do Model**: [user.py](file:///home/carloshf/keep-unb/backend/app/models/user.py)

---

### 🎫 Tarefa 2 — Criar Model de Chamado (`Ticket`)
*   **Descrição**: Representa as solicitações de manutenção.
*   **Campos Implementados**:
    *   `id` (Integer - Chave Primária, Autoincremento)
    *   `local` (String(200))
    *   `tipo_manutencao` (String(100))
    *   `descricao` (Text)
    *   `status` (Enum `TicketStatus`): `ABERTO`, `ATRIBUIDO`, `EM_ANDAMENTO`, `CONCLUIDO`, `CANCELADO`
    *   `solicitante_id` (String(9) - Chave Estrangeira apontando para `users.matricula`)
    *   `tecnico_id` (String(9) - Chave Estrangeira opcional apontando para `users.matricula`, inicia como `None`)
    *   `created_at` e `updated_at` (DateTime com Timezone)
*   **Critérios de aceite cobertos**:
    *   O chamado nasce com status padrão `ABERTO`.
    *   O chamado é associado a um solicitante obrigatório e nasce sem técnico atribuído.
*   **Arquivo do Model**: [ticket.py](file:///home/carloshf/keep-unb/backend/app/models/ticket.py)

---

### 🔑 Tarefa 3 — Criar Autenticação Inicial com JWT
*   **Lógica de Segurança**:
    *   Senhas criptografadas usando o algoritmo `bcrypt` via biblioteca `passlib`.
    *   Geração de Tokens JWT utilizando a biblioteca `python-jose` contendo a matrícula do usuário no payload (`sub`).
*   **Dependências de Rota**:
    *   `get_current_user`: Faz a leitura do header `Authorization: Bearer <token>`, valida a integridade do token, verifica se o usuário está ativo no banco e o retorna.
    *   `require_role([allowed_roles])`: Restringe a execução do endpoint baseado na regra de perfil informada.
*   **Rotas Disponibilizadas**:
    *   `POST /api/v1/auth/login`: Autentica o usuário com email e senha e retorna um token Bearer JWT.
    *   `GET /api/v1/users/me`: Retorna os dados do usuário autenticado no momento (incluindo seu perfil `role`).

---

### 🚀 Tarefa 4 — Criar Rota para Abertura de Chamado
*   **Descrição**: Permite que o solicitante abra uma nova requisição.
*   **Rota**: `POST /api/v1/tickets`
*   **Payload de entrada**: `local`, `tipo_manutencao`, `descricao`
*   **Critérios de aceite cobertos**:
    *   Restrito exclusivamente para usuários com role `SOLICITANTE`.
    *   O chamado é salvo no banco associado à matrícula do solicitante logado e com status inicial `ABERTO`.
    *   Retorna a representação do ticket completo (`TicketResponse`).

---

### 🔍 Tarefa 5 — Criar Rota para Listar Chamados do Solicitante
*   **Descrição**: Permite que o solicitante logado consulte seu próprio histórico de chamados.
*   **Rota**: `GET /api/v1/tickets/me`
*   **Critérios de aceite cobertos**:
    *   Apenas acessível para perfis do tipo `SOLICITANTE`.
    *   Filtra e retorna apenas os chamados criados pela matrícula do solicitante autenticado.
    *   Retorna local, tipo de manutenção, descrição, status e demais campos relevantes.

---

### 🏢 Tarefa 6 — Criar Rota para Gerente Visualizar Chamados Abertos
*   **Descrição**: Permite que o gerente consulte a fila de chamados que precisam de atenção.
*   **Rota**: `GET /api/v1/tickets/open`
*   **Critérios de aceite cobertos**:
    *   Restrito estritamente a usuários com o perfil `GERENTE`.
    *   Retorna apenas chamados cujo status seja igual a `ABERTO`.
    *   Bloqueia acessos indesejados de técnicos e solicitantes.

---

## 🗂️ 3. Estrutura de Arquivos Criados/Modificados
Abaixo está o mapa de onde cada parte das tarefas reside no backend:

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py                 # (Modificado) Configurações globais (Pydantic Settings)
│   │   ├── database.py               # (Modificado) Gerenciamento do Engine e dependência get_db
│   │   ├── security.py               # (Criado) Hashing de senhas e Tokens JWT
│   │   └── dependencies.py           # (Criado) Injeção de dependências (Autenticação/Roles)
│   │
│   ├── models/
│   │   ├── __init__.py               # (Modificado) Exportação unificada de User e Ticket
│   │   ├── user.py                   # (Modificado) Mapeamento físico de User + Enum UserRole
│   │   └── ticket.py                 # (Criado) Mapeamento físico de Ticket + Enum TicketStatus
│   │
│   ├── schemas/
│   │   ├── auth.py                   # (Criado) Schemas de login e token JWT
│   │   ├── user.py                   # (Criado) Schema de resposta de usuário
│   │   └── ticket.py                 # (Criado) Schemas de criação e resposta do Ticket
│   │
│   ├── repositories/
│   │   ├── user_repository.py        # (Modificado) Queries de busca do usuário (email/matrícula)
│   │   └── ticket_repository.py      # (Criado) Queries para inserção, get_by_user e get_open
│   │
│   ├── services/
│   │   ├── auth_service.py           # (Modificado) Lógica de validação de login
│   │   └── ticket_service.py         # (Criado) Orquestração de regras de chamados
│   │
│   ├── routers/
│   │   ├── auth.py                   # (Modificado) Rota de login
│   │   ├── users.py                  # (Modificado) Rota de perfil (/me)
│   │   └── tickets.py                # (Criado) Rotas de criação e listagem (/me e /open)
│   │
│   └── main.py                       # (Modificado) Ponto de entrada do FastAPI incluindo os routers
│
└── requirements.txt                  # (Modificado) Adicionado email-validator para Pydantic
```

---

## 🧪 4. Validação & Swagger
Com a inicialização automática do FastAPI, todas as rotas documentam-se na especificação OpenAPI e podem ser testadas localmente no endereço:

`http://localhost:8000/docs`

### Lista de Endpoints Disponíveis no Swagger:
1.  **Auth**:
    *   `POST /api/v1/auth/login` -> Recebe email e senha e emite o token JWT.
2.  **Users**:
    *   `GET /api/v1/users/me` -> Retorna o perfil completo do usuário logado (requer Bearer Token).
3.  **Tickets**:
    *   `POST /api/v1/tickets` -> Criação de chamado (apenas Solicitante logado).
    *   `GET /api/v1/tickets/me` -> Histórico do solicitante (apenas Solicitante logado).
    *   `GET /api/v1/tickets/open` -> Fila de chamados abertos (apenas Gerente logado).
