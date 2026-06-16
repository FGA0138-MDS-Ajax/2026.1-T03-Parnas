# 08/06 - Sprint 5 - Refinamento do MVP, Segurança e Padronização

## Objetivo da Sprint

A Sprint 5 tem como objetivo refinar o MVP do KeepUnB, corrigindo problemas de segurança, melhorando a visualização dos chamados, adicionando foto na criação de chamados, padronizando o visual entre páginas, detalhando a documentação técnica no MkDocs e implementando o cadastro por perfil. O cadastro público será permitido apenas para solicitantes e técnicos. Solicitantes terão acesso liberado após o cadastro, enquanto técnicos precisarão de aprovação de um gerente. Usuários com perfil de gerente serão inseridos no sistema pelo administrador.

---

## Backend

### Objetivo da área

Ajustar as regras de acesso, preparar suporte para upload de imagem nos chamados e criar rotas que permitam diferenciar chamados próprios e chamados abertos de outros solicitantes.

- Tarefas
    - Tarefa 1 — Criar separação de chamados do solicitante
        
        **Descrição:**
        
        Ajustar o backend para permitir que o solicitante visualize dois grupos de chamados:
        
        ```
        Chamados criados por mim
        Chamados em aberto criados por outras pessoas
        ```
        
        **Rotas sugeridas:**
        
        ```
        GET /api/v1/tickets/me
        GET /api/v1/tickets/open/others
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante consegue visualizar os chamados criados por ele.
        - [ ]  Solicitante consegue visualizar chamados abertos criados por outras pessoas.
        - [ ]  Chamados de outras pessoas não exibem dados sensíveis do solicitante original.
        - [ ]  A listagem de chamados de outras pessoas exibe apenas informações necessárias, como local, tipo de manutenção, descrição resumida e status.
        - [ ]  A rota aparece no Swagger.
        
        **Observação importante:**
        
        Essa funcionalidade ajuda a evitar chamados duplicados. Antes de abrir um novo chamado, o solicitante pode ver se alguém já relatou o mesmo problema.
        
    - Tarefa 2 — Corrigir autorização por perfil no backend
        
        **Descrição:**
        
        Garantir que cada rota valide corretamente o perfil do usuário autenticado.
        
        **Problema atual:**
        
        O usuário consegue acessar páginas ou recursos de outro cargo apenas trocando a URL.
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante não consegue acessar rotas exclusivas de técnico.
        - [ ]  Solicitante não consegue acessar rotas exclusivas de gerente.
        - [ ]  Técnico não consegue acessar rotas exclusivas de gerente.
        - [ ]  Gerente não consegue executar ações reservadas para administrador.
        - [ ]  Backend retorna erro `403 Forbidden` quando o usuário não possui permissão.
        - [ ]  Backend retorna erro `401 Unauthorized` quando o usuário não está logado.
        
        **Explicando os códigos:**
        
        `401 Unauthorized` significa que o usuário não está autenticado.
        
        `403 Forbidden` significa que o usuário está logado, mas não tem permissão para acessar aquele recurso.
        
    - Tarefa 3 — Adicionar suporte a imagem no chamado
        
        **Descrição:**
        
        Permitir que o chamado tenha uma foto anexada no momento de criação.
        
        **Ajuste no model/tabela `tickets`:**
        
        ```
        image_url
        ```
        
        ou, se preferirem algo mais direto inicialmente:
        
        ```
        photo_path
        ```
        
        **Rota sugerida:**
        
        ```
        POST /api/v1/tickets
        ```
        
        A rota pode passar a aceitar `multipart/form-data`.
        
        **Explicação simples:**
        
        `multipart/form-data` é o formato usado quando um formulário envia texto e arquivo ao mesmo tempo, como local, descrição e foto.
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante consegue criar chamado com foto.
        - [ ]  Solicitante ainda consegue criar chamado sem foto, caso a foto não seja obrigatória.
        - [ ]  Backend valida o tipo do arquivo.
        - [ ]  Backend aceita apenas formatos seguros, como `.jpg`, `.jpeg` e `.png`.
        - [ ]  Backend limita o tamanho máximo do arquivo.
        - [ ]  O caminho ou URL da foto fica salvo no banco.
        - [ ]  A foto pode ser exibida posteriormente no detalhe do chamado.
        
        **Recomendação:**
        
        Para o MVP, a foto pode ser salva localmente no backend, em uma pasta como:
        
        ```
        backend/uploads/tickets/
        ```
        
    - Tarefa 4 — Criar rota de detalhe público controlado do chamado
        
        **Descrição:**
        
        Criar ou ajustar uma rota para que solicitantes vejam detalhes de chamados abertos de outras pessoas sem expor dados sensíveis.
        
        **Rota sugerida:**
        
        ```
        GET /api/v1/tickets/{id}/public
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante consegue ver detalhes básicos de chamados abertos de outras pessoas.
        - [ ]  Nome, email ou matrícula do solicitante original não são exibidos.
        - [ ]  A foto pode ser exibida, caso exista.
        - [ ]  O status do chamado é exibido.
        - [ ]  Dados internos de técnico ou gerente não são expostos indevidamente.
    - Tarefa 5 — Criar rota de cadastro para solicitante e técnico
        
        **Descrição:**
        
        Criar rota pública de cadastro permitindo apenas os perfis `SOLICITANTE` e `TECNICO`.
        
        **Rota sugerida:**
        
        ```
        POST /api/v1/auth/register
        ```
        
        ---
        
        ## Dados comuns
        
        ```
        nome
        email
        senha
        tipo_usuario
        ```
        
        - Tarefa 5.1 — Cadastro de solicitante
            
            Campos obrigatórios:
            
            ```
            nome
            email
            senha
            matricula
            tipo_usuario = SOLICITANTE
            ```
            
            Regra:
            
            ```
            Solicitante cadastrado → is_active = true
            ```
            
            Critérios de aceite para o solicitante:
            
            - [ ]  Usuário consegue cadastrar solicitante.
            - [ ]  Solicitante recebe perfil `SOLICITANTE`.
            - [ ]  Solicitante já fica ativo após cadastro.
            - [ ]  Solicitante consegue fazer login após cadastro.
            - [ ]  Matrícula é obrigatória para solicitante.
            - [ ]  Email duplicado é bloqueado.
        - Tarefa 5.2 — Cadastro de técnico
            
            Campos obrigatórios:
            
            ```
            nome
            email
            senha
            area_manutencao
            tipo_usuario = TECNICO
            ```
            
            Regra:
            
            ```
            Técnico cadastrado → is_active = false
            approval_status = PENDENTE
            ```
            
            Critérios de aceite:
            
            - [ ]  Usuário consegue solicitar cadastro como técnico.
            - [ ]  Técnico recebe perfil `TECNICO`.
            - [ ]  Técnico fica com status `PENDENTE`.
            - [ ]  Técnico não consegue acessar área técnica antes da aprovação.
            - [ ]  Área de manutenção é obrigatória para técnico.
            - [ ]  Email duplicado é bloqueado.
    - Tarefa 6 — Criar aprovação de técnico pelo gerente
        
        **Descrição:**
        
        Criar rota para que o gerente aprove ou rejeite técnicos pendentes.
        
        **Rotas sugeridas:**
        
        ```
        GET /api/v1/technicians/pending
        PATCH /api/v1/technicians/{id}/approve
        PATCH /api/v1/technicians/{id}/reject
        ```
        
        Critérios de aceite:
        
        - [ ]  Gerente visualiza técnicos pendentes.
        - [ ]  Gerente consegue aprovar técnico.
        - [ ]  Gerente consegue rejeitar técnico.
        - [ ]  Apenas gerente ou administrador consegue aprovar técnico.
        - [ ]  Técnico aprovado passa para `is_active = true`.
        - [ ]  Técnico rejeitado permanece inativo ou recebe status `REJEITADO`.
        - [ ]  Técnico não aprovado não consegue acessar área técnica.
    - Tarefa 7 — Padronizar respostas de erro
        
        **Descrição:**
        
        Garantir que erros de autenticação, autorização, validação e upload retornem mensagens claras.
        
        **Exemplos:**
        
        ```
        {
          "detail":"Usuário não possui permissão para acessar este recurso."
        }
        ```
        
        ```
        {
          "detail":"Formato de imagem não permitido."
        }
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Erros de permissão retornam mensagem clara.
        - [ ]  Erros de upload retornam mensagem clara.
        - [ ]  Erros de validação retornam mensagem clara.
        - [ ]  QA consegue testar os erros pelo Swagger.

---

## Frontend

### Objetivo da área

Melhorar as telas já existentes, corrigir o controle de acesso visual, integrar a separação de chamados do solicitante, permitir envio de foto e padronizar o visual geral da aplicação.

- Tarefas
    - Tarefa 1 — Separar chamados na home do solicitante
        
        **Descrição:**
        
        Alterar a tela inicial do solicitante para exibir duas seções distintas:
        
        ```
        Chamados criados por mim
        Chamados em aberto criados por outras pessoas
        ```
        
        **Página sugerida:**
        
        ```
        /chamados
        ```
        
        **Critérios de aceite:**
        
        - [ ]  A tela possui seção “Chamados criados por mim”.
        - [ ]  A tela possui seção “Chamados em aberto criados por outras pessoas”.
        - [ ]  Chamados de outras pessoas não mostram dados pessoais do solicitante original.
        - [ ]  O usuário consegue diferenciar visualmente os dois grupos.
        - [ ]  Quando não houver chamados, a tela exibe mensagem adequada.
    - Tarefa 2 — Bloquear acesso indevido por URL
        
        **Descrição:**
        
        Implementar proteção de rotas no frontend para impedir acesso visual a páginas de outros perfis.
        
        **Exemplo do problema:**
        
        Um solicitante logado não pode acessar:
        
        ```
        /fila
        ```
        
        apenas digitando a URL da página do técnico.
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante tentando acessar página de técnico é redirecionado.
        - [ ]  Técnico tentando acessar página de gerente é redirecionado.
        - [ ]  Usuário sem login é redirecionado para `/login`.
        - [ ]  A regra usa o perfil do usuário autenticado.
        - [ ]  A proteção funciona mesmo ao digitar a URL manualmente.
        
        **Observação importante:**
        
        O frontend deve bloquear a navegação, mas a segurança real precisa estar também no backend. O frontend melhora a experiência; o backend garante a proteção.
        
    - Tarefa 3 — Adicionar upload de foto no formulário de chamado
        
        **Descrição:**
        
        Adicionar campo para anexar foto no formulário de abertura de chamado.
        
        **Página:**
        
        ```
        /chamados/novo
        ```
        
        **Campos do formulário:**
        
        ```
        local
        tipo de manutenção
        descrição do problema
        foto da ocorrência
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Formulário possui campo para upload de imagem.
        - [ ]  Usuário consegue selecionar uma imagem.
        - [ ]  Interface mostra o nome do arquivo ou pré-visualização.
        - [ ]  Frontend envia a imagem para o backend.
        - [ ]  Mensagem de erro aparece caso o arquivo seja inválido.
        - [ ]  Chamado pode ser criado com ou sem imagem, conforme regra definida.
    - Tarefa 4 — Exibir imagem no detalhe do chamado
        
        **Descrição:**
        
        Permitir que a foto anexada seja exibida na tela de detalhe do chamado.
        
        **Critérios de aceite:**
        
        - [ ]  A imagem aparece no detalhe do chamado quando existir.
        - [ ]  Quando não houver imagem, a tela não quebra.
        - [ ]  A imagem aparece de forma organizada e responsiva.
    - Tarefa 5 — Criar página de cadastro para solicitante e técnico
        
        **Página sugerida:**
        
        ```
        /cadastro
        ```
        
        **Descrição:**
        
        Criar página de cadastro com escolha entre solicitante e técnico.
        
        ---
        
        ## Campos comuns
        
        ```
        nome
        email
        senha
        confirmar senha
        tipo de usuário
        ```
        
        ---
        
        ## Quando selecionar Solicitante
        
        Exibir campo adicional:
        
        ```
        matrícula
        ```
        
        Após cadastro, exibir mensagem:
        
        ```
        Cadastro realizado com sucesso. Você já pode fazer login.
        ```
        
        ---
        
        ## Quando selecionar Técnico
        
        Exibir campo adicional:
        
        ```
        área de manutenção
        ```
        
        Após cadastro, exibir mensagem:
        
        ```
        Cadastro enviado para aprovação. Aguarde a aprovação de um gerente para acessar o sistema.
        ```
        
        ---
        
        ## O que não deve aparecer
        
        A opção **Gerente** não deve aparecer na tela pública de cadastro.
        
        Critérios de aceite:
        
        - [ ]  Página `/cadastro` criada.
        - [ ]  Usuário consegue escolher entre solicitante e técnico.
        - [ ]  Opção gerente não aparece no cadastro.
        - [ ]  Campo matrícula aparece apenas para solicitante.
        - [ ]  Campo área de manutenção aparece apenas para técnico.
        - [ ]  Sistema valida senha e confirmação.
        - [ ]  Sistema impede envio com campos obrigatórios vazios.
        - [ ]  Mensagem de sucesso muda conforme o tipo de usuário.
        - [ ]  Página segue o padrão visual do sistema.
    - Tarefa 6 — Criar tela para gerente aprovar técnicos
        
        **Página sugerida:**
        
        ```
        /dashboard/tecnicos-pendentes
        ```
        
        ou, se quiserem centralizar na home do gerente:
        
        ```
        /dashboard
        ```
        
        **Descrição:**
        
        Permitir que o gerente visualize técnicos pendentes e aprove ou rejeite solicitações.
        
        Critérios de aceite:
        
        - [ ]  Gerente visualiza lista de técnicos pendentes.
        - [ ]  Cada técnico exibe nome, email e área de manutenção.
        - [ ]  Gerente consegue aprovar técnico.
        - [ ]  Gerente consegue rejeitar técnico.
        - [ ]  Após aprovação ou rejeição, o técnico sai da lista de pendentes.
        - [ ]  Solicitante e técnico não conseguem acessar essa tela.
    - Tarefa 7 — Alinhar recurso visual entre páginas
        
        **Descrição:**
        
        Padronizar a interface para que as páginas pareçam parte do mesmo sistema.
        
        **Itens a padronizar:**
        
        ```
        cores
        botões
        cards
        títulos
        inputs
        tabelas/listas
        menus
        espaçamentos
        mensagens de erro
        mensagens de sucesso
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Páginas principais seguem a mesma paleta visual.
        - [ ]  Botões possuem estilo consistente.
        - [ ]  Cards de chamados possuem padrão único.
        - [ ]  Formulários possuem padrão visual semelhante.
        - [ ]  Mensagens de erro e sucesso seguem o mesmo estilo.
        - [ ]  Layouts de solicitante, gerente e técnico mantêm identidade visual comum.

---

## Database

### Objetivo da área

Ajustar a estrutura do banco para suportar imagens nos chamados, melhorar a separação de visualização e garantir que as permissões e dados estejam consistentes.

- Tarefas
    - Tarefa 1 — Adicionar campo de imagem ao chamado
        
        **Descrição:**
        
        Alterar a tabela `tickets` para armazenar o caminho ou URL da imagem anexada ao chamado.
        
        **Campo sugerido:**
        
        ```
        image_url
        ```
        
        ou:
        
        ```
        photo_path
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Tabela `tickets` possui campo para imagem.
        - [ ]  Campo aceita valor nulo.
        - [ ]  Migration é criada.
        - [ ]  Backend consegue salvar e recuperar o caminho da imagem.
    - Tarefa 2 — Revisar dados expostos em chamados de terceiros
        
        **Descrição:**
        
        Validar quais dados podem ser exibidos quando um solicitante vê chamados criados por outras pessoas.
        
        **Dados permitidos sugeridos:**
        
        ```
        id
        local
        tipo_manutencao
        descricao resumida
        status
        created_at
        image_url, se houver
        ```
        
        **Dados que não devem aparecer:**
        
        ```
        nome do solicitante
        email
        matrícula
        telefone
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Dados sensíveis do solicitante original não são retornados.
        - [ ]  Banco possui estrutura suficiente para listagem pública controlada.
        - [ ]  Regras estão alinhadas com backend e requisitos.
    - Tarefa 3 — Ajustar tabela de usuários para aprovação
        
        **Descrição:**
        
        Adicionar campos necessários para controlar cadastro e aprovação.
        
        Campos mínimos na tabela `users`:
        
        ```
        id
        nome
        email
        senha_hash
        role
        is_active
        approval_status
        matricula
        area_manutencao
        created_at
        updated_at
        ```
        
        ---
        
        ## Valores possíveis para `role`
        
        ```
        SOLICITANTE
        TECNICO
        GERENTE
        ADMIN
        ```
        
        ---
        
        ## Valores possíveis para `approval_status`
        
        ```
        APROVADO
        PENDENTE
        REJEITADO
        ```
        
        ---
        
        ## Regras de banco
        
        ```
        Solicitante → approval_status = APROVADO
        Técnico recém-cadastrado → approval_status = PENDENTE
        Técnico aprovado → approval_status = APROVADO
        Técnico rejeitado → approval_status = REJEITADO
        Gerente → criado por admin
        ```
        
        Critérios de aceite:
        
        - [ ]  Campo `approval_status` existe na tabela `users`.
        - [ ]  Campo `is_active` existe na tabela `users`.
        - [ ]  Solicitante pode ser criado ativo.
        - [ ]  Técnico pode ser criado pendente.
        - [ ]  Gerente não depende da página pública de cadastro.
        - [ ]  Migration criada para os novos campos.
        - [ ]  Seeds atualizadas com admin, gerente, solicitante e técnicos pendentes/aprovados.
        
        ---
        
        ## Seeds sugeridas
        
        ```
        1 administrador
        1 gerente
        1 solicitante ativo
        1 técnico aprovado
        1 técnico pendente
        1 técnico rejeitado
        ```
        
        Essas seeds ajudam o QA e o frontend a testar os diferentes cenários.
        
    - Tarefa 4 — Atualizar migrations
        
        **Descrição:**
        
        Criar migration para alterações necessárias no banco.
        
        **Critérios de aceite:**
        
        - [ ]  Migration adiciona campo de imagem ao chamado.
        - [ ]  Migration executa sem erro.
        - [ ]  Banco pode ser recriado a partir das migrations.
    - Tarefa 5 — Atualizar seeds
        
        **Descrição:**
        
        Criar dados de teste para validar os novos cenários da Sprint 5.
        
        **Seeds sugeridas:**
        
        ```
        solicitante com chamados próprios
        outro solicitante com chamados abertos
        chamado com foto
        chamado sem foto
        usuário técnico
        usuário gerente
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Existem chamados criados por mais de um solicitante.
        - [ ]  Existem chamados abertos de terceiros.
        - [ ]  Existe chamado com imagem.
        - [ ]  QA consegue testar separação de listagens.

