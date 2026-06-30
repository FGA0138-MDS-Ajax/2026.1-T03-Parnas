# Sprint 6

## 1. Contexto da Sprint

A Sprint 6 do projeto KeepUnB tem como foco a consolidação das funcionalidades essenciais do sistema, preparando o MVP para sua fase final de estabilização e entrega. Após os refinamentos realizados na Sprint 5, esta etapa busca fortalecer aspectos relacionados à segurança, gerenciamento de usuários e eficiência operacional.

Entre os principais avanços, destaca-se a implementação de mecanismos de autenticação mais robustos, incluindo a validação adicional por PIN para administradores, além da correção de problemas relacionados à manutenção de sessões em múltiplas abas do navegador. A sprint também introduz melhorias no fluxo de gerenciamento de chamados por meio da sugestão automática de técnicos, considerando critérios como área de atuação, aprovação, disponibilidade e carga de trabalho.

Além disso, será desenvolvida e padronizada a área administrativa do sistema, permitindo a gestão completa de contas e perfis de usuários. A sprint contempla ainda a consolidação das permissões por perfil, a padronização visual das interfaces, a implementação de indicadores básicos e a atualização contínua da documentação técnica, garantindo maior consistência e alinhamento com o estado atual do projeto.

## 2. Objetivo da Sprint

A Sprint 6 tem como objetivo concluir as funcionalidades centrais do KeepUnB, corrigindo problemas de sessão entre múltiplas abas e implementando a sugestão de técnicos com base em critérios como área de manutenção, aprovação, status ativo e carga de trabalho. Também busca desenvolver e padronizar a área administrativa do sistema, incluindo autenticação por login e PIN, além de funcionalidades para criação, edição, desativação e exclusão de contas. Complementarmente, a sprint visa consolidar indicadores básicos, permissões por perfil, padronização visual e documentação técnica, preparando o projeto para a Sprint 7, dedicada à estabilização e entrega final.


## 3.Sessões Independentes em Múltiplas Abas

### Objetivo

Permitir que cada aba do navegador mantenha sua própria sessão de autenticação, possibilitando a utilização simultânea de usuários diferentes sem interferência entre as abas.

### Armazenamento da Sessão

As informações de autenticação devem ser armazenadas utilizando `sessionStorage`.

Cada aba mantém seus próprios dados de sessão, incluindo:

* Token de autenticação;
* Perfil do usuário;
* Identificador do usuário;
* Nome do usuário.

### Token por Aba

Cada aba possui uma sessão independente.

O token utilizado para autenticação pertence exclusivamente à aba em que o login foi realizado.

Dessa forma, diferentes abas podem permanecer autenticadas com usuários distintos.

### Comportamento Após Refresh

Ao atualizar uma página, a sessão da aba deve ser preservada.

O usuário continua autenticado desde que os dados da sessão permaneçam válidos.

A atualização de uma aba não deve afetar as sessões das demais abas abertas.

### Logout por Aba

Ao realizar logout, apenas a sessão da aba atual deve ser encerrada.

As demais abas permanecem autenticadas com seus respectivos usuários.

### Proteção de Rotas

Todas as rotas protegidas continuam exigindo autenticação válida.

Quando não existir uma sessão autenticada:

* O acesso à rota protegida deve ser bloqueado;
* O usuário deve ser redirecionado para a página de login.

### Regras Gerais

* Cada aba mantém sua própria sessão.
* É permitido utilizar usuários diferentes em abas diferentes.
* O refresh afeta apenas a aba atual.
* O logout afeta apenas a aba atual.
* A proteção de rotas permanece ativa para todas as sessões.


## 4.Regra de Sugestão e Atribuição de Técnicos

### Objetivo

Definir o processo de sugestão automática de técnicos e o fluxo de atribuição de chamados pelo gerente, garantindo que a escolha do técnico seja baseada em critérios objetivos e na disponibilidade da equipe.

---

## Sugestão de Técnico

O sistema deve sugerir automaticamente o técnico mais adequado para um chamado com base nos seguintes critérios:

