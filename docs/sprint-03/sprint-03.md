# 25/05 Sprint 3 - Base funcional orientada aos perfis

## Objetivo da Sprint 3

A Sprint 3 será a base funcional do KeepUnB. O foco será implementar o fluxo principal do sistema: solicitante cria chamado, gerente atribui técnico e técnico atualiza o andamento da manutenção. A sprint também deve garantir que backend, frontend, banco de dados, QA e documentação estejam alinhados para permitir desenvolvimento paralelo nas próximas etapas.

---

## Explicação resumo da Sprint 3

- Perfis considerados
    
    O sistema deve considerar quatro perfis principais:
    
    - **Solicitante**
    - **Gerente**
    - **Técnico**
    - **Administrador**
    
    Cada perfil terá permissões diferentes dentro do sistema.
    
    ---
    
- Fluxo principal da Sprint 3
    
    O funcionamento base do sistema deve seguir este fluxo:
    
    ```
    Solicitante cria chamado
            ↓
    Gerente visualiza chamados abertos
            ↓
    Gerente atribui técnico disponível
            ↓
    Técnico visualiza chamado atribuído
            ↓
    Técnico atualiza andamento da manutenção
    ```
    
    ---
    
- Modelo mínimo do chamado
    
    Nesta sprint, o chamado deve ser criado com as seguintes informações principais:
    
    - local;
    - tipo de manutenção;
    - descrição do problema;
    - status;
    - solicitante responsável;
    - técnico atribuído, quando houver.
    
    Inicialmente, o chamado nasce sem técnico atribuído. O técnico será definido posteriormente pelo gerente.
    
    ---
    
- Status mínimos do chamado
    
    Os status básicos do chamado serão:
    
    ```
    ABERTO
    ATRIBUIDO
    EM_ANDAMENTO
    CONCLUIDO
    CANCELADO
    ```
    
    O fluxo principal de status será:
    
    ```
    ABERTO → ATRIBUIDO → EM_ANDAMENTO → CONCLUIDO
    ```
    
    ---
    
- Homes por perfil
    
    Cada perfil deve possuir uma tela inicial própria:
    
    #### Solicitante
    
    Visualiza seus chamados, acompanha o status e pode abrir um novo chamado.
    
    #### Gerente
    
    Visualiza chamados abertos, consulta técnicos disponíveis e atribui um técnico ao chamado.
    
    #### Técnico
    
    Visualiza apenas os chamados atribuídos a ele e atualiza o andamento da manutenção.
    
    #### Administrador
    
    Pode existir nesta sprint como perfil do sistema, mas suas funcionalidades completas podem ficar para sprints futuras.
    
    ---
    
- Regras de permissão mínimas
    - O **solicitante** pode criar chamados e acompanhar seus próprios chamados.
    - O **gerente** pode visualizar chamados abertos e atribuir técnicos.
    - O **técnico** pode visualizar apenas chamados atribuídos a ele e atualizar o status.
    - O **administrador** será reservado para gestão de usuários e permissões em etapas futuras.
    
    ---
    

---

## Backend

### Objetivo da área

Criar a base da API em FastAPI utilizando MVC convencional, permitindo autenticação inicial, criação de chamados, atribuição de técnicos e atualização de status.