---

## Analista de Qualidade

## Objetivo da área

Validar as correções críticas da Sprint 5, principalmente visualização de chamados de terceiros, segurança por perfil, upload de imagem e padronização visual.

- Tarefas
    - Tarefa 1 — Testar separação de chamados do solicitante
        
        **Cenários mínimos:**
        
        - [ ]  Solicitante visualiza “Chamados criados por mim”.
        - [ ]  Solicitante visualiza “Chamados em aberto criados por outras pessoas”.
        - [ ]  Chamados de terceiros não exibem dados sensíveis.
        - [ ]  Chamados próprios continuam aparecendo corretamente.
        - [ ]  Chamados de terceiros concluídos não aparecem na lista de abertos.
    - Tarefa 2 — Testar proteção de acesso por perfil
        
        **Cenários mínimos:**
        
        - [ ]  Solicitante tenta acessar URL de técnico.
        - [ ]  Solicitante tenta acessar URL de gerente.
        - [ ]  Técnico tenta acessar URL de gerente.
        - [ ]  Usuário não logado tenta acessar página protegida.
        - [ ]  Usuário é redirecionado corretamente.
        - [ ]  Backend bloqueia acesso indevido mesmo se a requisição for feita manualmente.
    - Tarefa 3 — Testar upload de foto no chamado
        
        **Cenários mínimos:**
        
        - [ ]  Criar chamado com imagem válida `.jpg`.
        - [ ]  Criar chamado com imagem válida `.png`.
        - [ ]  Tentar enviar arquivo inválido.
        - [ ]  Tentar enviar imagem acima do tamanho permitido.
        - [ ]  Criar chamado sem imagem, caso seja permitido.
        - [ ]  Verificar se a imagem aparece no detalhe do chamado.
    - Tarefa 4 — Testar padronização visual
        
        **Descrição:**
        
        Validar se as principais páginas seguem o mesmo padrão visual.
        
        **Checklist:**
        
        - [ ]  Botões seguem mesmo padrão.
        - [ ]  Campos de formulário seguem mesmo padrão.
        - [ ]  Cards de chamados seguem mesmo padrão.
        - [ ]  Mensagens de erro seguem mesmo padrão.
        - [ ]  Menus e layouts estão coerentes.
        - [ ]  Cores estão alinhadas à identidade do KeepUnB.
    - Tarefa 5 — Testar cadastro de solicitante
        
        Cenários mínimos:
        
        - [ ]  Criar solicitante com dados válidos.
        - [ ]  Tentar criar solicitante sem matrícula.
        - [ ]  Tentar criar solicitante com email já cadastrado.
        - [ ]  Verificar se solicitante fica ativo.
        - [ ]  Verificar se solicitante consegue fazer login após cadastro.
    - Tarefa 6 — Testar solicitação de cadastro de técnico
        
        Cenários mínimos:
        
        - [ ]  Criar técnico com dados válidos.
        - [ ]  Tentar criar técnico sem área de manutenção.
        - [ ]  Verificar se técnico fica com status `PENDENTE`.
        - [ ]  Verificar se técnico não consegue acessar área técnica antes da aprovação.
        - [ ]  Verificar se técnico não aprovado não consegue receber chamados.
    - Tarefa 7 — Testar aprovação de técnico pelo gerente
        
        Cenários mínimos:
        
        - [ ]  Gerente visualiza técnicos pendentes.
        - [ ]  Gerente aprova técnico.
        - [ ]  Técnico aprovado consegue fazer login.
        - [ ]  Técnico aprovado consegue acessar área técnica.
        - [ ]  Gerente rejeita técnico.
        - [ ]  Técnico rejeitado não consegue acessar área técnica.
    - Tarefa 8 — Testar bloqueio de cadastro de gerente
        
        Cenários mínimos:
        
        - [ ]  Opção gerente não aparece na página de cadastro.
        - [ ]  Tentativa manual de enviar `role = GERENTE` pela API é rejeitada.
        - [ ]  Gerente só existe quando criado pelo administrador ou seed.
    - Tarefa 9 — Testar documentação técnica
        
        **Descrição:**
        
        Validar se o MkDocs possui informações suficientes para um novo membro entender e rodar o projeto.
        
        **Critérios de aceite:**
        
        - [ ]  Estrutura de pastas está documentada.
        - [ ]  Rotas principais estão documentadas.
        - [ ]  URLs locais estão documentadas.
        - [ ]  Protocolos e formatos de comunicação estão descritos.
        - [ ]  Fluxo de autenticação está explicado.
        - [ ]  Instruções de execução local estão atualizadas.

