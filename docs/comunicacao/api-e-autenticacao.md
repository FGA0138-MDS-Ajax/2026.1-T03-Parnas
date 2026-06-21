# Comunicação, API e autenticação

Este documento registra como as partes do KeepUnB se comunicam no ambiente local, quais URLs são usadas durante o desenvolvimento, quais rotas principais compõem a API e como funciona o fluxo de autenticação com JWT.

## Protocolos de comunicação

O KeepUnB é organizado como uma aplicação web com três camadas principais:

| Camada | Tecnologia | Comunicação |
| --- | --- | --- |
| Frontend | Next.js / React | Envia requisições HTTP para a API |
| Backend | FastAPI / Python | Expõe endpoints REST e responde em JSON |
| Banco de dados | PostgreSQL | Acessado somente pelo backend via SQLAlchemy |

O frontend não acessa o banco de dados diretamente. Toda ação do usuário passa pela API do backend, que valida dados, aplica regras de negócio, consulta ou altera o PostgreSQL e devolve uma resposta para a interface.

As comunicações principais são:

| Origem | Destino | Protocolo/formato | Uso |
| --- | --- | --- | --- |
| Navegador | Frontend | HTTP local | Acesso à aplicação web |
| Frontend | Backend | HTTP + REST + JSON | Login, cadastro, chamados, técnicos e usuário atual |
| Frontend | Backend | HTTP + multipart/form-data | Criação de chamado com foto |
| Backend | Banco PostgreSQL | Conexão PostgreSQL via `asyncpg`/SQLAlchemy | Persistência dos dados |
| Backend | Arquivos estáticos | HTTP | Servir uploads em `/uploads` |

Em ambiente local, as URLs usam `http`. A documentação de arquitetura descreve o uso de HTTPS para o cenário de produção ou implantação segura.

## URLs locais

As URLs locais são definidas principalmente pelo `docker-compose.yml` e pelos arquivos `.env.example`.

| Serviço | URL local | Observação |
| --- | --- | --- |
| Frontend | `http://localhost:3000` | Interface Next.js usada pelos perfis do sistema |
| Backend | `http://localhost:8000` | Aplicação FastAPI |
| Base da API | `http://localhost:8000/api/v1` | Valor padrão de `NEXT_PUBLIC_API_URL` |
| Swagger UI | `http://localhost:8000/docs` | Documentação interativa da API |
| ReDoc | `http://localhost:8000/redoc` | Documentação alternativa da API |
| Health check | `http://localhost:8000/api/v1/health` | Verifica se o backend está respondendo |
| Uploads | `http://localhost:8000/uploads/...` | Arquivos servidos pelo backend |
| PostgreSQL dev | `localhost:5432` | Banco principal do ambiente local |
| PostgreSQL teste | `localhost:5433` | Banco isolado para testes |

No frontend, quando `NEXT_PUBLIC_API_URL` não está definido, o cliente usa:

```text
http://localhost:8000/api/v1
```

No backend, a conexão local via Docker usa o host interno `db`:

```text
postgresql+asyncpg://keepunb:changeme@db:5432/keepunb_dev
```

## Rotas principais da API

A API segue o prefixo `/api/v1` para os recursos principais.

### Autenticação

| Método | Rota | Acesso | Função |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Público | Recebe `email` e `senha`, valida credenciais e retorna um token JWT |
| `POST` | `/api/v1/auth/register` | Público | Cadastra solicitantes e técnicos, conforme regras de validação |

### Usuários

| Método | Rota | Acesso | Função |
| --- | --- | --- | --- |
| `GET` | `/api/v1/users/me` | Usuário autenticado | Retorna os dados do usuário identificado pelo token |

### Chamados

| Método | Rota | Acesso | Função |
| --- | --- | --- | --- |
| `POST` | `/api/v1/tickets` | Solicitante | Cria um chamado; aceita JSON e também `multipart/form-data` com foto |
| `GET` | `/api/v1/tickets/me` | Solicitante | Lista os chamados do solicitante logado |
| `GET` | `/api/v1/tickets/open/others` | Solicitante | Lista chamados abertos por outros solicitantes |
| `GET` | `/api/v1/tickets/open` | Gerente | Lista chamados abertos |
| `GET` | `/api/v1/tickets/in-progress` | Gerente | Lista chamados em andamento |
| `GET` | `/api/v1/tickets` | Gerente | Lista todos os chamados |
| `GET` | `/api/v1/tickets/public` | Usuário autenticado | Lista chamados em formato público |
| `GET` | `/api/v1/tickets/assigned-to-me` | Técnico | Lista chamados atribuídos ao técnico logado |
| `GET` | `/api/v1/tickets/{ticket_id}` | Solicitante, técnico ou gerente | Retorna detalhes do chamado e histórico |
| `PATCH` | `/api/v1/tickets/{ticket_id}/assign` | Gerente | Atribui um técnico ao chamado |
| `PATCH` | `/api/v1/tickets/{ticket_id}/status` | Técnico | Atualiza o status de um chamado atribuído |