### Regras de elegibilidade

* O técnico deve estar ativo;
* O técnico deve estar aprovado;
* O técnico deve possuir perfil `TECNICO`;
* A área do técnico deve ser compatível com o tipo de manutenção do chamado;
* Técnicos com menor número de chamados ativos possuem prioridade.

### Restrições

O sistema não deve sugerir:

* Solicitantes;
* Gerentes;
* Administradores;
* Técnicos pendentes ou rejeitados.

---

## Fluxo de Atribuição de Técnico

Após a sugestão, o gerente pode definir o técnico responsável pelo chamado.

### Comportamento esperado

* O gerente pode aceitar o técnico sugerido;
* O gerente pode escolher outro técnico manualmente;
* Ao confirmar a atribuição, o campo `tecnico_id` é definido no chamado;
* O status do chamado é atualizado para `ATRIBUIDO`;
* A ação deve ser registrada no histórico do chamado.

### Permissões

* Apenas usuários com perfil `GERENTE` podem atribuir técnicos.

---

## Integração no Painel do Gerente

A sugestão de técnico deve ser exibida na interface de gerenciamento de chamados.

### Informações exibidas

* Técnico sugerido;
* Área de atuação;
* Quantidade de chamados ativos.

### Ações disponíveis

* Usar sugestão;
* Escolher outro técnico.

### Comportamento da interface

* Exibir confirmação após atribuição bem-sucedida;
* Exibir mensagem de erro caso não exista técnico compatível;
* Permitir alteração antes da confirmação final.

---

## API Relacionada

```http
GET /api/v1/tickets/{id}/suggest-technician
PATCH /api/v1/tickets/{id}/assign
```

---



## 5.Painel Administrativo

## Objetivo

Definir as regras de acesso e funcionalidades do painel administrativo do sistema, garantindo controle de usuários e segurança nas ações administrativas.

---

### Acesso pelo Login

O acesso ao painel administrativo é permitido apenas após autenticação no sistema.

Somente usuários com perfil `ADMIN` podem prosseguir para as funcionalidades administrativas.

---

## Validação por PIN

Após o login, o administrador deve realizar uma validação adicional por PIN antes de acessar o painel.

### Regras

- O PIN é obrigatório para acessar o painel administrativo;
- O PIN deve ser validado corretamente para liberar o acesso;
- Usuários não-admin não podem acessar a validação de PIN;
- Tentativas incorretas devem impedir o acesso.

---

## Criação de Gerentes

O administrador pode criar usuários com perfil de gerente.

### Regras

- Apenas o ADMIN pode criar gerentes;
- O novo usuário deve receber perfil `GERENTE`;
- O gerente criado passa a ter acesso às funcionalidades permitidas ao seu perfil.

---

## Edição de Contas

O administrador pode editar informações de usuários cadastrados.

### Regras

- Apenas ADMIN pode editar contas;
- Alterações devem ser refletidas imediatamente no sistema;
- Dados do usuário devem permanecer consistentes após atualização.

---

## Desativação e Exclusão de Contas

O administrador pode desativar ou excluir usuários do sistema.

### Regras

- Apenas ADMIN pode executar essas ações;
- Contas desativadas não podem acessar o sistema;
- Contas excluídas devem ser removidas do sistema ou marcadas como inativas, conforme regra do backend.

---

## Permissões do Administrador

O administrador possui acesso completo às funcionalidades de gestão do sistema.

### Permissões

- Criar gerentes;
- Editar usuários;
- Desativar contas;
- Excluir contas;
- Acessar o painel administrativo após login e validação por PIN.

### Restrições

- Usuários não-admin não possuem acesso às rotas administrativas;
- A validação por PIN é obrigatória para ações sensíveis.

## 6.Documentação de Endpoints da API

A API do sistema KeepUnB segue o prefixo padrão:

/api/v1

Todos os endpoints abaixo representam o estado atual do backend.

---

## Autenticação

| Método | Rota | Acesso | Função |
|--------|------|--------|--------|
| POST | /api/v1/auth/login | Público | Realiza login e retorna token JWT |
| POST | /api/v1/auth/register | Público | Registra usuários no sistema |

