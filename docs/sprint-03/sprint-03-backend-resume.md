# Resumo da Implementação do Backend — Sprint 3 (Tarefas 1 a 10)

Este documento descreve o estado atual da implementação do backend para a Sprint 3 do **KeepUnB**, englobando todas as tarefas de **1 a 10**. O desenvolvimento seguiu rigorosamente os padrões técnicos descritos em `PROJECT_GUIDELINES.md` e a arquitetura MVC adaptada para FastAPI.

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
    *   `status` (Enum `TicketStatus`): `ABERTO`, `ATRIBUIDO`, `EM_ANDAMENTO`, `CONCLUIDO`, `CANCELADO`, `NAO_INICIADO`
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

### 🔧 Tarefa 7 — Criar Rota para Listar Técnicos Disponíveis
*   **Descrição**: Permite que o gerente liste os técnicos ativos cadastrados para realizar atribuições.
*   **Rota**: `GET /api/v1/technicians/available`
*   **Critérios de aceite cobertos**:
    *   Acesso restrito exclusivamente ao perfil `GERENTE`.
    *   Retorna apenas usuários cuja `role == UserRole.TECNICO` e que estejam com a conta ativa (`ativo == True`).
*   **Arquivo do Router**: [technicians.py](file:///home/carloshf/keep-unb/backend/app/routers/technicians.py)

---

### 🤝 Tarefa 8 — Criar Rota para Atribuir Técnico a Chamado
*   **Descrição**: Permite que o gerente atribua um técnico disponível a um chamado que esteja no status aberto.
*   **Rota**: `PATCH /api/v1/tickets/{id}/assign`
*   **Payload de entrada**: `tecnico_id` (matrícula do técnico)
*   **Critérios de aceite cobertos**:
    *   Restrito exclusivamente ao perfil `GERENTE`.
    *   O chamado recebe o `tecnico_id` correspondente.
    *   O status do chamado é automaticamente alterado de `ABERTO` para `ATRIBUIDO`.
    *   Lança erro `400 Bad Request` caso o técnico especificado não exista, não esteja ativo ou não tenha a role de `TECNICO`.

---

### 🛠️ Tarefa 9 — Criar Rota para Técnico Visualizar seus Chamados
*   **Descrição**: Permite que o técnico consulte a lista de chamados que foram atribuídos a ele.
*   **Rota**: `GET /api/v1/tickets/assigned-to-me`
*   **Critérios de aceite cobertos**:
    *   Restrito exclusivamente a usuários com perfil `TECNICO`.
    *   Filtra e retorna apenas chamados atribuídos à matrícula do técnico logado.
    *   Garante que o técnico não visualize os chamados associados a outros técnicos.

---

### 🔄 Tarefa 10 — Criar Rota para Técnico Atualizar Status
*   **Descrição**: Permite que o técnico alterne o andamento e conclusão do chamado sob sua responsabilidade.
*   **Rota**: `PATCH /api/v1/tickets/{id}/status`
*   **Payload de entrada**: `status` (Enum `TicketStatus`, tipicamente `EM_ANDAMENTO` ou `CONCLUIDO`)
*   **Critérios de aceite cobertos**:
    *   Restrito exclusivamente ao perfil `TECNICO`.
    *   Garante que o técnico só consiga atualizar chamados atribuídos a ele mesmo, retornando `403 Forbidden` caso tente alterar um chamado de terceiros.
    *   Suporta transições de status válidas do fluxo da manutenção.

---

## 🗂️ 3. Estrutura de Arquivos Criados/Modificados
Abaixo está o mapa completo de onde cada parte das tarefas reside no backend:

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py                 # Configurações globais (Pydantic Settings)
│   │   ├── database.py               # Gerenciamento do Engine e dependência get_db
│   │   ├── security.py               # Hashing de senhas e Tokens JWT
│   │   └── dependencies.py           # Injeção de dependências (Autenticação/Roles)
│   │
│   ├── models/
│   │   ├── __init__.py               # Exportação unificada de User e Ticket
│   │   ├── user.py                   # Mapeamento físico de User + Enum UserRole
│   │   └── ticket.py                 # Mapeamento físico de Ticket + Enum TicketStatus
│   │
│   ├── schemas/
│   │   ├── auth.py                   # Schemas de login e token JWT
│   │   ├── user.py                   # Schemas de resposta de usuário e técnicos
│   │   └── ticket.py                 # Schemas de criação, atribuição e atualização de status
│   │
│   ├── repositories/
│   │   ├── user_repository.py        # Queries de busca do usuário e busca de técnicos ativos
│   │   └── ticket_repository.py      # Queries para inserção, get_by_user, get_open e updates
│   │
│   ├── services/
│   │   ├── auth_service.py           # Lógica de validação de login
│   │   ├── user_service.py           # Lógica de listagem de técnicos disponíveis
│   │   └── ticket_service.py         # Orquestração de regras de chamados (criação, atribuição e status)
│   │
│   ├── routers/
│   │   ├── auth.py                   # Rota de login
│   │   ├── users.py                  # Rota de perfil (/me)
│   │   ├── technicians.py            # Rota para técnicos disponíveis (/available)
│   │   └── tickets.py                # Rotas de chamados (criação, listagem, atribuição e status)
│   │
│   └── main.py                       # Ponto de entrada do FastAPI registrando todos os routers
│
└── requirements.txt                  # Dependências do projeto backend
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
3.  **Technicians**:
    *   `GET /api/v1/technicians/available` -> Retorna técnicos ativos cadastrados (apenas Gerente logado).
4.  **Tickets**:
    *   `POST /api/v1/tickets` -> Criação de chamado (apenas Solicitante logado).
    *   `GET /api/v1/tickets/me` -> Histórico do solicitante (apenas Solicitante logado).
    *   `GET /api/v1/tickets/open` -> Fila de chamados abertos (apenas Gerente logado).
    *   `PATCH /api/v1/tickets/{id}/assign` -> Atribuição de técnico a chamado (apenas Gerente logado).
    *   `GET /api/v1/tickets/assigned-to-me` -> Chamados atribuídos ao técnico (apenas Técnico logado).
    *   `PATCH /api/v1/tickets/{id}/status` -> Atualização do progresso do chamado (apenas Técnico logado).