- Tarefas
    - Tarefa 1 — Criar model de usuário ✅
        
        **Descrição:**
        
        Criar o model `User`, representando os usuários do sistema.
        
        **Campos mínimos:**
        
        ```
        id
        nome
        email
        senha_hash
        role
        is_active
        created_at
        ```
        
        **Perfis possíveis:**
        
        ```
        SOLICITANTE
        GERENTE
        TECNICO
        ADMIN
        ```
        
        **Critérios de aceitação:**
        
        - [x]  O sistema possui um model de usuário.
        - [x]  O backend consegue diferenciar solicitante, gerente, técnico e administrador.
        
        **Observação técnica:**
        
        `Model` é a representação de uma tabela do banco dentro do código.
        
        ---
        
    - Tarefa 2 — Criar model de chamado
        
        **Descrição:**
        
        Criar o model `Ticket`, representando os chamados de manutenção.
        
        **Campos mínimos:**
        
        ```
        id
        local
        tipo_manutencao
        descricao
        status
        solicitante_id
        tecnico_id
        created_at
        updated_at
        ```
        
        **Critérios de aceite:**
        
        - [ ]  O chamado pode ser criado com local, tipo de manutenção e descrição.
        - [ ]  O chamado nasce sem técnico atribuído.
        - [ ]  O chamado possui status inicial `ABERTO`.
        - [ ]  O chamado pode receber um técnico posteriormente.
        
        ---
        
    - Tarefa 3 — Criar autenticação inicial com JWT
        
        **Descrição:**
        
        Criar autenticação básica para identificar o usuário logado e seu perfil.
        
        **Rotas sugeridas:**
        
        ```
        POST /api/v1/auth/login
        GET /api/v1/users/me
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Usuário consegue realizar login.
        - [ ]  Backend retorna um token JWT.
        - [ ]  Backend consegue identificar o usuário logado.
        - [ ]  Backend consegue identificar o perfil do usuário logado.
        
        **Observação técnica:**
        
        JWT é um token gerado no login. Ele funciona como uma “credencial temporária” enviada pelo frontend para provar que o usuário está autenticado.
        
        ---
        
    - Tarefa 4 — Criar rota para abertura de chamado
        
        **Descrição:**
        
        Criar rota para que o solicitante possa abrir um chamado.
        
        **Rota sugerida:**
        
        ```
        POST /api/v1/tickets
        ```
        
        **Dados de entrada:**
        
        ```
        local
        tipo_manutencao
        descricao
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Apenas usuários com perfil de solicitante conseguem criar chamados.
        - [ ]  O chamado é criado com status `ABERTO`.
        - [ ]  O chamado fica associado ao solicitante logado.
        - [ ]  A rota aparece no Swagger.
        
        **Observação técnica:**
        
        Swagger é uma interface automática gerada pelo FastAPI para visualizar e testar as rotas da API pelo navegador.
        
    - Tarefa 5 — Criar rota para listar chamados do solicitante
        
        **Descrição:**
        
        Criar rota para que o solicitante veja seus próprios chamados.
        
        **Rota sugerida:**
        
        ```
        GET /api/v1/tickets/me
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante visualiza apenas os chamados criados por ele.
        - [ ]  A resposta retorna local, tipo de manutenção, descrição e status.
        - [ ]  A rota aparece no Swagger.
    - Tarefa 6 — Criar rota para gerente visualizar chamados abertos
        
        **Descrição:**
        
        Criar rota para que o gerente veja chamados que ainda precisam de atribuição.
        
        **Rota sugerida:**
        
        ```
        GET /api/v1/tickets/open
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Gerente consegue visualizar chamados com status `ABERTO`.
        - [ ]  Técnicos e solicitantes não devem usar essa rota.
        - [ ]  A rota aparece no Swagger.
    - Tarefa 7 — Criar rota para listar técnicos disponíveis
        
        **Descrição:**
        
        Criar rota para o gerente visualizar técnicos disponíveis para atribuição.
        
        **Rota sugerida:**
        
        ```
        GET /api/v1/technicians/available
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Gerente consegue visualizar usuários com perfil `TECNICO`.
        - [ ]  A rota retorna técnicos ativos.
        - [ ]  A rota aparece no Swagger.
    - Tarefa 8 — Criar rota para atribuir técnico a chamado
        
        **Descrição:**
        
        Criar rota para que o gerente atribua um técnico a um chamado aberto.
        
        **Rota sugerida:**
        
        ```
        PATCH /api/v1/tickets/{id}/assign
        ```
        
        **Dados de entrada:**
        
        ```
        tecnico_id
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Apenas gerente consegue atribuir técnico.
        - [ ]  O chamado recebe um `tecnico_id`.
        - [ ]  O status do chamado muda de `ABERTO` para `ATRIBUIDO`.
        - [ ]  Não é possível atribuir técnico inexistente.
        - [ ]  A rota aparece no Swagger.
    - Tarefa 9 — Criar rota para técnico visualizar seus chamados
        
        **Descrição:**
        
        Criar rota para que o técnico visualize somente os chamados atribuídos a ele.
        
        **Rota sugerida:**
        
        ```
        GET /api/v1/tickets/assigned-to-me
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Técnico visualiza apenas chamados atribuídos ao seu próprio usuário.
        - [ ]  Técnico não visualiza chamados de outros técnicos.
        - [ ]  A rota aparece no Swagger.
    - Tarefa 10 — Criar rota para técnico atualizar status
        
        **Descrição:**
        
        Criar rota para que o técnico atualize o andamento da manutenção.
        
        **Rota sugerida:**
        
        ```
        PATCH /api/v1/tickets/{id}/status
        ```
        
        **Status permitidos para o técnico:**
        
        ```
        EM_ANDAMENTO
        CONCLUIDO
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Técnico só consegue atualizar chamados atribuídos a ele.
        - [ ]  Técnico consegue mudar status para `EM_ANDAMENTO`.
        - [ ]  Técnico consegue mudar status para `CONCLUIDO`.
        - [ ]  Técnico não consegue atualizar chamado de outro técnico.
        - [ ]  A rota aparece no Swagger.

