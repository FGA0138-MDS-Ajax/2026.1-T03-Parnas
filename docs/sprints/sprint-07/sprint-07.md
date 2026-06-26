# 15/06 - Sprint 6 - Fechamento funcional do KeepUnB

## Objetivo da Sprint 6

A Sprint 6 será focada no fechamento funcional do KeepUnB. Nesta sprint, serão corrigidos problemas de sessão entre múltiplas abas, permitindo que cada aba mantenha seu próprio usuário autenticado. Também será implementada a sugestão de técnico para o gerente, considerando área de manutenção, aprovação, status ativo e carga de trabalho. Além disso, será criada e padronizada a página de administrador, com acesso via login, validação adicional por PIN e permissões para criar gerentes, editar, desativar e excluir contas. A sprint também deve consolidar indicadores básicos, permissões por perfil, padronização visual e documentação técnica, preparando o sistema para a Sprint 7, que será dedicada à estabilização e entrega final.

---

## Backend

### Objetivo da área

Implementar suporte às sessões independentes, sugestão de técnico, permissões administrativas, validação de PIN e rotas necessárias para o painel de administrador.

- Tarefas
    - Tarefa 1 — Corrigir lógica de sessão por aba
        
        **Descrição:**
        
        Garantir que o backend trabalhe de forma independente por requisição, usando sempre o token enviado pela aba atual.
        
        **Critérios de aceite:**
        
        - [ ]  Backend identifica usuário com base no token recebido.
        - [ ]  `GET /api/v1/users/me` retorna o usuário correto da sessão atual.
        - [ ]  Trocar usuário em uma aba não altera a sessão de outra.
        - [ ]  Refresh em uma aba mantém o usuário correto.
        - [ ]  Rotas continuam protegidas por perfil.
        
        **Observação técnica:**
        
        O backend não deve depender de uma variável global para saber quem está logado. Cada requisição deve carregar seu próprio token.
        
    - Tarefa 2 — Criar endpoint de sugestão de técnico
        
        **Rota sugerida:**
        
        ```
        GET /api/v1/tickets/{id}/suggest-technician
        ```
        
        **Descrição:**
        
        Criar uma rota para sugerir o técnico mais adequado para um chamado.
        
        **Regras de sugestão:**
        
        ```
        1. Técnico precisa estar ativo
        2. Técnico precisa estar aprovado
        3. Técnico precisa ter perfil TECNICO
        4. Área do técnico deve ser compatível com o tipo de manutenção
        5. Técnico com menor número de chamados ativos tem prioridade
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Gerente consegue solicitar sugestão para um chamado.
        - [ ]  Sistema não sugere solicitantes, gerentes ou administradores.
        - [ ]  Sistema não sugere técnicos pendentes ou rejeitados.
        - [ ]  Sistema considera área de manutenção.
        - [ ]  Sistema considera quantidade de chamados ativos.
        - [ ]  Rota aparece no Swagger.
    - Tarefa 3 — Ajustar atribuição de técnico com sugestão
        
        **Rotas envolvidas:**
        
        ```
        GET /api/v1/tickets/{id}/suggest-technician
        PATCH /api/v1/tickets/{id}/assign
        ```
        
        **Descrição:**
        
        Permitir que o gerente aceite a sugestão do sistema ou escolha outro técnico manualmente.
        
        **Critérios de aceite:**
        
        - [ ]  Gerente consegue aceitar técnico sugerido.
        - [ ]  Gerente consegue escolher outro técnico.
        - [ ]  Chamado recebe `tecnico_id`.
        - [ ]  Status muda para `ATRIBUIDO`.
        - [ ]  Histórico registra a atribuição.
        - [ ]  Apenas gerente pode atribuir técnico.
        
    - Tarefa 4 — Criar rotas administrativas
        
        **Descrição:**
        
        Criar rotas exclusivas para administradores gerenciarem contas.
        
        **Rotas sugeridas:**
        
        ```
        GET /api/v1/admin/users
        POST /api/v1/admin/managers
        PATCH /api/v1/admin/users/{id}
        DELETE /api/v1/admin/users/{id}
        PATCH /api/v1/admin/users/{id}/deactivate
        ```
        
        **Permissões:**
        
        ```
        Apenas ADMIN
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Admin visualiza usuários cadastrados.
        - [ ]  Admin cria gerente.
        - [ ]  Admin edita dados de contas.
        - [ ]  Admin desativa contas.
        - [ ]  Admin exclui.
        - [ ]  Usuários comuns não acessam rotas administrativas.
        - [ ]  Rotas aparecem no Swagger.
    - Tarefa 5 — Implementar validação de PIN do administrador
        
        **Descrição:**
        
        Criar validação de PIN para liberar acesso ao painel administrativo ou ações sensíveis.
        
        **Rotas sugeridas:**
        
        ```
        POST /api/v1/admin/verify-pin
        POST /api/v1/admin/change-pin
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Admin precisa validar PIN para acessar painel administrativo.
        - [ ]  PIN não é salvo em texto puro no banco.
        - [ ]  PIN é salvo como hash.
        - [ ]  Tentativas incorretas retornam erro.
        - [ ]  Usuários não-admin não conseguem validar PIN administrativo.
        - [ ]  Ações sensíveis exigem PIN validado.
        
        **Explicação rápida:**
        
        Hash é uma versão criptografada/embaralhada do PIN. O sistema não deve salvar o PIN real no banco.
        
    - Tarefa 6 — Consolidar indicadores básicos para gerente/admin
        
        **Descrição:**
        
        Criar dados básicos para painel de gestão.
        
        **Indicadores mínimos:**
        
        ```
        total de chamados abertos
        total de chamados atribuídos
        total de chamados em andamento
        total de chamados concluídos
        quantidade de técnicos ativos
        quantidade de técnicos pendentes
        chamados por tipo de manutenção
        ```
        
        **Rota sugerida:**
        
        ```
        GET /api/v1/dashboard/summary
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Gerente visualiza resumo dos chamados.
        - [ ]  Admin consegue visualizar resumo geral.
        - [ ]  Indicadores vêm do banco.
        - [ ]  Rota respeita autenticação e perfil.