---

## Usuários

| Método | Rota | Acesso | Função |
|--------|------|--------|--------|
| GET | /api/v1/users/me | Usuário autenticado | Retorna dados do usuário logado |

---

## Chamados (Tickets)

| Método | Rota | Acesso | Função |
|--------|------|--------|--------|
| POST | /api/v1/tickets | Solicitante | Cria um novo chamado |
| GET | /api/v1/tickets | Gerente | Lista todos os chamados |
| GET | /api/v1/tickets/me | Solicitante | Lista chamados do usuário logado |
| GET | /api/v1/tickets/open | Gerente | Lista chamados abertos |
| GET | /api/v1/tickets/open/others | Solicitante | Lista chamados abertos de outros usuários |
| GET | /api/v1/tickets/in-progress | Gerente | Lista chamados em andamento |
| GET | /api/v1/tickets/public | Usuário autenticado | Lista chamados em formato público |
| GET | /api/v1/tickets/assigned-to-me | Técnico | Lista chamados atribuídos ao técnico logado |
| GET | /api/v1/tickets/{ticket_id} | Solicitante / Técnico / Gerente | Detalhes do chamado |
| PATCH | /api/v1/tickets/{ticket_id}/assign | Gerente | Atribui técnico ao chamado |
| PATCH | /api/v1/tickets/{ticket_id}/status | Técnico | Atualiza status do chamado |

---

## Técnicos

| Método | Rota | Acesso | Função |
|--------|------|--------|--------|
| GET | /api/v1/technicians/available | Gerente | Lista técnicos disponíveis |
| GET | /api/v1/technicians/pending | Gerente / Admin | Lista técnicos pendentes |
| PATCH | /api/v1/technicians/{id}/approve | Gerente / Admin | Aprova técnico |
| PATCH | /api/v1/technicians/{id}/reject | Gerente / Admin | Rejeita técnico |

---

## Comentários

| Método | Rota | Acesso | Função |
|--------|------|--------|--------|
| POST | /api/v1/comments | Solicitante | Cria comentário |
| GET | /api/v1/comments/me | Solicitante | Lista comentários do usuário |
| GET | /api/v1/comments/user | Solicitante | Lista comentários de um usuário |
| GET | /api/v1/comments/ticket | Solicitante | Lista comentários de um chamado |
| PATCH | /api/v1/comments/{id}/ocultar | Gerente / Admin | Oculta comentário |
| PATCH | /api/v1/comments/{id}/revelar | Gerente / Admin | Revela comentário oculto |

---

## Health Check

| Método | Rota | Acesso | Função |
|--------|------|--------|--------|
| GET | /api/v1/health | Público | Verifica status da API |

---

## Root

| Método | Rota | Acesso | Função |
|--------|------|--------|--------|
| GET | / | Público | Endpoint raiz da API |

---

## Observações

- Todos os endpoints seguem o prefixo `/api/v1`
- A autenticação é feita via JWT
- Endpoints administrativos dependem de permissões específicas
- Alguns endpoints podem variar conforme evolução do sistema
- Esta documentação deve ser mantida sincronizada com o Swagger (`/docs`)

## Ata de reunião

**Data:** 15/06/2026  
**Horário:** 19:30 - 20:00  
**Local:**  Discord  
**Participantes:**  @felipemso, @arthur-mariani, @carloshfgit, @vellloso, @caioNapoles, @Danielfelipe08, @prietum, @RodrigoCBarbosa, @arthurrcoelho, @Dandot1, @Guilhermesouza21, @CharlesRuan-MAP.  

**Objetivo:**  
Discutir a definição da sprint 6 com base em funcionalidades não adicionadas ainda.

**Discussões e Decisões:**  
-  Possibilitar que cada login possa ser feito em uma aba diferente.
-  Adicionar sugestão de técnico para o gerente quando houverem muitos técnicos disponíveis
-  Adicionar PIN de segurança extra para administradores.
-  Padronizar páginas que não estão 100% iguais.+