---

## Frontend

### Objetivo da área

Criar as páginas iniciais dos três perfis principais, permitindo navegação e simulação do fluxo principal do sistema.

Nesta sprint, as telas podem funcionar com dados mockados enquanto o backend ainda estiver sendo finalizado.

**Observação técnica:**

Mock é um dado falso usado temporariamente para simular o comportamento do sistema antes da integração real com o backend.

- Tarefas
    - Tarefa 1 — Criar tela de login
        
        **Página sugerida:**
        
        ```
        /login
        ```
        
        **Descrição:**
        
        Criar tela inicial de login para entrada no sistema.
        
        **Campos mínimos:**
        
        ```
        email
        senha
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Tela possui campo de email.
        - [ ]  Tela possui campo de senha.
        - [ ]  Tela possui botão de login.
        - [ ]  Após login ou simulação, o usuário é direcionado para a home correta conforme seu perfil.
    - Tarefa 2 — Criar home do solicitante
        
        **Página sugerida:**
        
        ```
        /chamados
        ```
        
        **Descrição:**
        
        Criar página inicial do solicitante.
        
        **Deve conter:**
        
        - lista de chamados do solicitante;
        - status de cada chamado;
        - botão para criar novo chamado.
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante visualiza seus chamados.
        - [ ]  Solicitante vê o status de cada chamado.
        - [ ]  Solicitante consegue acessar a tela de novo chamado.
        - [ ]  A tela pode funcionar inicialmente com mock.
    - Tarefa 3 — Criar formulário de novo chamado
        
        **Página sugerida:**
        
        ```
        /chamados/novo
        ```
        
        **Descrição:**
        
        Criar formulário para abertura de chamado.
        
        **Campos obrigatórios:**
        
        ```
        local
        tipo de manutenção
        descrição do problema
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Formulário possui campo de local.
        - [ ]  Formulário possui campo de tipo de manutenção.
        - [ ]  Formulário possui campo de descrição.
        - [ ]  Sistema impede envio sem descrição.
        - [ ]  Chamado criado aparece na listagem ou simulação da listagem.
    - Tarefa 4 — Criar home do gerente
        
        **Página sugerida:**
        
        ```
        /dashboard
        ```
        
        **Descrição:**
        
        Criar página inicial do gerente focada na atribuição de chamados.
        
        **Deve conter:**
        
        - lista de chamados abertos;
        - lista de técnicos disponíveis;
        - ação para atribuir técnico a um chamado.
        
        **Critérios de aceite:**
        
        - [ ]  Gerente visualiza chamados com status `ABERTO`.
        - [ ]  Gerente visualiza técnicos disponíveis.
        - [ ]  Gerente consegue simular ou realizar atribuição de técnico.
        - [ ]  Após atribuição, o chamado muda visualmente para `ATRIBUIDO`.
    - Tarefa 5 — Criar home do técnico
        
        **Página sugerida:**
        
        ```
        /fila
        ```
        
        **Descrição:**
        
        Criar página inicial do técnico.
        
        **Deve conter:**
        
        - lista de chamados atribuídos ao técnico;
        - status de cada chamado;
        - acesso ao detalhe do chamado.
        
        **Critérios de aceite:**
        
        - [ ]  Técnico visualiza apenas chamados atribuídos a ele.
        - [ ]  Técnico consegue acessar o detalhe de um chamado.
        - [ ]  A tela pode funcionar inicialmente com mock.
    - Tarefa 6 — Criar tela de detalhe do chamado para o técnico
        
        **Página sugerida:**
        
        ```
        /fila/chamado/[id]
        ```
        
        **Descrição:**
        
        Criar tela onde o técnico visualiza detalhes do chamado e atualiza o andamento.
        
        **Deve conter:**
        
        - local;
        - tipo de manutenção;
        - descrição do problema;
        - status atual;
        - botão para iniciar atendimento;
        - botão para concluir atendimento.
        
        **Critérios de aceite:**
        
        - [ ]  Técnico visualiza os dados principais do chamado.
        - [ ]  Técnico consegue alterar status para `EM_ANDAMENTO`.
        - [ ]  Técnico consegue alterar status para `CONCLUIDO`.