---

## Frontend

### Objetivo da área

Corrigir o problema de múltiplas abas, integrar sugestão de técnico, criar/padronizar página de administrador e finalizar as telas principais do sistema.

- Tarefas
    - Tarefa 1 — Corrigir sessões independentes por aba
        
        **Descrição:**
        
        Ajustar o armazenamento da sessão no frontend para que cada aba mantenha usuário, token e perfil próprios.
        
        **Ajuste recomendado:**
        
        ```
        Substituir localStorage por sessionStorage para dados de sessão.
        ```
        
        **Dados afetados:**
        
        ```
        token
        role
        userId
        nome
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Duas abas podem ter usuários diferentes.
        - [ ]  Refresh em uma aba não altera a outra.
        - [ ]  Logout em uma aba não troca o usuário da outra.
        - [ ]  Proteção de rotas continua funcionando.
        - [ ]  Usuário sem login é redirecionado para `/login`.
    - Tarefa 2 — Integrar sugestão de técnico no painel do gerente
        
        **Página sugerida:**
        
        ```
        /dashboard
        ```
        
        ou:
        
        ```
        /dashboard/chamados/[id]
        ```
        
        **Descrição:**
        
        Exibir técnico sugerido quando o gerente for atribuir um chamado.
        
        **Componente sugerido:**
        
        ```
        Técnico sugerido
        Área de atuação
        Quantidade de chamados ativos
        Botão "Usar sugestão"
        Botão "Escolher outro técnico"
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Gerente visualiza técnico sugerido.
        - [ ]  Gerente consegue aceitar sugestão.
        - [ ]  Gerente consegue escolher outro técnico.
        - [ ]  Interface mostra sucesso após atribuição.
        - [ ]  Interface mostra erro se não houver técnico compatível.
    - Tarefa 3 — Criar e padronizar página de administrador
        
        **Página sugerida:**
        
        ```
        /admin
        ```
        
        ou:
        
        ```
        /admin/dashboard
        ```
        
        **Descrição:**
        
        Criar área administrativa com padrão visual alinhado ao restante do sistema.
        
        **Deve conter:**
        
        ```
        lista de usuários
        criação de gerente
        edição de usuário
        desativação/exclusão de usuário
        indicadores gerais simples
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Admin acessa a página após login.
        - [ ]  Página segue padrão visual do KeepUnB.
        - [ ]  Página possui menu ou seções claras.
        - [ ]  Admin consegue visualizar usuários.
        - [ ]  Admin consegue criar gerente.
        - [ ]  Admin consegue editar dados de contas.
        - [ ]  Admin consegue desativar ou excluir contas.
        - [ ]  Usuários não-admin são bloqueados.
    - Tarefa 4 — Criar tela de validação de PIN do admin
        
        **Página sugerida:**
        
        ```
        /admin/pin
        ```
        
        **Fluxo:**
        
        ```
        Login como admin
                ↓
        Redireciona para /admin/pin
                ↓
        Admin informa PIN
                ↓
        Se correto, acessa /admin
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Admin precisa informar PIN antes de acessar painel.
        - [ ]  PIN incorreto mostra mensagem de erro.
        - [ ]  PIN correto libera o painel.
        - [ ]  Página segue padrão visual do sistema.
        - [ ]  Usuário não-admin não acessa essa tela.

