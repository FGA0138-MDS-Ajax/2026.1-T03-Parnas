# Guia de Configuração Rápida (Quick Setup) - KeepUnB

Bem-vindo ao **KeepUnB**! Este guia foi feito para ajudar novos desenvolvedores a configurarem o ambiente de desenvolvimento local de forma rápida e padronizada.

---

##  Pré-requisitos Básicos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
1.  **Git** (para controle de versão)
2.  **Docker & Docker Compose** (para rodar a aplicação localmente)
3.  **Python 3.12+** (para rodar ferramentas de qualidade locais)
4.  **Node.js 20+** (para o frontend)

---

##  Passo a Passo de Inicialização

### 1. Clonar o Repositório e Navegar até a Branch Correta
O desenvolvimento principal do projeto ocorre a partir da branch `developer`.
```bash
# Clone o repositório
git clone https://github.com/FGA0138-MDS-Ajax/2026.1-T03-Parnas.git keep-unb
cd keep-unb

# Garanta que você está na branch de desenvolvimento
git checkout developer
```

### 2. Configurar os Arquivos de Variáveis de Ambiente (`.env`)
Tanto o backend quanto o frontend possuem modelos de configuração (`.env.example`). Você precisa copiá-los e criar as configurações locais:

```bash
# Configuração do Backend
cp backend/.env.example backend/.env

# Configuração do Frontend
cp frontend/.env.example frontend/.env
```

> [!NOTE]
> As configurações padrões contidas nos arquivos `.env.example` já estão preparadas para funcionar imediatamente com o Docker Compose local.

### 3. Subir o Ambiente com Docker Compose
O Docker subirá o banco de dados (PostgreSQL), o backend (FastAPI) e o frontend (Next.js):

```bash
docker compose up --build
```

Após o build e a inicialização, você poderá acessar dessa forma:
```bash
#derruba os containers
docker compose down

#sobe os containers
docker compose up
```

*   **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
*   **Backend API (FastAPI):** [http://localhost:8000](http://localhost:8000)
*   **Documentação Automática da API (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)



##  Banco de Dados e Migrações (Alembic)

O controle de tabelas no banco de dados é feito de forma versionada via Alembic. Toda alteração estrutural no banco precisa ser executada dentro do container de desenvolvimento.

### Rodar as migrações existentes:
```bash
docker compose exec backend alembic upgrade head
```

### Popular o banco com dados de teste (Seed):
Para facilitar o desenvolvimento e testes locais, você pode popular o banco com contas de teste que representam cada um dos perfis do sistema (Solicitante, Técnico, Gerente e Administrador). A senha padrão para todos os usuários criados é `123`.

Perfis e e-mails de teste para login:
- solicitante.teste@unb.br
- gerente.teste@unb.br
- tecnico.teste@unb.br
- admin.teste@unb.br
- senha: `123` para todos

Execute o script de seed no container do backend:
```bash
docker compose exec backend python scripts/seed_test_users.py
```

---

##  Fluxo de Trabalho (Git Flow)

Seguimos um padrão rigoroso de commits e ramificações:

### 1. Nomenclatura de Branches
Sempre crie ramificações a partir da `developer`:
*   `feature/nome-da-funcionalidade` (novas telas, endpoints ou funções)
*   `fix/nome-do-bug` (correção de bugs em desenvolvimento)
*   `hotfix/correcao-critica` (correção direta sobre a main/produção)

### 2. Mensagens de Commit (Conventional Commits)
Use mensagens claras e em português ou inglês com as seguintes marcações:
*   `feat: ...` (novas funcionalidades)
*   `fix: ...` (correções de bugs)
*   `docs: ...` (alterações em documentação)
*   `test: ...` (criação ou correção de testes)
*   `chore: ...` (alterações de infraestrutura, builds, dependências)

**Exemplo:**
```bash
git commit -m "feat(solicitante): criar tela de abertura de chamado"
```

---

💡 *Em caso de dúvidas, consulte o [docs/PROJECT_GUIDELINES.md] ou pergunte ao Arquiteto de Software.*