---

## Database

### Objetivo da área

Criar a base inicial do banco de dados para sustentar o fluxo principal da aplicação.

- Tarefas
    - Tarefa 1 — Criar DER inicial
        
        **Descrição:**
        
        Criar o Diagrama Entidade-Relacionamento inicial do sistema.
        
        **Entidades mínimas:**
        
        ```
        users
        tickets
        comments
        ```
        
        **Relacionamentos mínimos:**
        
        ```
        Usuário 1:N Chamados como solicitante
        Usuário 1:N Chamados como técnico
        Chamado 1:N Comentários
        ```
        
        **Critérios de aceite:**
        
        - [x]  DER possui tabela de usuários.
        - [x]  DER possui tabela de chamados.
        - [x]  DER possui tabela de comentários.
        - [x]  DER mostra relação entre solicitante e chamado.
        - [x]  DER mostra relação entre técnico e chamado.
    - Tarefa 2 — Criar tabela de usuários
        
        **Descrição:**
        
        Definir estrutura da tabela `users`.
        
        **Campos mínimos:**
        
        ```
        id
        nome
        email
        senha_hash
        role
        is_active
        created_at
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Tabela permite identificar o perfil do usuário.
        - [ ]  Tabela permite diferenciar técnico, gerente, solicitante e admin.
        - [ ]  Email deve ser único.
    - Tarefa 3 — Criar tabela de chamados
        
        **Descrição:**
        
        Definir estrutura da tabela `tickets`.
        
        **Campos mínimos:**
        
        ```
        id
        local
        tipo_manutencao
        descricao
        status
        solicitante_id
        tecnico_id
        created_at
        updated_at
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Chamado possui solicitante obrigatório.
        - [ ]  Chamado pode iniciar sem técnico.
        - [ ]  Chamado possui status.
        - [ ]  Chamado armazena local, tipo de manutenção e descrição.
    - Tarefa 4 — Criar tabela de comentários
        
        **Descrição:**
        
        Definir estrutura da tabela `comments`.
        
        **Campos mínimos:**
        
        ```
        id
        ticket_id
        user_id
        mensagem
        created_at
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Comentário pertence a um chamado.
        - [ ]  Comentário pertence a um usuário.
        - [ ]  Comentário registra data de criação.
    - Tarefa 5 — Criar migration inicial
        
        **Descrição:**
        
        Criar migration para gerar as tabelas principais.
        
        **Critérios de aceite:**
        
        - [ ]  Migration cria tabela `users`.
        - [ ]  Migration cria tabela `tickets`.
        - [ ]  Migration cria tabela `comments`.
        - [ ]  Migration pode ser executada em ambiente local.
    - Tarefa 6 — Criar seed inicial
        
        **Descrição:**
        
        Criar dados iniciais para teste.
        
        **Dados sugeridos:**
        
        ```
        1 usuário solicitante
        1 usuário gerente
        2 usuários técnicos
        1 usuário administrador
        3 chamados fictícios
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Banco possui usuários de teste.
        - [ ]  Banco possui técnicos disponíveis.
        - [ ]  Banco possui chamados abertos.
        - [ ]  Equipe de frontend e QA consegue usar esses dados para testes.