---

## Database

### Objetivo da área

Ajustar o banco para suportar sugestão de técnico, PIN administrativo, permissões administrativas e indicadores básicos.

- Tarefas
    - Tarefa 1 — Garantir campos necessários para sugestão de técnico
        
        **Tabela `users`:**
        
        ```
        area_manutencao
        role
        is_active
        approval_status
        ```
        
        **Tabela `tickets`:**
        
        ```
        tipo_manutencao
        status
        tecnico_id
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Técnicos possuem área de manutenção.
        - [ ]  Chamados possuem tipo de manutenção.
        - [ ]  É possível contar chamados ativos por técnico.
        - [ ]  Seeds possuem técnicos de áreas diferentes.
    - Tarefa 2 — Adicionar suporte ao PIN administrativo
        
        **Opção simples:**
        
        Adicionar na tabela `users`:
        
        ```
        admin_pin_hash
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Admin possui campo para PIN em hash.
        - [ ]  PIN não é salvo em texto puro.
        - [ ]  Migration é criada.
        - [ ]  Seed de admin possui PIN configurado para testes.
    - Tarefa 3 — Revisar permissões e status de conta
        
        **Campos necessários:**
        
        ```
        role
        is_active
        approval_status
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Admin pode criar gerente.
        - [ ]  Gerente não é criado por cadastro público.
        - [ ]  Técnico pode estar pendente, aprovado ou rejeitado.
        - [ ]  Usuário desativado não consegue acessar o sistema.
        - [ ]  Banco suporta alteração de perfil quando permitido.
    - Tarefa 4 — Atualizar seeds finais
        
        **Seeds sugeridas:**
        
        ```
        1 administrador com PIN
        1 gerente
        2 solicitantes
        4 técnicos aprovados
        1 técnico pendente
        1 técnico rejeitado
        chamados abertos
        chamados atribuídos
        chamados em andamento
        chamados concluídos
        chamados com foto
        chamados de tipos diferentes
        ```
        
        **Critérios de aceite:**
        
        - [ ]  QA consegue testar todos os perfis.
        - [ ]  Gerente consegue testar sugestão de técnico.
        - [ ]  Admin consegue testar criação de gerente.
        - [ ]  Admin consegue testar edição/desativação de usuários.
        - [ ]  Múltiplos tipos de manutenção existem para testar sugestão.

---

## Analista de Qualidade

### Objetivo da área

Testar as funcionalidades finais adicionadas na Sprint 6 e preparar a validação completa da Sprint 7.

- Tarefas
    - Tarefa 1 — Testar múltiplas abas com sessões diferentes
        
        **Cenários mínimos:**
        
        - [ ]  Abrir uma aba como solicitante.
        - [ ]  Abrir outra aba como técnico.
        - [ ]  Dar refresh na aba do solicitante.
        - [ ]  Confirmar que continua como solicitante.
        - [ ]  Dar refresh na aba do técnico.
        - [ ]  Confirmar que continua como técnico.
        - [ ]  Abrir uma terceira aba como admin.
        - [ ]  Confirmar que cada aba mantém seu perfil.
        - [ ]  Verificar se a troca de URL ainda respeita permissões.
    - Tarefa 2 — Testar sugestão de técnico
        
        **Cenários mínimos:**
        
        - [ ]  Gerente solicita sugestão para chamado elétrico.
        - [ ]  Sistema sugere técnico da área elétrica.
        - [ ]  Sistema prioriza técnico com menos chamados ativos.
        - [ ]  Técnico pendente não aparece como sugestão.
        - [ ]  Técnico rejeitado não aparece como sugestão.
        - [ ]  Técnico desativado não aparece como sugestão.
        - [ ]  Gerente aceita sugestão.
        - [ ]  Gerente escolhe outro técnico manualmente.
    - Tarefa 3 — Testar página de administrador
        
        **Cenários mínimos:**
        
        - [ ]  Admin faz login.
        - [ ]  Admin informa PIN correto.
        - [ ]  Admin acessa painel administrativo.
        - [ ]  Admin cria gerente.
        - [ ]  Admin edita dados de usuário.
        - [ ]  Admin desativa usuário.
        - [ ]  Admin exclui usuário, se essa regra for mantida.
        - [ ]  Usuário não-admin tenta acessar `/admin`.
        - [ ]  Usuário não-admin é bloqueado.
    - Tarefa 4 — Testar PIN administrativo
        
        **Cenários mínimos:**
        
        - [ ]  PIN correto libera acesso.
        - [ ]  PIN incorreto bloqueia acesso.
        - [ ]  Usuário não-admin não tem interações com PIN.
        - [ ]  Ações sensíveis exigem PIN validado.
        - [ ]  PIN não aparece em texto puro no banco.
    - Tarefa 5 — Testar fluxo completo do produto
        
        Fluxo final esperado:
        
        ```
        Solicitante cria conta
        Solicitante abre chamado com foto
        Gerente visualiza chamado
        Sistema sugere técnico
        Gerente atribui técnico
        Técnico recebe chamado
        Técnico atualiza andamento
        Solicitante acompanha status
        Admin gerencia contas
        ```
        
        **Critérios de aceite:**
        
        - [ ]  Fluxo funciona de ponta a ponta.
        - [ ]  Permissões são respeitadas.
        - [ ]  Status mudam corretamente.
        - [ ]  Foto aparece corretamente.
        - [ ]  Admin consegue gerenciar usuários.
        - [ ]  Gerente consegue usar sugestão de técnico.

---

## Analistas de Requisitos e Documentação

### Objetivo da área

Atualizar a documentação para refletir o funcionamento final do sistema antes da Sprint 7.

- Tarefas
    - Tarefa 1 — Documentar comportamento de múltiplas abas
        
        **Descrição:**
        
        Registrar como o sistema deve lidar com sessões independentes.
        
        **Pontos a documentar:**
        
        ```
        uso de sessionStorage
        token por aba
        comportamento esperado após refresh
        logout por aba
        proteção de rotas
        ```
        
    - Tarefa 2 — Documentar sugestão de técnico
        
        **Descrição:**
        
        Explicar a regra usada para sugerir técnicos.
        
    - Tarefa 3 — Documentar painel administrativo
        
        **Pontos a documentar:**
        
        ```
        acesso pelo login
        validação por PIN
        criação de gerentes
        edição de contas
        desativação/exclusão de contas
        permissões do administrador
        ```
        
    - Tarefa 4 — Atualizar documentação de endpoints
        
        **Descrição:**
        
        Registrar todos os endpoints presentes no projeto.
        

---

## DevOps / Infraestrutura

### Objetivo da área

Garantir que o ambiente continue funcionando para todos os perfis e cenários finais de teste.

- Tarefas
    - Tarefa 1 — Atualizar variáveis de ambiente
        
        **Possíveis variáveis:**
        
        ```
        JWT_SECRET_KEY
        DATABASE_URL
        UPLOAD_DIR
        MAX_UPLOAD_SIZE
        NEXT_PUBLIC_API_URL
        DEFAULT_ADMIN_EMAIL
        DEFAULT_ADMIN_PASSWORD
        DEFAULT_ADMIN_PIN
        ```
        
        **Critérios de aceite:**
        
        - [ ]  `.env.example` atualizado.
        - [ ]  README/MkDocs explica as variáveis.
        - [ ]  Ambiente roda com Docker.
        - [ ]  Seed do administrador funciona corretamente.
    - Tarefa 2 — Validar Docker com funcionalidades finais
        
        **Critérios de aceite:**
        
        - [ ]  Backend sobe.
        - [ ]  Frontend sobe.
        - [ ]  Banco sobe.
        - [ ]  Upload de imagem funciona.
        - [ ]  Login por perfil funciona.
        - [ ]  Admin com PIN funciona.
        - [ ]  Seeds finais são carregadas corretamente.

---

# Definition of Done da Sprint 6

A Sprint 6 será considerada concluída quando:

- [ ]  Abas diferentes mantêm sessões independentes.
- [ ]  Refresh em uma aba não altera a sessão da outra.
- [ ]  Gerente recebe sugestão de técnico.
- [ ]  Sugestão considera área de manutenção.
- [ ]  Sugestão considera carga de trabalho.
- [ ]  Gerente pode aceitar ou ignorar sugestão.
- [ ]  Página de administrador é acessível após login.
- [ ]  Admin precisa validar PIN.
- [ ]  Admin consegue criar gerente.
- [ ]  Admin consegue editar contas.
- [ ]  Admin consegue desativar ou excluir contas.
- [ ]  Usuários não-admin não acessam área administrativa.
- [ ]  Painel do gerente possui indicadores básicos.
- [ ]  Telas principais estão visualmente padronizadas.
- [ ]  QA testou os novos fluxos.
- [ ]  MkDocs foi atualizado com sessão, sugestão de técnico e admin.
- [ ]  Ambiente local continua funcionando.