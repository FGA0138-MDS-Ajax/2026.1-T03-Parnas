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
  

# Implementação de Recuperação de Senha (Sprint 7 Melhorias: Task 9)

O recurso de recuperação de senha com código por e-mail foi implementado com sucesso. A seguir, detalhamos as alterações realizadas no banco de dados, backend e frontend.

## Alterações Realizadas

### 1. Banco de Dados e Modelos
- Criado o modelo `PasswordResetCode` (`backend/app/models/password_reset_code.py`) para armazenar os códigos de recuperação temporários.
- A tabela `password_reset_codes` foi configurada com colunas para `email`, `code` (6 dígitos), `expires_at` (15 minutos de validade) e `is_used` (flag).
- Criada e aplicada a migração Alembic para refletir a nova tabela no banco de dados PostgreSQL.

### 2. Backend (FastAPI)
- **Configurações SMTP**: Adicionadas as variáveis de ambiente SMTP no `backend/.env` e no modelo Pydantic `backend/app/core/config.py` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`).
- **Serviço de E-mail**: Implementado `EmailService` (`backend/app/services/email_service.py`) utilizando a biblioteca nativa `smtplib` para envio de e-mails em HTML.
- **Repositório**: Criado o `PasswordResetRepository` para isolar a persistência e busca de códigos no banco de dados.
- **Autenticação Segura**: 
  - Adicionado o fluxo em `backend/app/services/auth_service.py` (métodos `forgot_password`, `verify_code` e `reset_password`).
  - O e-mail de recuperação é disparado em background (`fastapi.BackgroundTasks`) para não bloquear a resposta ao usuário.
  - O `/verify-code` emite um JWT temporário contendo um _claim_ especial de `"type": "reset"`, que expira em 5 minutos.
  - O `/reset-password` só aceita a troca de senha caso esse JWT temporário seja válido.
- **Endpoints**: Registradas as 3 novas rotas em `backend/app/routers/auth.py`.

### 3. Frontend (Next.js)
- **Integração API**: Adicionados os métodos HTTP assíncronos no `authService.ts`.
- **Interface Gráfica**: 
  - Atualizado o link "Esqueci minha senha" na página de login (`/login`).
  - Criada a nova tela `/esqueci-senha`, com arquivo CSS próprio.
  - A tela interativa orienta o usuário em três etapas seguras: (1) Inserção do e-mail, (2) Inserção do código numérico de 6 dígitos e (3) Inserção e validação de uma nova senha forte.
  - O design mantém a estética visual coesa e responsiva (Navy blue e temas da FCTE/UnB).

## Verificação Realizada

> [!TIP]
> Todos os testes automatizados foram criados e passaram com sucesso no pipeline local (ver `test_auth_password_reset.py`).

### Testes Automatizados (Backend)
- `test_forgot_password`: Verifica o aceite da requisição e envio 202 (mesmo com e-mails inválidos, mantendo a privacidade de dados).
- `test_verify_code`: Valida que o código correto gera um _reset token_ JWT.
- `test_reset_password`: Verifica a atualização bem-sucedida do hash da senha e garante que login com a senha antiga passa a falhar e com a nova senha obtém sucesso.

