# Resumo do Documento de Arquitetura - KeepUnB

## Visão Geral

A arquitetura do KeepUnB foi projetada para oferecer modularidade, manutenção simplificada e separação clara de responsabilidades entre os componentes do sistema.

O sistema é dividido em frontend, backend e banco de dados, comunicando-se por meio de uma API REST.

---

## Estrutura Geral

A solução é composta por três componentes principais:

### Frontend

Responsável pela interface do usuário e interação com o sistema.

Principais responsabilidades:

* Exibição das funcionalidades do sistema;
* Envio e consulta de informações;
* Comunicação com a API do backend.

### Backend

Responsável pelo processamento das regras de negócio e controle das operações do sistema.

Principais responsabilidades:

* Autenticação e autorização;
* Gerenciamento de usuários;
* Gerenciamento de chamados;
* Controle das permissões dos perfis.

### Banco de Dados

Responsável pelo armazenamento persistente das informações do sistema.

Principais responsabilidades:

* Armazenar usuários;
* Armazenar chamados;
* Garantir integridade e consistência dos dados.

---

## Padrão Arquitetural

O backend segue uma arquitetura baseada na separação de responsabilidades.

As funcionalidades são organizadas em camadas:

### Model

Representa as entidades do sistema e o mapeamento das tabelas do banco de dados.

Exemplos:

* Usuário
* Chamado

### Repository

Responsável pelo acesso aos dados e execução das consultas ao banco.

### Service

Contém as regras de negócio da aplicação.

### Router

Disponibiliza os endpoints da API e recebe as requisições dos usuários.

---

## Fluxo de Comunicação

O funcionamento do sistema segue o seguinte fluxo:

1. O usuário realiza uma ação na interface.
2. O frontend envia uma requisição para a API.
3. O backend processa a solicitação.
4. As regras de negócio são executadas.
5. Os dados são consultados ou atualizados no banco.
6. A resposta retorna ao frontend.
7. O resultado é apresentado ao usuário.

---

## Segurança

O sistema utiliza autenticação baseada em JWT para controle de acesso.

Cada usuário possui um perfil específico:

* Solicitante
* Técnico
* Gerente
* Administrador

As permissões são verificadas antes da execução das operações protegidas.

---

## Benefícios da Arquitetura

* Separação de responsabilidades;
* Facilidade de manutenção;
* Escalabilidade da aplicação;
* Reutilização de componentes;
* Maior organização do código;
* Facilidade para implementação de novas funcionalidades.



## Documentos do Projeto

- [Documento de Arquitetura](arq_parnas.pdf)