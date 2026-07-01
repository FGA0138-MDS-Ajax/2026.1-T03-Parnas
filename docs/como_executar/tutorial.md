# Guia de Teste Local - KeepUnB

Bem-vindo ao **KeepUnB**!
Este guia foi criado para ajudar usuários, avaliadores e membros da equipe a executarem o projeto localmente para fins de teste, sem a necessidade de configurar manualmente o backend, frontend ou banco de dados.

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

1. **Git**
   Usado para baixar o repositório do projeto.

2. **Docker e Docker Compose**
   Usados para executar o sistema completo localmente, incluindo backend, frontend e banco de dados.

3. **Navegador web**
   Usado para acessar a aplicação e a documentação da API.

!!! note
    Para apenas testar o projeto usando Docker, não é necessário instalar manualmente Python, Node.js ou os arquivos de requirements. As dependências são configuradas automaticamente durante a criação dos containers.

---

## Passo a passo para executar o projeto

### 1. Clonar o repositório

Abra o terminal e execute:

```bash
git clone "https://github.com/FGA0138-MDS-Ajax/2026.1-T03-Parnas.git" keep-unb
cd keep-unb
```

---

### 2. Acessar a branch correta

O ambiente cujo as atualizações mais estáveis e a versão mais recente está presente é a `main`.

```bash
git checkout main
```

---

### 3. Configurar os arquivos de ambiente

O projeto possui arquivos de exemplo com as configurações necessárias para rodar localmente.

Execute:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Caso esteja usando Windows e o comando `cp` não funcione no terminal, use:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

!!! note
    Os arquivos `.env.example` já possuem configurações preparadas para o ambiente local com Docker.

---

### 4. Subir o projeto com Docker Compose

Com o Docker aberto em sua máquina, execute:

```bash
docker compose up --build
```

Esse comando irá iniciar os principais serviços do projeto:

* Banco de dados PostgreSQL
* Backend com FastAPI
* Frontend com Next.js

---

## Acessar o sistema

Após a inicialização dos containers, acesse:

* **Frontend:** http://localhost:3000
* **Backend API:** http://localhost:8000
* **Swagger / Documentação da API:** http://localhost:8000/docs

---

## Como parar o projeto

Para encerrar a execução, pressione `CTRL + C` no terminal onde o Docker está rodando.

Depois, se quiser garantir que os containers foram encerrados, execute:

```bash
docker compose down
```

---

