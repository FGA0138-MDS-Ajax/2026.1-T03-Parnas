# Sprint 5


## 1. Contexto da Sprint 

A Sprint 5 do projeto KeepUnB tem como foco o refinamento do MVP desenvolvido nas sprints anteriores, evoluindo o sistema para uma versão mais estável, segura e consistente.

Após a implementação do fluxo principal de chamados na Sprint 4, esta etapa busca aprimorar a qualidade do sistema, corrigindo problemas de segurança, melhorando a experiência do usuário e padronizando a interface entre as páginas.

Além disso, a sprint introduz melhorias funcionais importantes, como o upload de imagens nos chamados e a evolução do processo de cadastro de usuários baseado em perfis, tornando o sistema mais próximo de um ambiente real de produção.

Outro ponto central da sprint é o fortalecimento da documentação técnica no MkDocs, garantindo maior organização e alinhamento com o estado atual do sistema.



## 2. Objetivo da Sprint

A Sprint 5 tem como objetivo refinar o MVP do KeepUnB, corrigindo problemas de segurança, melhorando a visualização dos chamados, adicionando foto na criação de chamados, padronizando o visual entre páginas, detalhando a documentação técnica no MkDocs e implementando o cadastro por perfil. O cadastro público será permitido apenas para solicitantes e técnicos. Solicitantes terão acesso liberado após o cadastro, enquanto técnicos precisarão de aprovação de um gerente. Usuários com perfil de gerente serão inseridos no sistema pelo administrador.


## 3.Regra de Visualização de Chamados para Solicitantes

#### Objetivo

Permitir que usuários com perfil de solicitante acompanhem seus próprios chamados e também visualizem chamados em aberto criados por outros usuários, respeitando as regras de privacidade e proteção de dados.

#### Chamados criados por mim

O solicitante pode visualizar todos os chamados criados por ele, independentemente do status.

Para esses chamados, todas as informações relacionadas ao registro podem ser exibidas, incluindo:

* Número do chamado;
* Data de abertura;
* Local;
* Tipo de manutenção;
* Descrição completa;
* Status;
* Histórico de movimentações;
* Dados do próprio solicitante.

#### Chamados em aberto criados por outras pessoas

O solicitante também pode visualizar chamados que estejam com status de aberto e que tenham sido criados por outros usuários.

O objetivo dessa visualização é permitir o acompanhamento das demandas já registradas, evitando solicitações duplicadas para o mesmo problema.

#### Dados que podem ser exibidos

Para chamados criados por terceiros, podem ser exibidas apenas informações necessárias para identificação da demanda:

* Número do chamado;
* Local;
* Tipo de manutenção;
* Descrição resumida;
* Status;
* Data de abertura.

#### Dados que devem permanecer ocultos

Não devem ser exibidos dados que permitam identificar ou acessar informações do solicitante original, incluindo:

* Nome do solicitante;
* Matrícula;
* E-mail;
* Telefone;
* Histórico detalhado de interações;
* Anexos privados;
* Qualquer outra informação considerada sensível ou pessoal.

#### Regras Gerais

* O solicitante visualiza integralmente apenas os chamados criados por ele.
* Chamados criados por terceiros devem respeitar as regras de anonimização e privacidade.
* Apenas chamados em aberto criados por outros usuários podem ser exibidos.
* Informações sensíveis de terceiros nunca devem ser disponibilizadas.




## 4.Regras de Controle de Acesso

O sistema deve aplicar controle de acesso baseado em perfis tanto no frontend quanto no backend.

Cada usuário pode acessar apenas páginas, funcionalidades e recursos compatíveis com seu perfil.

#### Restrições por perfil

* Solicitantes não podem acessar funcionalidades exclusivas de Técnicos.
* Solicitantes não podem acessar funcionalidades exclusivas de Gerentes.
* Técnicos não podem acessar funcionalidades exclusivas de Gerentes.
* Gerentes não podem executar ações exclusivas de Administradores.
* Administradores possuem acesso às funcionalidades administrativas do sistema.

#### Proteção de páginas e rotas

Todas as páginas e rotas da aplicação devem validar o perfil do usuário autenticado antes de permitir o acesso.

Não é permitido obter acesso a funcionalidades restritas apenas alterando a URL da aplicação.

#### Códigos de retorno

**401 Unauthorized**

Retornado quando o usuário não está autenticado.

Exemplos:

* Sessão expirada;
* Token inválido;
* Usuário não realizou login.

**403 Forbidden**

