# Documentação - Regra de Cadastro por Perfil

Esta documentação descreve a regra oficial de cadastro de usuários por perfil no sistema Keep UnB.

## Objetivo

Registrar o comportamento esperado do sistema durante o cadastro de usuários, explicando quais perfis podem ser cadastrados publicamente, quais precisam de aprovação e como os status de aprovação são utilizados.

## Perfis de usuário

O sistema possui os seguintes perfis de usuário:

- `SOLICITANTE`
- `TECNICO`
- `GERENTE`
- `ADMIN`

Cada perfil possui uma regra específica de cadastro e acesso ao sistema.

## Cadastro de solicitante

Usuários com perfil `SOLICITANTE` podem realizar cadastro público no sistema.

Após o cadastro, o solicitante tem o acesso liberado, pois esse perfil não precisa passar por aprovação de um gerente para utilizar as funcionalidades disponíveis ao solicitante.

## Cadastro de técnico

Usuários com perfil `TECNICO` podem realizar cadastro público no sistema.

No entanto, após o cadastro, o técnico não recebe acesso imediato à área técnica. O cadastro fica aguardando aprovação de um gerente.

Enquanto o técnico estiver com status `PENDENTE`, o sistema não libera token de acesso para esse usuário.

Quando o cadastro for aprovado, o técnico passa a ter acesso às funcionalidades permitidas para o perfil técnico.

## Cadastro de gerente

Usuários com perfil `GERENTE` não devem ser cadastrados publicamente.

Esse tipo de usuário deve ser criado ou inserido no sistema por um administrador, pois possui permissões mais elevadas, incluindo a responsabilidade de aprovar ou reprovar cadastros de técnicos.

## Perfil administrador

Usuários com perfil `ADMIN` possuem permissões administrativas no sistema.

Esse perfil é responsável por operações administrativas, como a criação ou gerenciamento de usuários com permissões elevadas.

## Status de aprovação

O sistema utiliza status de aprovação para controlar o acesso de usuários que dependem de validação antes de acessar determinadas áreas.

Os status implementados são:

- `PENDENTE`
- `APROVADO`
- `REPROVADO`

### PENDENTE

Indica que o cadastro foi realizado, mas ainda aguarda avaliação.

Esse status é utilizado principalmente para técnicos recém-cadastrados que ainda precisam ser aprovados por um gerente.

Enquanto estiver `PENDENTE`, o técnico não recebe token de acesso.

### APROVADO

Indica que o cadastro foi aprovado.

Usuários com status `APROVADO` podem acessar o sistema de acordo com as permissões do seu perfil.

### REPROVADO

Indica que o cadastro foi reprovado.

Usuários com status `REPROVADO` não devem ter acesso liberado às funcionalidades restritas do sistema.

## Resumo da regra

- Solicitantes podem se cadastrar publicamente.
- Solicitantes têm acesso liberado após o cadastro.
- Técnicos podem se cadastrar publicamente.
- Técnicos ficam com status `PENDENTE` até aprovação de um gerente.
- Técnicos pendentes não recebem token de acesso.
- Gerentes não se cadastram publicamente.
- Gerentes são criados ou inseridos no sistema por um administrador.
- Os status de aprovação utilizados são `PENDENTE`, `APROVADO` e `REPROVADO`.

## Validação da documentação

A documentação foi construída com base na implementação existente no backend, considerando:

- Os perfis definidos no enum `UserRole`.
- Os status definidos no enum `ApprovalStatus`.
- A regra de bloqueio de acesso para usuários com status `PENDENTE`.
- O comportamento esperado para cadastro público de solicitantes e técnicos.
- A regra de criação de gerentes por administrador.

## Critérios de aceite atendidos

- [x] Documento explica cadastro de solicitante.
- [x] Documento explica cadastro de técnico com aprovação.
- [x] Documento explica que gerente é criado pelo administrador.
- [x] Documento explica os status `PENDENTE`, `APROVADO` e `REPROVADO`.