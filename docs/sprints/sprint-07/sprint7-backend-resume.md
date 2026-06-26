# Implementação de Rotas Administrativas e Validação de PIN (Sprint 7 Backend: Tasks 4 e 5)

Todas as rotas de administração e a validação do PIN administrativo foram implementadas, validadas e testadas com absoluto sucesso no backend do KeepUnB.

---

## 1. Alterações Realizadas

### Banco de Dados
- **Migração do Alembic:** Criamos a revisão `d577b3cc1fea` que altera a constraint de chave estrangeira `fk_tickets_tecnico_users` da tabela `tickets` no banco de dados para incluir a propriedade `ON DELETE SET NULL`.
- **Modelos SQLAlchemy:** Ajustamos o modelo [ticket.py] para sincronizar o relacionamento `tecnico_id` com `ondelete="SET NULL"`.

### Core de Segurança e Dependências
- **Claims no JWT:** Modificamos a função `create_access_token` em [security.py] para aceitar e embutir claims adicionais no payload do token.
- **Dependência de PIN:** Criamos a dependência `require_admin_pin` em [dependencies.py] que extrai o token JWT e exige a claim `"pin_verified": true` para usuários administradores.

### Camada de Serviços (Lógica Administrativa)
- **Serviço Administrativo:** Criamos o serviço [admin_service.py] contendo toda a lógica de:
  - Listagem geral de usuários.
  - Criação de contas do tipo `GERENTE` (com geração automática de matrícula iniciada com "3" caso não informada).
  - Edição cadastral e desativação de contas.
  - **Exclusão física com Usuário Sentinela (`000000000`):** Ao excluir qualquer usuário, o sistema garante a existência do usuário sentinela `"Usuário Excluído"` e migra programaticamente todas as chaves estrangeiras vinculadas (`solicitante_id` nos tickets, `user_id` em históricos de chamados e `user_id` nos comentários) para ele antes de deletar fisicamente o registro do banco. Caso o usuário excluído seja um técnico, a constraint do banco cuida de desatribuir automaticamente seus chamados (`tecnico_id = NULL`).
  - Validação e alteração de PIN do administrador.

### Camada de Schemas e Roteamento
- **Schemas Pydantic:** Criamos [admin.py] para as requisições de criação, edição, verificação e troca de PIN.
- **Controlador de Rotas:** Criamos [admin.py] contendo todas as rotas com o prefixo `/api/v1/admin/`.
- **Registro do Router:** Adicionamos o roteador em [main.py].

---

## 2. Validação Realizada

### Testes Automatizados (Pytest)
- Criamos a suíte de testes [test_admin_router.py] com 14 testes para cobrir unitariamente e em integração todos os cenários da interface administrativa.
- Ajustamos [conftest.py] para também limpar a tabela `comments` após cada teste.
- Rodamos toda a suíte de testes e todos passaram:
  ```bash
  docker compose exec backend pytest
  # Resultado: 104 passed em 26.17s
  ```

### Banco de Desenvolvimento (Seed)
- Atualizamos o script de semente de dados `seed_test_5.py` para incluir o usuário sentinela (`000000000`, `Usuário Excluído`), garantindo que o ambiente de desenvolvimento local possua essa conta especial configurada desde a inicialização.
- Aplicamos as migrações e executamos a população do banco de desenvolvimento:
  ```bash
  docker compose exec backend alembic upgrade head
  docker compose exec backend python scripts/seed_test_5.py
  # Resultado: Executado com sucesso!
  ```