Retornado quando o usuário está autenticado, mas não possui permissão para acessar o recurso solicitado.

Exemplos:

* Solicitante tentando acessar área de Gerente;
* Técnico tentando executar ação administrativa.


## 5.Upload de Imagem em Chamados

#### Objetivo

Permitir que o solicitante anexe uma imagem ao abrir um chamado de manutenção, auxiliando na identificação e análise do problema reportado.

#### Inclusão de Foto

O sistema disponibiliza um campo para anexar uma foto durante a criação do chamado.

O envio da imagem ocorre juntamente com as demais informações do chamado, como local, categoria e descrição do problema.

#### Obrigatoriedade

O envio da foto é opcional.

O solicitante pode criar um chamado mesmo sem anexar uma imagem.

#### Formatos Aceitos

Por questões de segurança e compatibilidade, o sistema aceita apenas os seguintes formatos de imagem:

* JPG (`.jpg`)
* JPEG (`.jpeg`)
* PNG (`.png`)

Arquivos em formatos diferentes devem ser rejeitados pelo sistema.

#### Tamanho Máximo

O sistema realiza validação do tamanho máximo permitido para arquivos enviados.

O limite é definido pela configuração do backend.

#### Armazenamento

Quando uma imagem é enviada com sucesso, o sistema registra o caminho ou URL do arquivo junto aos dados do chamado.

#### Exibição da Imagem

A imagem anexada fica associada ao chamado e pode ser visualizada posteriormente na tela de detalhes da solicitação.

Essa visualização permite que técnicos, gerentes e demais usuários autorizados consultem a imagem para auxiliar no atendimento da demanda.

#### Regras Gerais

* A foto pode ser adicionada apenas durante a criação do chamado.
* O envio da imagem é opcional.
* Apenas formatos JPG, JPEG e PNG são aceitos.
* O sistema valida o tipo e o tamanho do arquivo enviado.
* A imagem fica vinculada ao chamado e pode ser exibida em sua visualização detalhada.

## 6.Regra de cadastro por perfil

#### Objetivo

Garantir que os cadastros sejam feitos de forma correta e que perfis que tenham grande impacto no funcionamento da manutenção não possam ser criados por qualquer pessoa casualmente. 

#### Como será feito
O sistema permitirá cadastro público apenas para solicitantes e técnicos, que deverão preencher seus dados como: nome, senha, matricula. 

#### Para solicitantes
Usuários que fizerem o cadastro como solicitantes terão acesso liberado logo após o cadastro, podendo criar chamados instantâneamente. 

#### Para técnicos
Os usuários que desejarem se cadastrar como técnicos poderão realizar o preenchimento do formulário, mas precisarão de aprovação de um gerente antes de poder acessar a área técnica. Enquanto o usuário que deseja se cadastrar como técnico estiver sendo avaliado, ele receberá a mensagem de aprovação pendente, caso seja aceito ou recusado receberá o alerta de aprovação concluída ou rejeitada. 

#### Para gerentes
Usuários com perfil de gerente não poderão se cadastrar publicamente, estes serão inseridos no sistema diretamente pelo administrador.

## 7. Ata de reunião 

**Data:** 08/06/2026  
**Horário:** 20:00 - 20:20  
**Local:** Discord  
**Participantes:** @felipemso, @carloshfgit, @arthur-mariani,  @prietum, @Dandot1, @Guilhermesouza21, @CharlesRuan-MAP.  

**Objetivo:**  
Discutir a Sprint 5, alinhar as atividades da equipe, revisar o andamento do MVP e definir melhorias para o sistema e sua documentação.

**Discussões e Decisões:**  
- Foi discutida a necessidade de refinamento do MVP para garantir maior estabilidade e consolidação das funcionalidades principais.  
- Foram propostas melhorias de segurança no sistema, visando prevenir falhas e aumentar a confiabilidade das operações.  
- Foi discutida a implementação de upload de fotos nos chamados para auxiliar no registro e detalhamento das ocorrências.  
- Foram propostas melhorias no cadastro de usuários e ajustes nas funcionalidades relacionadas.  
- Foi decidido realizar ajustes na interface do sistema (UI), buscando melhorar a usabilidade e a experiência dos usuários.  
- Foi discutido o planejamento da apresentação do projeto, incluindo a organização dos tópicos e a preparação da demonstração do sistema.  
- Foi decidido revisar a documentação no MkDocs para garantir consistência com o estado atual do projeto.  
- Houve alinhamento das responsabilidades e distribuição das atividades entre os integrantes da equipe.  