---

## Analista de Qualidade

## Objetivo da área

Garantir que o fluxo principal da Sprint 3 possa ser testado de forma clara, objetiva e repetível.

- Tarefas
    - Tarefa 1 — Criar plano de testes da Sprint 3
        
        **Descrição:**
        
        Criar documento com os testes que serão executados na sprint.
        
        **Fluxos que devem ser cobertos:**
        
        ```
        login por perfil
        criação de chamado
        listagem de chamados do solicitante
        atribuição de técnico pelo gerente
        visualização de chamados pelo técnico
        atualização de status pelo técnico
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Plano de testes cobre os três perfis principais.
        - [ ]  Plano de testes cobre o fluxo principal completo.
        - [ ]  Plano de testes define resultado esperado para cada cenário.
    - Tarefa 2 — Criar casos de teste do solicitante
        
        **Cenários mínimos:**
        
        - [ ]  Criar chamado com dados válidos.
        - [ ]  Tentar criar chamado sem descrição.
        - [ ]  Visualizar chamados criados pelo usuário.
        - [ ]  Ver status do chamado.
    - Tarefa 3 — Criar casos de teste do gerente
        
        **Cenários mínimos:**
        
        - [ ]  Visualizar chamados abertos.
        - [ ]  Visualizar técnicos disponíveis.
        - [ ]  Atribuir técnico a um chamado.
        - [ ]  Verificar mudança de status para `ATRIBUIDO`.
        - [ ]  Tentar atribuir técnico inexistente.
    - Tarefa 4 — Criar casos de teste do técnico
        
        **Cenários mínimos:**
        
        - [ ]  Visualizar chamados atribuídos ao técnico.
        - [ ]  Não visualizar chamados de outro técnico.
        - [ ]  Atualizar status para `EM_ANDAMENTO`.
        - [ ]  Atualizar status para `CONCLUIDO`.
        - [ ]  Tentar atualizar chamado não atribuído ao técnico.
    - Tarefa 5 — Testar rotas no Swagger
        
        **Descrição:**
        
        Validar as rotas principais usando a documentação automática do FastAPI.
        
        **Rotas a testar:**
        
        ```
        POST /api/v1/auth/login
        GET /api/v1/users/me
        POST /api/v1/tickets
        GET /api/v1/tickets/me
        GET /api/v1/tickets/open
        GET /api/v1/technicians/available
        PATCH /api/v1/tickets/{id}/assign
        GET /api/v1/tickets/assigned-to-me
        PATCH /api/v1/tickets/{id}/status
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Todas as rotas aparecem no Swagger.
        - [ ]  As rotas principais retornam respostas esperadas.
        - [ ]  Erros comuns retornam mensagens compreensíveis.
        
        **Observação técnica:**
        
        Swagger é uma interface automática gerada pelo FastAPI para visualizar e testar as rotas da API pelo navegador.
        

---

## Analistas de Requisitos e Documentação

## Objetivo da área

Manter a documentação do projeto alinhada com a implementação real da Sprint 3, principalmente considerando o uso de MVC convencional e o fluxo por perfis.

