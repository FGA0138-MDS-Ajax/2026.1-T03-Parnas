# Documentação de Endpoints da API

## Descrição

Este documento apresenta os principais endpoints da API REST do sistema KeepUnB implementados durante a Sprint 3, descrevendo seus métodos HTTP, perfis autorizados e funcionalidades.

## Objetivo

Facilitar o entendimento da API pelos membros da equipe, apoiando o desenvolvimento, testes, manutenção e integração entre frontend e backend.

---

## Visão Geral

A API do KeepUnB foi desenvolvida utilizando FastAPI e segue o padrão RESTful. A autenticação é realizada por meio de JSON Web Token (JWT), garantindo que apenas usuários autorizados possam acessar os recursos protegidos.

### URL Base

```text
/api/v1
```

### Autenticação

Após realizar login, o usuário recebe um token JWT que deve ser enviado no cabeçalho das requisições protegidas.

Exemplo:

```http
Authorization: Bearer <token>
```

---

## Endpoints Disponíveis

| Método | Endpoint                         | Perfil Permitido      | Descrição                                            |
| ------ | -------------------------------- | --------------------- | ---------------------------------------------------- |
| POST   | `/api/v1/auth/login`             | Todos                 | Autentica o usuário e retorna um token JWT           |
| GET    | `/api/v1/users/me`               | Usuários autenticados | Retorna os dados do usuário autenticado              |
| POST   | `/api/v1/tickets`                | Solicitante           | Cria um novo chamado de manutenção                   |
| GET    | `/api/v1/tickets/me`             | Solicitante           | Lista os chamados criados pelo solicitante           |
| GET    | `/api/v1/tickets/open`           | Gerente               | Lista os chamados que estão com status aberto        |
| GET    | `/api/v1/technicians/available`  | Gerente               | Lista os técnicos ativos disponíveis para atribuição |
| PATCH  | `/api/v1/tickets/{id}/assign`    | Gerente               | Atribui um técnico a um chamado aberto               |
| GET    | `/api/v1/tickets/assigned-to-me` | Técnico               | Lista os chamados atribuídos ao técnico autenticado  |
| PATCH  | `/api/v1/tickets/{id}/status`    | Técnico               | Atualiza o status de um chamado atribuído            |

---

## Restrições de Acesso

### Solicitante

Pode:

* Realizar login.
* Criar chamados.
* Consultar seus próprios chamados.
* Acompanhar o andamento das solicitações.

### Gerente

Pode:

* Visualizar chamados abertos.
* Consultar técnicos disponíveis.
* Atribuir técnicos aos chamados.

### Técnico

Pode:

* Visualizar chamados atribuídos.
* Atualizar o status dos chamados sob sua responsabilidade.

### Administrador

Responsável pela gestão de usuários e permissões do sistema.

---

## Fluxo de Utilização da API

1. O usuário realiza autenticação através do endpoint `/auth/login`.
2. O sistema retorna um token JWT.
3. O token é enviado nas requisições subsequentes.
4. O backend valida o token e o perfil do usuário.
5. A operação é executada conforme as permissões definidas para o perfil.

---

## Documentação Interativa

A documentação interativa da API pode ser acessada localmente através do Swagger:

```text
http://localhost:8000/docs
```

O Swagger permite:

* Visualizar todos os endpoints.
* Consultar parâmetros de entrada.
* Ver exemplos de resposta.
* Testar as rotas diretamente pelo navegador.

