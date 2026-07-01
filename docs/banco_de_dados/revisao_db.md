# Revisão — Tarefa 1 Database (Sprint 4)
## Revisar estrutura das tabelas principais

**Status:** ✅ Aprovada com observações

---

## Arquivos Revisados

| Arquivo | Camada | Descrição |
|---|---|---|
| `backend/app/models/user.py` | Model | Define a tabela `users` |
| `backend/app/models/ticket.py` | Model | Define a tabela `tickets` |
| `backend/app/models/manager.py` | Model | Define a tabela `managers` |
| `backend/app/models/technician.py` | Model | Define a tabela `technicians` |
| `backend/app/models/comment.py` | Model | Define a tabela `comments` |
| `backend/app/models/__init__.py` | Model | Exporta os models |
| `backend/app/repositories/ticket_repository.py` | Repository | Queries de tickets |
| `backend/app/services/ticket_service.py` | Service | Lógica de negócio de tickets |
| `backend/migrations/versions/2026_05_28_criar_tabelas_iniciais.py` | Migration | Migration inicial |

---

## Critérios de Aceite

### ✅ 1. Tabela `tickets` possui solicitante e técnico atribuído

A tabela `tickets` possui duas Foreign Keys apontando para `users.matricula`:

```python
# backend/app/models/ticket.py
solicitante_id: Mapped[str] = mapped_column(
    String(9), ForeignKey("users.matricula"), nullable=False
)

tecnico_id: Mapped[str | None] = mapped_column(
    String(9), ForeignKey("users.matricula"), nullable=True
)
```

- `solicitante_id` — obrigatório (`nullable=False`), vincula quem abriu o chamado.
- `tecnico_id` — opcional (`nullable=True`), vincula o técnico atribuído pelo gerente.

A migration confirma as FKs com nomes padronizados:
```python
sa.ForeignKeyConstraint(['solicitante_id'], ['users.matricula'], name='fk_tickets_solicitante_users')
sa.ForeignKeyConstraint(['tecnico_id'], ['users.matricula'], name='fk_tickets_tecnico_users')
```

---

### ✅ 2. Tabela `tickets` possui status

O status é um Enum com 6 valores possíveis:

```python
# backend/app/models/ticket.py
class TicketStatus(str, enum.Enum):
    ABERTO = "ABERTO"
    ATRIBUIDO = "ATRIBUIDO"
    EM_ANDAMENTO = "EM_ANDAMENTO"
    CONCLUIDO = "CONCLUIDO"
    CANCELADO = "CANCELADO"
    NAO_INICIADO = "NAO_INICIADO"
```

O status padrão é `ABERTO`, conforme esperado pelo fluxo de negócio. A migration confirma o `server_default='ABERTO'`.

---

### ✅ 3. Tabela `users` possui role/perfil

O perfil é controlado por um Enum com os 4 perfis do sistema:

```python
# backend/app/models/user.py
class UserRole(str, enum.Enum):
    SOLICITANTE = "SOLICITANTE"
    GERENTE = "GERENTE"
    TECNICO = "TECNICO"
    ADMIN = "ADMIN"
```

O role padrão é `SOLICITANTE`. A PK é a matrícula (9 dígitos), com constraint de validação via regex.

---

### ✅ 4. Relacionamentos estão funcionando corretamente

Os relacionamentos funcionam através do padrão **Repository**:

| Operação | Repository Method | Query |
|---|---|---|
| Tickets do solicitante | `get_by_solicitante_id()` | `WHERE solicitante_id = ?` |
| Tickets do técnico | `get_by_tecnico_id()` | `WHERE tecnico_id = ?` |
| Ticket por ID | `get_by_id()` | `WHERE id = ?` |
| Tickets por status | `get_by_status()` | `WHERE status = ?` |
| Todos os tickets | `get_all()` | `SELECT * FROM tickets` |

O Service (`ticket_service.py`) valida as regras de negócio antes de acessar o Repository:
- Atribuição de técnico verifica: ticket existe, está ABERTO, técnico existe, tem role TECNICO, está ativo.
- Atualização de status verifica: ticket existe, está atribuído ao técnico que fez a requisição.

---

## Verificação Prática (Execução no Ambiente Docker)

Todos os testes abaixo foram executados no ambiente Docker local em 05/06/2026.

### ✅ Docker Compose — Containers rodando

| Serviço | Container | Status | Porta |
|---|---|---|---|
| PostgreSQL 16 | `keepunb-db` | ✅ Running | 5432 |
| FastAPI (backend) | `keepunb-backend` | ✅ Running | 8000 |
| Next.js (frontend) | `keepunb-frontend` | ✅ Running | 3000 |

### ✅ Migration (`alembic upgrade head`)

- Executou sem erros.
- Criou as tabelas `users` e `tickets` no banco `keepunb_dev`.
- Criou os ENUMs `userrole` e `ticketstatus` no PostgreSQL.
- FKs nomeadas conforme padrão do projeto (`fk_tickets_solicitante_users`, `fk_tickets_tecnico_users`).
- Índices e constraints criados corretamente (incluindo `ck_users_matricula_9_digitos`).

### ✅ Rollback (`alembic downgrade -1`)

- Executou sem erros — removeu tabelas e ENUMs.
- Após rollback, `alembic upgrade head` recriou tudo normalmente.
- Banco pode ser recriado do zero a partir das migrations.

### ✅ Seed (`seed_test_users.py`)

4 usuários de teste criados com sucesso:

| Matrícula | Nome | Email | Role | Ativo |
|---|---|---|---|---|
| 900000001 | Solicitante Teste | solicitante.teste@unb.br | SOLICITANTE | ✅ |
| 900000002 | Gerente Teste | gerente.teste@unb.br | GERENTE | ✅ |
| 900000003 | Tecnico Teste | tecnico.teste@unb.br | TECNICO | ✅ |
| 900000004 | Admin Teste | admin.teste@unb.br | ADMIN | ✅ |

**Senha para todos:** `123`


### ✅ Segurança — Senhas armazenadas com hash bcrypt

As senhas **não são armazenadas em texto puro**. A coluna `senha_hash` contém o hash bcrypt da senha original:

```
Senha original: "123"
Armazenado no banco: "$2b$12$4aWNv.KKpYcemd7N74Z4zekWMs6ZaXBkq6ynEPZJqyH5HEUDK75yO"
```

O fluxo de autenticação:
1. Usuário digita a senha no login.
2. O sistema aplica bcrypt na senha digitada.
3. Compara o hash gerado com o `senha_hash` salvo no banco.
4. Se bater → login aceito. Se não → erro de autenticação.

Ninguém (nem o administrador) consegue recuperar a senha original a partir do hash. Isso está em conformidade com o PROJECT_GUIDELINES: *"Senhas hasheadas com bcrypt"*.

### Tabelas existentes no banco

| Tabela | Existe no banco? | Tem migration? | Observação |
|---|---|---|---|
| `users` | ✅ | ✅ | Todos os campos, índices e constraints |
| `tickets` | ✅ | ✅ | FKs para `users`, status default `ABERTO` |