---

## Analistas de Requisitos e Documentação

### Objetivo da área

Atualizar a documentação funcional e técnica do projeto, deixando claro o comportamento esperado do sistema e detalhando melhor a estrutura técnica no MkDocs.

- Tarefas
    - Tarefa 1 — Atualizar regra de visualização de chamados
        
        **Descrição:**
        
        Documentar a nova regra de visualização do solicitante.
        
        **Regra:**
        
        O solicitante deve visualizar seus próprios chamados e também chamados abertos criados por outras pessoas, desde que não sejam exibidos dados sensíveis dos demais usuários.
        
        **Critérios de aceite:**
        
        - [ ]  Documento descreve “Chamados criados por mim”.
        - [ ]  Documento descreve “Chamados em aberto criados por outras pessoas”.
        - [ ]  Documento explica quais dados podem ser exibidos.
        - [ ]  Documento explica quais dados devem permanecer ocultos.
    - Tarefa 2 — Documentar regras de segurança por perfil
        
        **Descrição:**
        
        Atualizar a documentação com as regras de acesso por perfil.
        
        **Critérios de aceite:**
        
        - [ ]  Solicitante possui permissões descritas.
        - [ ]  Técnico possui permissões descritas.
        - [ ]  Gerente possui permissões descritas.
        - [ ]  Administrador possui permissões descritas.
        - [ ]  Documento informa que páginas e rotas devem ser protegidas por perfil.
    - Tarefa 3 — Documentar upload de imagem
        
        **Descrição:**
        
        Registrar a regra de anexar foto ao chamado.
        
        **Pontos a documentar:**
        
        ```
        campo de foto no chamado
        formatos aceitos
        tamanho máximo permitido
        onde a imagem será exibida
        se a imagem é obrigatória ou opcional
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Documento explica quando a foto pode ser adicionada.
        - [ ]  Documento informa formatos aceitos.
        - [ ]  Documento informa se a foto é obrigatória ou opcional.
        - [ ]  Documento indica onde a foto aparece no sistema.
    - Tarefa 4 — Atualizar regra de cadastro por perfil
        
        **Descrição:**
        
        Documentar a regra oficial de cadastro.
        
        Texto sugerido:
        
        ```
        O sistema permitirá cadastro público apenas para solicitantes e técnicos. Solicitantes terão acesso liberado após o cadastro. Técnicos poderão solicitar cadastro, mas precisarão de aprovação de um gerente antes de acessar a área técnica. Usuários com perfil de gerente não poderão se cadastrar publicamente, sendo inseridos no sistema pelo administrador.
        ```
        
        Critérios de aceite:
        
        - [ ]  Documento explica cadastro de solicitante.
        - [ ]  Documento explica cadastro de técnico com aprovação.
        - [ ]  Documento explica que gerente é criado pelo administrador.
        - [ ]  Documento explica os status `PENDENTE`, `APROVADO` e `REJEITADO`.
    - Tarefa 5 — Detalhar estrutura técnica no MkDocs
        
        **Descrição:**
        
        Melhorar a documentação técnica do MkDocs para que novos membros entendam melhor o projeto.
        
        **Seções recomendadas:**
        
        ```
        Estrutura de pastas
        Arquitetura MVC no backend
        Organização feature-based no frontend
        Protocolos de comunicação
        URLs locais
        Rotas principais da API
        Fluxo de autenticação com JWT
        Docker e ambiente local
        Migrations e seeds
        Padrão de branches e pull requests
        ```
        
        **Critérios de aceite:**
        
        - [ ]  MkDocs possui explicação da estrutura de pastas do backend.
        - [ ]  MkDocs possui explicação da estrutura de pastas do frontend.
        - [ ]  MkDocs explica o uso de HTTP/HTTPS e JSON.
        - [ ]  MkDocs lista URLs locais do projeto.
        - [ ]  MkDocs documenta rotas principais.
        - [ ]  MkDocs explica como o token JWT é usado.
        - [ ]  MkDocs explica como rodar o ambiente local.

---

## DevOps / Infraestrutura

### Objetivo da área

Manter o ambiente local funcionando e garantir que upload de imagens, Docker e documentação de execução continuem consistentes.

- Tarefas
    - Tarefa 1 — Ajustar Docker para suportar upload de imagens
        
        **Descrição:**
        
        Garantir que o container do backend consiga salvar e servir imagens enviadas nos chamados.
        
        **Critérios de aceite:**
        
        - [ ]  Pasta de uploads existe dentro do ambiente.
        - [ ]  Docker não perde imagens ao reiniciar, caso seja usado volume.
        - [ ]  Backend consegue acessar arquivos salvos.
        - [ ]  README explica a pasta de uploads.
    - Tarefa 2 — Atualizar variáveis de ambiente
        
        **Descrição:**
        
        Adicionar variáveis relacionadas ao upload, se necessário.
        
        **Exemplos:**
        
        ```
        UPLOAD_DIR=uploads/tickets
        MAX_UPLOAD_SIZE=5242880
        ```
        
        **Critérios de aceite:**
        
        - [ ]  `.env.example` possui variáveis novas.
        - [ ]  README explica as variáveis.
        - [ ]  Projeto roda sem erro com as novas configurações.