- Tarefas
    - Tarefa 1 — Documentar fluxo principal do sistema
        
        **Descrição:**
        
        Registrar o fluxo funcional principal da Sprint 3.
        
        **Fluxo a documentar:**
        
        ```
        Solicitante cria chamado com local, tipo de manutenção e descrição.
        Gerente visualiza chamados abertos.
        Gerente atribui técnico disponível.
        Técnico visualiza chamados atribuídos a ele.
        Técnico atualiza andamento da manutenção.
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Fluxo está descrito de forma clara.
        - [ ]  Documento diferencia as responsabilidades de cada perfil.
        - [ ]  Documento indica os status possíveis do chamado.
    - Tarefa 3 — Documentar regras de permissão
        
        **Descrição:**
        
        Criar seção descrevendo o que cada perfil pode fazer.
        
        **Perfis:**
        
        ```
        Solicitante
        Gerente
        Técnico
        Administrador
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Permissões do solicitante estão descritas.
        - [ ]  Permissões do gerente estão descritas.
        - [ ]  Permissões do técnico estão descritas.
        - [ ]  Permissões do administrador estão descritas, mesmo que parcialmente futuras.
    - Tarefa 4 — Documentar endpoints da Sprint 3
        
        **Descrição:**
        
        Criar uma tabela com as rotas principais da API.
        
        **Modelo sugerido:**
        
        | Método | Rota | Perfil permitido | Descrição |
        | --- | --- | --- | --- |
        | POST | `/api/v1/auth/login` | Todos | Realiza login |
        | GET | `/api/v1/users/me` | Todos autenticados | Retorna usuário logado |
        | POST | `/api/v1/tickets` | Solicitante | Cria chamado |
        | GET | `/api/v1/tickets/me` | Solicitante | Lista chamados do solicitante |
        | GET | `/api/v1/tickets/open` | Gerente | Lista chamados abertos |
        | GET | `/api/v1/technicians/available` | Gerente | Lista técnicos disponíveis |
        | PATCH | `/api/v1/tickets/{id}/assign` | Gerente | Atribui técnico |
        | GET | `/api/v1/tickets/assigned-to-me` | Técnico | Lista chamados atribuídos |
        | PATCH | `/api/v1/tickets/{id}/status` | Técnico | Atualiza status do chamado |
        
        **Critérios de aceite:**
        
        - [ ]  Todas as rotas principais estão documentadas.
        - [ ]  Cada rota possui método HTTP.
        - [ ]  Cada rota possui perfil autorizado.
        - [ ]  Cada rota possui descrição simples.
    - Tarefa 5 — Criar README de execução local
        
        **Descrição:**
        
        Criar ou atualizar README explicando como rodar o projeto localmente.
        
        **Deve conter:**
        
        ```
        como instalar dependências do backend
        como instalar dependências do frontend
        como configurar .env
        como rodar banco de dados
        como executar migrations
        como iniciar backend
        como iniciar frontend
        como acessar Swagger
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Um membro novo consegue rodar o projeto seguindo o README.
        - [ ]  README explica como acessar backend.
        - [ ]  README explica como acessar frontend.
        - [ ]  README explica como acessar Swagger.

---

## DevOps / Infraestrutura - Arquiteto de Software (FEITO✅)

## Objetivo da área

Criar um ambiente local padronizado para que todos os membros consigam executar o sistema com o mínimo de configuração manual.

- Tarefas
    - Tarefa 1 — Criar Dockerfile do backend
        
        **Descrição:**
        
        Criar o arquivo Dockerfile para executar a API FastAPI em container.
        
        **Critérios de aceite:**
        
        - [x]  Backend roda dentro de um container.
        - [x]  Container instala as dependências do `requirements.txt`.
        - [x]  API FastAPI sobe corretamente.
        - [x]  Swagger fica acessível em `/docs`.
    - Tarefa 2 — Criar Dockerfile do frontend
        
        **Descrição:**
        
        Criar o arquivo Dockerfile para executar o frontend Next.js em container.
        
        **Critérios de aceite:**
        
        - [x]  Frontend roda dentro de um container.
        - [x]  Container instala as dependências do projeto.
        - [x]  Aplicação fica acessível no navegador.
        - [x]  Frontend consegue apontar para a URL do backend.
    - Tarefa 3 — Criar Docker Compose com Backend, Frontend e PostgreSQL
        
        **Descrição:**
        
        Configurar o ambiente local do projeto com Docker Compose, permitindo subir backend, frontend e banco de dados com um único comando.
        
        **Serviços mínimos:**
        
        ```
        frontend
        backend
        database
        ```
        
        **Critérios de aceite:**
        
        - [x]  `docker compose up` sobe backend, frontend e PostgreSQL.
        - [x]  Backend consegue se conectar ao PostgreSQL.
        - [x]  Frontend consegue acessar o backend.
        - [x]  Swagger fica acessível em `http://localhost:8000/docs`.
        - [x]  Banco mantém os dados usando volume.
        - [x]  README explica como rodar o ambiente.

Etapas concluídas por Carlos Costa - 22/05/26 ✅

---