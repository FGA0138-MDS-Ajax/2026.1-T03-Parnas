# README - Execução Local do KeepUnB

## Descrição

Este documento apresenta os passos necessários para configurar e executar o projeto KeepUnB em ambiente local de desenvolvimento.

## Objetivo

Permitir que novos membros da equipe consigam instalar, configurar e executar o sistema localmente de forma padronizada.

---

# Pré-requisitos

Antes de iniciar, certifique-se de possuir as seguintes ferramentas instaladas:

* Git
* Docker
* Docker Compose
* Python 3.12+
* Node.js 20+

---

# Clonando o Repositório

```bash
git clone https://github.com/FGA0138-MDS-Ajax/2026.1-T03-Parnas.git keep-unb
cd keep-unb
git checkout developer
```

---

# Configuração do Ambiente

## Configurar arquivo .env

### Backend

```bash
cp backend/.env.example backend/.env
```

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

As configurações presentes nos arquivos `.env.example` já estão preparadas para execução local utilizando Docker Compose.

---

# Instalação das Dependências

## Backend

As dependências do backend são instaladas automaticamente durante a construção do container Docker.

Caso seja necessário instalar manualmente:

```bash
cd backend
pip install -r requirements.txt
```

## Frontend

As dependências do frontend também são instaladas automaticamente pelo Docker.

Caso seja necessário instalar manualmente:

```bash
cd frontend
npm install
```

---

# Banco de Dados

O banco PostgreSQL é iniciado automaticamente pelo Docker Compose.

Para iniciar todos os serviços:

```bash
docker compose up --build
```

---

# Executando as Migrações

Para aplicar todas as migrações do banco de dados:

```bash
docker compose exec backend alembic upgrade head
```

---

# Iniciando o Backend

O backend é iniciado automaticamente pelo Docker Compose.

A API ficará disponível em:

```text
http://localhost:8000
```

---

# Iniciando o Frontend

O frontend é iniciado automaticamente pelo Docker Compose.

A aplicação ficará disponível em:

```text
http://localhost:3000
```

---

# Acessando o Swagger

A documentação interativa da API pode ser acessada através do endereço:

```text
http://localhost:8000/docs
```

O Swagger permite:

* Visualizar endpoints disponíveis;
* Consultar parâmetros de entrada;
* Testar requisições;
* Ver exemplos de resposta.

---

# Estrutura dos Serviços

| Serviço  | URL                        |
| -------- | -------------------------- |
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:8000      |
| Swagger  | http://localhost:8000/docs |

---

