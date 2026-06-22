# KeepUnB - Sistema de Gestão de solicitações de manutenção da UnB-FCTE

<p align="center">
  <img src="frontend/public/Keep-unb-logo.png" alt="Logo KeepUnB" width="420">
</p>

O **KeepUnB** é uma plataforma centralizada e inteligente desenvolvida para otimizar, automatizar e rastrear as solicitações de manutenção corretiva e preventiva na Universidade de Brasília (UnB).

O sistema permite que os solicitantes relatem problemas de infraestrutura, enquanto fornece ferramentas robustas para administradores, gerentes de equipe e técnicos gerenciarem o ciclo de vida de cada chamado.

---

## Principais Funcionalidades

- **Abertura de Chamados**
- **Painéis Customizados por Perfil**:
  - **Solicitante**: Acompanha seus chamados e cria novos relatos de manutenção.
  - **Técnico**: Acessa a fila de tarefas designadas e atualiza o andamento das ordens de serviço.
  - **Gerente**: Distribui chamados para equipes técnicas e acompanha o andamento das tarefas em tempo real.
  - **Admin**: Gerencia o cadastro de usuários e configurações gerais do sistema.
- **Rastreamento em Tempo Real**: Histórico detalhado de atualizações e comentários em cada chamado.


---

## Especificações Técnicas

A arquitetura do KeepUnB é dividida em serviços independentes utilizando tecnologias modernas e de alta performance:

### Frontend

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="58" alt="Next.js" title="Next.js" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="58" alt="React" title="React" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="58" alt="TypeScript" title="TypeScript" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="58" alt="CSS3" title="CSS3" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="58" alt="Node.js" title="Node.js" />
</p>

### Backend

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" width="58" alt="FastAPI" title="FastAPI" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="58" alt="Python" title="Python" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlalchemy/sqlalchemy-original.svg" width="58" alt="SQLAlchemy" title="SQLAlchemy" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="58" alt="PostgreSQL" title="PostgreSQL" />
</p>

### Infraestrutura & Devops

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="58" alt="Docker" title="Docker" />
</p>

---

## Como Rodar o Projeto Localmente

### Pré-requisitos Básicos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="54" alt="Git" title="Git" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="54" alt="Docker" title="Docker" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="54" alt="Python" title="Python" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="54" alt="Node.js" title="Node.js" />
</p>


### Passo a Passo de Inicialização

### 1. Clonar o Repositório e Navegar até a Branch Correta

O desenvolvimento principal do projeto ocorre a partir da branch `developer`.

```bash
# Clone o repositório
git clone "https://github.com/FGA0138-MDS-Ajax/2026.1-T03-Parnas.git" keep-unb
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


**As configurações padrões contidas nos arquivos `.env.example` já estão preparadas para funcionar imediatamente com o Docker Compose local.**


### 3. Subir o Ambiente com Docker Compose

O Docker subirá o banco de dados (PostgreSQL), o backend (FastAPI) e o frontend (Next.js):

```bash
docker compose up --build
```

Após o build e a inicialização, você poderá acessar:

- **Frontend (Next.js):** http://localhost:3000
- **Backend API (FastAPI):** http://localhost:8000
- **Documentação Automática da API (Swagger UI):** http://localhost:8000/docs

### 4. Popular o Banco com Usuários e Chamados de Teste (Seed)

Para testar as diferentes funcionalidades, permissões e fluxos de chamados do sistema, execute as migrações de banco e o script de seed oficial:

```bash
# Rodar as migrações do banco
docker compose exec backend alembic upgrade head

# Criar os usuários e chamados de teste (Seed Oficial)
docker compose exec backend python scripts/seed_test_5.py
```

Você poderá acessar o sistema utilizando as seguintes credenciais:
* **Senha para todos:** `123`
* **E-mails por perfil:**
  * **Solicitantes:** `solicitante1@unb.br`, `solicitante2@unb.br`, `solicitante3@unb.br`
  * **Técnicos (Ativos):** `tecnico1@unb.br`, `tecnico2@unb.br`
  * **Técnico (Pendente):** `tecnico_pendente@unb.br`
  * **Técnico (Reprovado):** `tecnico_reprovado@unb.br`
  * **Gerentes:** `gerente1@unb.br`, `gerente2@unb.br`
  * **Administradores:** `admin1@unb.br`, `admin2@unb.br`

##  Estrutura do Repositório

```text
keep-unb/
├── backend/            # Código-fonte do servidor FastAPI
│   ├── app/            # Módulos principais (core, models, repositories, routers, schemas, services, utils)
│   ├── migrations/     # Arquivos de migração de banco gerados pelo Alembic
│   └── tests/          # Testes automatizados do backend com PyTest
├── frontend/           # Aplicação web em Next.js (TypeScript)
│   ├── src/
│   │   ├── app/        # Páginas e rotas da aplicação (App Router)
│   │   ├── features/   # Componentes e lógica agrupados por funcionalidade (Ex: landing)
│   │   └── styles/     # Arquivos de estilo globais
│   └── public/         # Ativos estáticos e logotipos oficiais
├── docs/               # Guias rápidos de desenvolvimento e relatórios de sprint
└── docker-compose.yml  # Configuração de containers de desenvolvimento
```

## Contribuidores

<div align="center">
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/carloshfgit">
        <img src="https://github.com/carloshfgit.png?size=120" width="120px;" alt="carloshfgit"/>
        <br />
        <sub><b>carloshfgit</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/felipemso">
        <img src="https://github.com/felipemso.png?size=120" width="120px;" alt="felipemso"/>
        <br />
        <sub><b>felipemso</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/arthur-mariani">
        <img src="https://github.com/arthur-mariani.png?size=120" width="120px;" alt="arthur-mariani"/>
        <br />
        <sub><b>arthur-mariani</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/CharlesRuan-MAP">
        <img src="https://github.com/CharlesRuan-MAP.png?size=120" width="120px;" alt="CharlesRuan-MAP"/>
        <br />
        <sub><b>CharlesRuan-MAP</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/vellloso">
        <img src="https://github.com/vellloso.png?size=120" width="120px;" alt="vellloso"/>
        <br />
        <sub><b>vellloso</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/prietum">
        <img src="https://github.com/prietum.png?size=120" width="120px;" alt="prietum"/>
        <br />
        <sub><b>prietum</b></sub>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/arthurrcoelho">
        <img src="https://github.com/arthurrcoelho.png?size=120" width="120px;" alt="arthurrcoelho"/>
        <br />
        <sub><b>arthurrcoelho</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Dandot1">
        <img src="https://github.com/Dandot1.png?size=120" width="120px;" alt="Dandot1"/>
        <br />
        <sub><b>Dandot1</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Guilhermesouza21">
        <img src="https://github.com/Guilhermesouza21.png?size=120" width="120px;" alt="Guilhermesouza21"/>
        <br />
        <sub><b>Guilhermesouza21</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Danielfelipe08">
        <img src="https://github.com/Danielfelipe08.png?size=120" width="120px;" alt="Danielfelipe08"/>
        <br />
        <sub><b>Danielfelipe08</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/RodrigoCBarbosa">
        <img src="https://github.com/RodrigoCBarbosa.png?size=120" width="120px;" alt="RodrigoCBarbosa"/>
        <br />
        <sub><b>RodrigoCBarbosa</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/caioNapoles">
        <img src="https://github.com/caioNapoles.png?size=120" width="120px;" alt="caioNapoles"/>
        <br />
        <sub><b>caioNapoles</b></sub>
      </a>
    </td>
  </tr>
</table>
</div>