### Técnicos

| Método | Rota | Acesso | Função |
| --- | --- | --- | --- |
| `GET` | `/api/v1/technicians/available` | Gerente | Lista técnicos disponíveis |
| `GET` | `/api/v1/technicians/pending` | Gerente ou administrador | Lista técnicos com cadastro pendente |
| `PATCH` | `/api/v1/technicians/{id}/approve` | Gerente ou administrador | Aprova o cadastro de um técnico |
| `PATCH` | `/api/v1/technicians/{id}/reject` | Gerente ou administrador | Reprova o cadastro de um técnico |

### Comentários

| Método | Rota | Acesso | Função |
| --- | --- | --- | --- |
| `POST` | `/api/v1/comments?ticket_id={id}` | Solicitante | Cria comentário em um chamado |
| `GET` | `/api/v1/comments/me` | Solicitante | Lista comentários do usuário logado |
| `GET` | `/api/v1/comments/user?target_user_id={matricula}` | Solicitante | Lista comentários de um usuário específico |
| `GET` | `/api/v1/comments/ticket?ticket_id={id}` | Solicitante | Lista comentários de um chamado |
| `PATCH` | `/api/v1/comments/{comment_id}/ocultar` | Administrador ou gerente | Oculta um comentário |
| `PATCH` | `/api/v1/comments/{comment_id}/revelar` | Administrador ou gerente | Revela um comentário oculto |

### Rotas consumidas pelo frontend que exigem atenção

O serviço de gerente no frontend também chama:

```text
GET /api/v1/manager/dashboard-stats
```

Na estrutura de backend analisada, não há um roteador `/api/v1/manager` correspondente. Essa rota deve ser confirmada antes de ser tratada como contrato estável da API.

## Fluxo de autenticação com JWT

O login do KeepUnB usa JWT com esquema Bearer.

1. O usuário informa `email` e `senha` na tela de login.
2. O frontend envia `POST /api/v1/auth/login` para a API.
3. O backend busca o usuário pelo e-mail.
4. A senha enviada é comparada com o hash salvo usando `passlib` e `bcrypt`.
5. Se as credenciais forem válidas e a conta estiver apta a entrar, o backend cria um JWT.
6. O JWT contém a matrícula do usuário no campo `sub` e uma data de expiração no campo `exp`.
7. O backend retorna:

```json
{
  "access_token": "token.jwt.assinado",
  "token_type": "bearer"
}
```

8. O frontend salva o token em `localStorage` com a chave `keepunb_token`.
9. Em seguida, o frontend chama `GET /api/v1/users/me` para buscar os dados do usuário autenticado.
10. O frontend salva informações auxiliares em `localStorage`, como perfil, e-mail, matrícula e nome.
11. As próximas requisições protegidas enviam o cabeçalho:

```http
Authorization: Bearer token.jwt.assinado
```

12. O backend decodifica o token com a `SECRET_KEY`, lê o `sub`, busca o usuário pela matrícula e valida se a conta está ativa.
13. Para rotas restritas por perfil, o backend aplica `require_role`, permitindo apenas os papéis autorizados para aquela operação.

## Papéis e autorização

O sistema trabalha com os seguintes papéis:

| Papel | Uso principal |
| --- | --- |
| `SOLICITANTE` | Cria chamados, acompanha seus chamados e consulta chamados públicos |
| `TECNICO` | Visualiza chamados atribuídos e atualiza status |
| `GERENTE` | Consulta filas, atribui técnicos e gerencia aprovações |
| `ADMIN` | Atua em operações administrativas, incluindo aprovação/reprovação de técnicos |

Quando uma rota exige autenticação e o token não é enviado, é inválido ou expirou, a API retorna `401 Unauthorized`. Quando o token é válido, mas o perfil não tem permissão para a operação, a API retorna `403 Forbidden`.

## Observações de operação local

Para o login funcionar em ambiente local, o banco precisa ter as tabelas e os usuários esperados. O fluxo usual é:

```bash
docker compose up --build
docker compose exec backend alembic upgrade head
docker compose exec backend python scripts/seed_test_users.py
```

Depois disso, os usuários de teste podem ser usados conforme a seed do projeto.
