# Guia de Testes — Backend Sprint 3 (KeepUnB)

Este documento descreve a arquitetura da suíte de testes unitários e de integração implementada para o backend do **KeepUnB** na Sprint 3. Aqui você encontrará os detalhes de configuração, a descrição das coberturas por camada de código e os comandos necessários para executá-los com facilidade.

---

## 🛠️ 1. Arquitetura Técnica & Isolamento de Testes

Os testes foram construídos utilizando o ecossistema do **pytest**, aproveitando chamadas assíncronas nativas com o driver **asyncpg** e conexões de rede simuladas com **httpx.AsyncClient**. 

Para garantir a estabilidade e velocidade, foram adotadas as seguintes práticas na infraestrutura de testes (`tests/conftest.py`):

1. **Desativação de Connection Pooling (`NullPool`)**:
   * O pytest-asyncio reconstrói o loop de eventos assíncronos (`asyncio event loop`) a cada teste unitário executado.
   * Para evitar erros de concorrência física no driver assíncrono (como o `InterfaceError: connection is closed`), desativamos o pooling interno do SQLAlchemy usando `poolclass=NullPool`. Cada teste cria e finaliza sua própria conexão limpa no loop ativo.
   
2. **Isolamento de Banco via Transações e Limpeza Ativa**:
   * As tabelas da base de dados são criadas no início da suíte de testes.
   * A fixture `db_session` controla cada teste de forma isolada: inicia uma transação limpa, executa o teste e limpa os registros inseridos nas tabelas `tickets` e `users` de forma determinística antes de entregar a conexão para o próximo teste.
   * Para testes de violações físicas de banco de dados (constraints físicas), são utilizadas transações aninhadas (Savepoints) via `async with db_session.begin_nested()`, o que evita a corrupção do estado da transação principal diante de exceções intencionais de banco.

3. **Monkeypatch de Criptografia Rápida (Bcrypt/Passlib Bypass)**:
   * A biblioteca `passlib` apresenta incompatibilidades e lentidão no Python 3.12+ ao tentar ler automaticamente módulos bcrypt compilados.
   * Mascaramos o módulo `bcrypt` em tempo de inicialização dos testes (`sys.modules['bcrypt'] = None`) e interceptamos as funções de hashing de senha (`get_password_hash` e `verify_password`) por lambdas rápidas em memória. 
   * **Resultado**: A velocidade de execução dos testes aumentou em mais de 100x e eliminou totalmente a lentidão causada por custos de CPU na computação de hashes criptográficos.

4. **Autenticação Simulada com JWT**:
   * Fixtures pré-configuradas criam e autenticam dinamicamente perfis de usuários com tokens JWT válidos. 
   * Estão disponíveis cabeçalhos HTTP prontos (`solicitante_headers`, `tecnico_headers`, `gerente_headers`) com autorizações corretas para testes de integração nas rotas.

---

## 📋 2. Cobertura das Camadas de Teste

A suíte possui **44 casos de teste** cobrindo todas as 10 tarefas de desenvolvimento da Sprint 3:

### A. Camada de Repositories e Models (`tests/test_repositories`)
Valida as operações assíncronas do SQLAlchemy 2.0 e restrições físicas nas tabelas do banco de dados.

*   `test_user_repository.py`:
    *   `test_user_matricula_constraint_invalid_length`: Garante que matrículas maiores ou menores que 9 dígitos sejam rejeitadas.
    *   `test_user_matricula_constraint_non_numeric`: Bloqueia o registro de matrículas contendo caracteres não numéricos.
    *   `test_user_email_uniqueness`: Assegura a unicidade estrita do e-mail em nível de banco de dados.
    *   `test_get_by_email` e `test_get_by_matricula`: Busca e recuperação de instâncias de usuários.
    *   `test_get_available_technicians`: Valida a query que retorna apenas os usuários ativos com a role `TECNICO`.

*   `test_ticket_repository.py`:
    *   `test_create_ticket_success`: Criação de chamados com o status padrão `ABERTO` e sem técnico atribuído.
    *   `test_get_by_solicitante_id`: Filtra e retorna apenas chamados criados por um determinado solicitante.
    *   `test_get_by_status`: Valida o filtro de chamados por status (ex: fila de abertos).
    *   `test_get_by_id`: Localiza chamados individualmente pelo ID físico do banco.
    *   `test_get_by_tecnico_id`: Recupera chamados atribuídos a um técnico específico.
    *   `test_update_ticket`: Confere a persistência de atualizações de chamados (trocas de status e associação de técnicos).

