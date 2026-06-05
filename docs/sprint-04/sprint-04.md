# 01/06 - Sprint 4 - Consolidação do fluxo de chamados

## Objetivo da Sprint 4

A Sprint 4 tem como objetivo consolidar o fluxo principal do KeepUnB, integrando frontend, backend e banco de dados. O foco será permitir que o solicitante crie chamados pela interface, que o gerente visualize e atribua técnicos, e que o técnico acompanhe e atualize os chamados atribuídos a ele. Também serão reforçadas as regras de permissão, validações, histórico básico, testes e documentação do sistema.

---

## Backend

### Objetivo da área

Evoluir as rotas criadas na Sprint 3, adicionar validações, regras de permissão e garantir que o fluxo de chamados funcione corretamente no backend.

- Tarefas
    - Tarefa 1 — Refinar regras de permissão por perfil ✅
        
        **Descrição:**
        
        Garantir que cada perfil consiga acessar apenas as rotas permitidas.
        
        **Regras mínimas:**
        
        ```
        Solicitante:
        - criar chamado
        - visualizar seus próprios chamados
        - acompanhar status
        
        Gerente:
        - visualizar chamados abertos
        - visualizar técnicos disponíveis
        - atribuir técnico
        - visualizar chamados em andamento
        
        Técnico:
        - visualizar apenas chamados atribuídos a ele
        - atualizar status dos seus chamados
        
        Administrador:
        - reservado para gestão futura de usuários e permissões
        ```
        
        **Critérios de aceite:**
        
        - [x]  Solicitante não consegue acessar rotas de gerente.
        - [x]  Técnico não consegue acessar chamados de outro técnico.
        - [x]  Gerente consegue atribuir técnico.
        - [x]  Rotas protegidas exigem autenticação.
        - [x]  Backend retorna erro adequado quando o usuário não tem permissão.
        
        **Termo técnico:**
        
        Autorização é diferente de autenticação.
        
        **Autenticação** verifica quem é o usuário.
        
        **Autorização** verifica o que esse usuário pode fazer.
        
    - Tarefa 2 — Melhorar validação da criação de chamado
        
        **Descrição:**
        
        Garantir que o chamado só seja criado quando os dados obrigatórios forem preenchidos corretamente.
        
        **Campos obrigatórios:**
        
        ```
        local
        tipo_manutencao
        descricao
        ```
        
        **Critérios de aceite:**
        
        - [x]  Não é possível criar chamado sem local.
        - [ ]  Não é possível criar chamado sem tipo de manutenção.
        - [ ]  Não é possível criar chamado sem descrição.
        - [ ]  Chamado criado recebe status `ABERTO`.
        - [ ]  Chamado fica vinculado ao solicitante logado.
    - Tarefa 3 — Criar rota de detalhes do chamado
        
        **Descrição:**
        
        Criar rota para buscar os detalhes completos de um chamado.
        
        **Rota sugerida:**
        
        ```
        GET /chamados/id
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante consegue ver detalhes dos próprios chamados.
        - [ ]  Gerente consegue ver detalhes dos chamados.
        - [ ]  Técnico consegue ver detalhes dos chamados atribuídos a ele.
        - [ ]  Usuário não autorizado não consegue acessar chamado indevido.
    - Tarefa 4 — Refinar atribuição de técnico
        
        **Descrição:**
        
        Melhorar a regra de atribuição feita pelo gerente.
        
        **Regras sugeridas:**
        
        - chamado precisa estar `ABERTO`;
        - técnico precisa existir;
        - técnico precisa estar ativo;
        - usuário atribuído precisa ter perfil `TECNICO`;
        - após atribuição, status muda para `ATRIBUIDO`.
        
        **Critérios de aceite:**
        
        - [ ]  Gerente não consegue atribuir técnico inexistente.
        - [ ]  Gerente não consegue atribuir usuário que não seja técnico.
        - [ ]  Gerente não consegue atribuir técnico a chamado já concluído.
        - [ ]  Status muda corretamente para `ATRIBUIDO`.
    - Tarefa 5 — Criar histórico simples do chamado
        
        **Descrição:**
        
        Registrar alterações importantes no chamado, como atribuição e mudança de status.
        
        **Exemplo de histórico:**
        
        ```
        Chamado criado
        Técnico atribuído
        Status alterado para EM_ANDAMENTO
        Status alterado para CONCLUIDO
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Alterações de status são registradas.
        - [ ]  Atribuição de técnico é registrada.
        - [ ]  Histórico pode ser consultado no detalhe do chamado.
        
        **Termo técnico:**
        
        Histórico ou log é um registro das ações feitas no sistema. Ele ajuda a saber quem fez o quê e quando.
        
    - Tarefa 6 — Padronizar respostas de erro da API
        
        **Descrição:**
        
        Definir um padrão para mensagens de erro retornadas pelo backend.
        
        **Exemplo:**
        
        ```
        {
          "detail":"Usuário não possui permissão para acessar este recurso."
        }
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Erros de permissão retornam mensagem clara.
        - [ ]  Erros de validação retornam mensagem clara.
        - [ ]  Erros de recurso inexistente retornam mensagem clara.
        - [ ]  QA consegue entender o motivo do erro testando pelo Swagger.

---

## Frontend

### Objetivo da área

Integrar as telas criadas na Sprint 3 com a API real, melhorando o fluxo de navegação e deixando as páginas iniciais de cada perfil mais úteis.

- Tarefas
    - Tarefa 1 — Integrar tela de login com backend
        
        **Descrição:**
        
        Conectar a tela de login à rota real de autenticação.
        
        **Rota usada:**
        
        ```
        POST /api/v1/auth/login
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Usuário consegue fazer login com dados reais.
        - [ ]  Token JWT é armazenado temporariamente no frontend.
        - [ ]  Usuário é redirecionado para a home correta conforme perfil.
        - [ ]  Login inválido exibe mensagem de erro.
        
        **Termo técnico:**
        
        Token é como uma “credencial temporária”. Depois do login, o frontend envia esse token para o backend em cada requisição protegida.
        
    - Tarefa 2 — Integrar criação de chamado
        
        **Descrição:**
        
        Conectar o formulário de novo chamado à API real.
        
        **Página:**
        
        ```
        /chamado/novo
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Formulário envia local, tipo de manutenção e descrição para o backend.
        - [ ]  Chamado é criado no banco.
        - [ ]  Usuário recebe confirmação visual.
        - [ ]  Após criar, usuário é redirecionado para a lista de chamados.
    - Tarefa 3 — Integrar home do solicitante
        
        **Descrição:**
        
        Substituir os mocks pela listagem real dos chamados do solicitante.
        
        **Página:**
        
        ```
        /solicitante/dashboard
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante visualiza chamados vindos da API.
        - [ ]  Cada chamado exibe local, tipo de manutenção e status.
        - [ ]  Solicitante consegue acessar detalhes do chamado.
        - [ ]  Tela mostra mensagem quando não houver chamados.
    - Tarefa 4 — Integrar home do gerente
        
        **Descrição:**
        
        Conectar a tela do gerente com chamados abertos e técnicos disponíveis.
        
        **Página sugerida:**
        
        ```
        /dashboard
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Gerente visualiza chamados abertos vindos da API.
        - [ ]  Gerente visualiza lista de técnicos disponíveis.
        - [ ]  Gerente consegue atribuir técnico a um chamado.
        - [ ]  Após atribuição, chamado deixa de aparecer como aberto ou muda visualmente para `ATRIBUIDO`.
    - Tarefa 5 — Integrar home do técnico
        
        **Descrição:**
        
        Conectar a fila do técnico com os chamados atribuídos a ele.
        
        **Página:**
        
        ```
        /chamados/fila
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Técnico visualiza apenas chamados atribuídos a ele.
        - [ ]  Dados vêm da API real.
        - [ ]  Técnico consegue acessar detalhes do chamado.
        - [ ]  Tela mostra mensagem quando não houver chamados atribuídos.
    - Tarefa 6 — Integrar atualização de status pelo técnico
        
        **Descrição:**
        
        Permitir que o técnico atualize o andamento do chamado pela interface.
        
        **Página:**
        
        ```
        /fila/chamado/id
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Técnico consegue alterar status para `EM_ANDAMENTO`.
        - [ ]  Técnico consegue alterar status para `CONCLUIDO`.
        - [ ]  Interface exibe o status atualizado.
        - [ ]  Solicitante consegue visualizar a mudança de status depois.
        

---

## Database

### Objetivo da área

Ajustar o banco para suportar melhor o fluxo real de chamados, incluindo histórico, relacionamentos e dados de teste mais úteis.

- Tarefas
    - Tarefa 1 — Revisar estrutura das tabelas principais
        
        **Descrição:**
        
        Verificar se as tabelas criadas na Sprint 3 atendem corretamente ao fluxo da Sprint 4.
        
        **Tabelas principais:**
        
        ```
        users
        tickets
        manager
        technician
        ```
        
        Possível nova tabela:
        
        ```
        ticket_history
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Tabela `tickets` possui solicitante e técnico atribuído.
        - [ ]  Tabela `tickets` possui status.
        - [ ]  Tabela `users` possui role/perfil.
        - [ ]  Relacionamentos estão funcionando corretamente.
    - Tarefa 2 — Criar tabela de histórico de chamados
        
        **Descrição:**
        
        Criar tabela para registrar alterações importantes no chamado.
        
        **Campos sugeridos:**
        
        ```
        id
        ticket_id
        user_id
        acao
        status_anterior
        status_novo
        created_at
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Histórico está relacionado a um chamado.
        - [ ]  Histórico registra o usuário responsável pela ação.
        - [ ]  Histórico registra mudança de status.
        - [ ]  Histórico registra data da ação.
    - Tarefa 3 — Atualizar migrations
        
        **Descrição:**
        
        Criar ou ajustar migrations para refletir mudanças no banco.
        
        **Critérios de aceite:**
        
        - [ ]  Migrations executam sem erro.
        - [ ]  Banco local pode ser recriado a partir das migrations.
        - [ ]  Estrutura do banco está alinhada com os models do backend.
    - Tarefa 4 — Melhorar seeds de teste
        
        **Descrição:**
        
        Criar dados iniciais que permitam testar todos os perfis.
        
        **Seeds sugeridas:**
        
        ```
        1 solicitante
        1 gerente
        2 técnicos
        1 administrador
        2 chamados abertos
        1 chamado atribuído
        1 chamado em andamento
        1 chamado concluído
        ```
        
        **Critérios de aceite:**
        
        - [ ]  QA consegue testar o fluxo do solicitante.
        - [ ]  QA consegue testar o fluxo do gerente.
        - [ ]  QA consegue testar o fluxo do técnico.
        - [ ]  Frontend consegue desenvolver usando dados reais.

---

## Analista de Qualidade

### Objetivo da área

Testar o fluxo principal com dados reais, garantindo que as permissões e transições de status estejam funcionando corretamente.

- Tarefas
    - Tarefa 1 — Atualizar plano de testes da Sprint 4
        
        **Descrição:**
        
        Expandir o plano de testes da Sprint 3 para cobrir integração e permissões.
        
        **Critérios de aceite:**
        
        - [ ]  Plano cobre login real.
        - [ ]  Plano cobre fluxo completo de chamado.
        - [ ]  Plano cobre regras de permissão.
        - [ ]  Plano cobre erros esperados.
    - Tarefa 2 — Testar fluxo completo do solicitante
        
        **Cenários mínimos:**
        
        - [ ]  Login como solicitante.
        - [ ]  Criar chamado válido.
        - [ ]  Tentar criar chamado incompleto.
        - [ ]  Visualizar lista de chamados.
        - [ ]  Acompanhar mudança de status.
    - Tarefa 3 — Testar fluxo completo do gerente
        
        **Cenários mínimos:**
        
        - [ ]  Login como gerente.
        - [ ]  Visualizar chamados abertos.
        - [ ]  Visualizar técnicos disponíveis.
        - [ ]  Atribuir técnico válido.
        - [ ]  Tentar atribuir usuário que não é técnico.
        - [ ]  Tentar atribuir chamado inexistente.
    - Tarefa 4 — Testar fluxo completo do técnico
        
        **Cenários mínimos:**
        
        - [ ]  Login como técnico.
        - [ ]  Visualizar chamados atribuídos.
        - [ ]  Não visualizar chamados de outro técnico.
        - [ ]  Atualizar status para `EM_ANDAMENTO`.
        - [ ]  Atualizar status para `CONCLUIDO`.
        - [ ]  Tentar atualizar chamado não atribuído.
    - Tarefa 5 — Testar integração frontend/backend
        
        **Descrição:**
        
        Validar se as telas estão consumindo corretamente a API.
        
        **Critérios de aceite:**
        
        - [ ]  Login funciona pela interface.
        - [ ]  Criação de chamado funciona pela interface.
        - [ ]  Atribuição funciona pela interface.
        - [ ]  Atualização de status funciona pela interface.
        - [ ]  Mensagens de erro aparecem corretamente.
        

---

## Analistas de Requisitos e Documentação

### Objetivo da área

Atualizar os requisitos, regras de negócio e documentação técnica com base no que foi implementado e validado na Sprint 4.

- Tarefas
    - Tarefa 1 — Atualizar regras de negócio dos chamados
        
        **Descrição:**
        
        Documentar as regras principais do fluxo de chamados.
        
        **Regras a documentar:**
        
        ```
        Chamado nasce com status ABERTO.
        Chamado aberto pode receber técnico.
        Ao receber técnico, status muda para ATRIBUIDO.
        Técnico só vê chamados atribuídos a ele.
        Técnico pode mudar status para EM_ANDAMENTO.
        Técnico pode mudar status para CONCLUIDO.
        Solicitante acompanha status do chamado.
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Documento descreve o fluxo completo.
        - [ ]  Documento descreve as transições de status.
        - [ ]  Documento descreve permissões por perfil.
    - Tarefa 2 — Atualizar documentação de endpoints
        
        **Descrição:**
        
        Atualizar a tabela de rotas da API com as rotas implementadas ou refinadas na Sprint 4.
        
        **Critérios de aceite:**
        
        - [ ]  Rotas possuem método HTTP.
        - [ ]  Rotas possuem perfil autorizado.
        - [ ]  Rotas possuem descrição.
        - [ ]  Rotas possuem exemplo de entrada e saída quando necessário.
    - Tarefa 3 — Atualizar documentação de execução local
        
        **Descrição:**
        
        Garantir que o README esteja atualizado com Docker, migrations e seeds.
        
        **Critérios de aceite:**
        
        - [ ]  README explica como subir o projeto.
        - [ ]  README explica como executar migrations.
        - [ ]  README explica como rodar seeds.
        - [ ]  README explica como acessar Swagger.
        - [ ]  README informa usuários de teste.
    - Tarefa 4 — Criar guia de uso inicial por perfil
        
        **Descrição:**
        
        Criar uma documentação simples mostrando como cada perfil usa o sistema.
        
        **Perfis:**
        
        ```
        Solicitante
        Gerente
        Técnico
        Administrador
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Guia explica como o solicitante cria chamado.
        - [ ]  Guia explica como o gerente atribui técnico.
        - [ ]  Guia explica como o técnico atualiza andamento.
        - [ ]  Guia explica o papel inicial do administrador.

---

## DevOps / Infraestrutura

### Objetivo da área

Garantir que o ambiente local esteja funcionando de forma consistente para todos os membros.

- Tarefas
    - Tarefa 1 — Validar Docker Compose em todas as máquinas possíveis
        
        **Descrição:**
        
        Verificar se o ambiente sobe corretamente para diferentes membros do grupo.
        
        **Critérios de aceite:**
        
        - [ ]  `docker compose up` funciona.
        - [ ]  Backend sobe.
        - [ ]  Frontend sobe.
        - [ ]  PostgreSQL sobe.
        - [ ]  Swagger fica acessível.
        - [ ]  Frontend consegue acessar backend.
    - Tarefa 2 — Corrigir problemas de ambiente
        
        **Descrição:**
        
        Corrigir erros encontrados ao rodar o projeto localmente.
        
        **Critérios de aceite:**
        
        - [ ]  Erros comuns estão documentados.
        - [ ]  README possui seção de troubleshooting.
        - [ ]  Variáveis de ambiente estão explicadas.
        
        **Termo técnico:**
        
        Troubleshooting é uma seção de “problemas comuns e soluções”.
        

---