### B. Camada de Regras de Negócio / Serviços (`tests/test_services`)
Testes puros das classes de serviço, testando regras e exceções HTTP de negócio complexas de forma isolada.

*   `test_auth_service.py`:
    *   `test_authenticate_user_success`: Autenticação e geração de tokens JWT corretos.
    *   `test_authenticate_user_email_not_found` e `test_authenticate_user_incorrect_password`: Resposta HTTP 401 para credenciais inválidas.
    *   `test_authenticate_user_inactive`: Lançamento de HTTP 400 ao tentar logar com usuário desativado.

*   `test_ticket_service.py`:
    *   `test_create_ticket_service`: Abertura e salvamento de novos chamados.
    *   `test_get_user_tickets_service`, `test_get_open_tickets_service` e `test_get_tickets_by_technician_service`: Listagens e queries utilitárias de serviço.
    *   `test_assign_technician_success`: Atribuição de técnicos ativos a chamados abertos, atualizando o status para `ATRIBUIDO`.
    *   `test_assign_technician_ticket_not_found` (HTTP 404) e `test_assign_technician_ticket_not_open` (HTTP 400).
    *   `test_assign_technician_invalid_technician`: Impede atribuição de técnicos inativos, inexistentes ou de usuários com perfis incompatíveis (HTTP 400).
    *   `test_update_ticket_status_success`: Técnico responsável altera o status do seu chamado.
    *   `test_update_ticket_status_forbidden`: Bloqueia outros técnicos de alterarem status de chamados que não estejam sob sua atribuição direta (HTTP 403).

*   `test_user_service.py`:
    *   `test_get_available_technicians_service`: Delegação para listagem de técnicos disponíveis.

### C. Camada de Integração / Rotas API (`tests/test_routers`)
Simulação completa de chamadas HTTP reais da API usando o cliente HTTP de testes do FastAPI.

*   `test_auth_router.py`: Rota `POST /api/v1/auth/login`.
*   `test_users_router.py`: Rota protegida `GET /api/v1/users/me` (perfil atual do usuário).
*   `test_technicians_router.py`: Rota `/api/v1/technicians/available` (acesso exclusivo para o perfil `GERENTE`).
*   `test_tickets_router.py`:
    *   `POST /api/v1/tickets`: Permite apenas usuários `SOLICITANTE` criarem chamados (técnicos e gerentes recebem HTTP 403).
    *   `GET /api/v1/tickets/me`: Listagem exclusiva de chamados do solicitante logado.
    *   `GET /api/v1/tickets/open`: Listagem de chamados abertos protegida para o perfil de `GERENTE`.
    *   `GET /api/v1/tickets/assigned-to-me`: Listagem de chamados atribuídos exclusiva para técnicos.
    *   `PATCH /api/v1/tickets/{id}/assign`: Atribuição realizada por gerentes.
    *   `PATCH /api/v1/tickets/{id}/status`: Transição de status realizada pelo técnico responsável.

---

## 🚀 3. Como Executar os Testes

Os testes são executados de forma ideal dentro do container de desenvolvimento (`backend`), garantindo que todas as variáveis de ambiente e dependências PostgreSQL estejam prontas.

### Executar Toda a Suíte
Na raiz do projeto (onde está o seu `docker-compose.yml`), dispare a execução completa:
```bash
docker compose exec backend pytest
```

### Comandos Úteis do Pytest

*   **Executar apenas um arquivo de testes específico**:
    ```bash
    docker compose exec backend pytest tests/test_repositories/test_user_repository.py
    ```

*   **Executar uma pasta de testes específica**:
    ```bash
    docker compose exec backend pytest tests/test_services
    ```

*   **Executar com modo detalhado (verbose)**:
    ```bash
    docker compose exec backend pytest -v
    ```

*   **Mostrar as saídas do console e prints (`stdout`) em tempo real durante a execução**:
    ```bash
    docker compose exec backend pytest -s
    ```

*   **Parar a execução imediatamente no primeiro teste que falhar**:
    ```bash
    docker compose exec backend pytest -x
    ```

---

> [!TIP]
> Todos os testes executam rollbacks de banco automáticos, mantendo a base de dados de desenvolvimento intocada e sempre pronta para uso manual ou debugging.
