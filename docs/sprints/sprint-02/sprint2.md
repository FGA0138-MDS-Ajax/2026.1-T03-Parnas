# Sprint 2

## 1. Contexto da Sprint

A **Sprint 2** do projeto **KeepUnB** teve como foco principal definir a arquitetura do sistema e as ferramentas que seriam utilizadas para tornar o produto funcional.

Após a definição do produto e a elaboração do Documento de Visão na Sprint 1, a equipe avançou para uma etapa mais técnica, buscando entender como o sistema seria estruturado, quais tecnologias seriam utilizadas e como os principais componentes da aplicação se comunicariam.

Nessa sprint, o objetivo foi organizar a base arquitetural do projeto, garantindo que o desenvolvimento pudesse seguir um padrão claro, compreensível e adequado às necessidades do sistema.

---

## 2. Definição da Arquitetura do Projeto

Durante a Sprint 2, foi elaborado o **Documento de Arquitetura** do KeepUnB.

Esse documento foi criado para registrar as principais decisões técnicas do projeto, explicando como o sistema seria organizado e quais padrões seriam adotados no desenvolvimento.

A arquitetura definida separa o sistema em camadas e responsabilidades, permitindo melhor organização do código e facilitando a manutenção futura da aplicação.

O KeepUnB foi pensado como uma aplicação web composta por:

- **Frontend:** responsável pela interface visual e pela interação com os usuários;
- **Backend:** responsável pelas regras de negócio, autenticação, rotas e comunicação com o banco de dados;
- **Banco de Dados:** responsável pelo armazenamento das informações do sistema;
- **Documentação:** responsável por registrar decisões, guias e informações importantes do projeto.

Essa organização permite que cada parte do sistema tenha uma função bem definida e que a equipe consiga trabalhar de forma mais organizada.

---

## 3. Documento de Arquitetura

A elaboração do **Documento de Arquitetura** foi uma das principais entregas da Sprint 2.

Nesse documento, foram definidos pontos importantes como:

- A estrutura geral do sistema;
- As camadas da aplicação;
- A comunicação entre frontend, backend e banco de dados;
- As tecnologias escolhidas;
- A organização do backend;
- A forma de implantação local do projeto;
- As responsabilidades de cada parte da aplicação;
- As decisões arquiteturais iniciais.

O documento serviu como uma referência técnica para a equipe, ajudando a manter o desenvolvimento alinhado e evitando decisões isoladas ou despadronizadas.

---

## 4. Ferramentas e Tecnologias Utilizadas

Na Sprint 2, também foram definidas as principais ferramentas e tecnologias utilizadas no projeto.

### Backend

Para o backend, foi definido o uso de **Python** com **FastAPI**.

O FastAPI foi escolhido por permitir a criação de APIs de forma rápida, organizada e com suporte automático à documentação das rotas por meio do Swagger.

Também foram consideradas ferramentas e bibliotecas relacionadas à organização do backend, como:

- **Python 3.12+**;
- **FastAPI**;
- **Uvicorn**;
- **SQLAlchemy**;
- **Pydantic**;
- **Swagger**, para visualização e teste das rotas da API.

### Frontend

Para o frontend, foi definida uma estrutura baseada em tecnologias modernas para desenvolvimento web.

O objetivo é permitir a criação de telas organizadas, responsivas e adequadas para os diferentes perfis de usuário do sistema.

As principais ferramentas utilizadas foram:

- **Node.js 20+**;
- **React**;
- **Next.js**;
- **TypeScript**;
- **CSS/Tailwind**, para estilização da interface.

### Banco de Dados

O banco de dados foi pensado para armazenar as principais informações do sistema, como usuários, chamados, técnicos, locais, tipos de manutenção e status das solicitações.

A estrutura do banco deve se relacionar com os models definidos no backend, garantindo consistência entre o código e os dados armazenados.

Ferramentas relacionadas:

- **Banco de dados relacional**;
- **SQLAlchemy**, para mapeamento entre classes Python e tabelas;
- **Migrations**, para controle das alterações na estrutura do banco.

### Ambiente e Execução

Para padronizar o ambiente de desenvolvimento, foi definido o uso de **Docker** e **Docker Compose**.

Essas ferramentas ajudam a evitar problemas de configuração entre diferentes computadores da equipe, permitindo que o projeto seja executado de forma mais previsível.

Ferramentas utilizadas:

- **Docker**;
- **Docker Compose**;
- Arquivos de ambiente `.env`;
- Configuração separada para frontend, backend e banco de dados.

### Documentação

A documentação do projeto foi pensada como parte essencial da organização da equipe.

Foi utilizado o **MkDocs Material** para estruturar a documentação do KeepUnB, incluindo guias, decisões técnicas, documentos da sprint e informações importantes do projeto.

Ferramentas utilizadas:

- **MkDocs**;
- **MkDocs Material**;
- Markdown;
- GitHub Pages, para publicação da documentação.

### Versionamento e Organização

Para o controle de versão e colaboração da equipe, foram utilizadas ferramentas de versionamento e organização do fluxo de trabalho.

Ferramentas utilizadas:

- **Git**;
- **GitHub**;
- Branches de desenvolvimento;
- Pull Requests;
- Issues;
- Organização por sprints.

---

## 5. Organização do Backend

Na Sprint 2, também foi definida a estrutura inicial do backend, separando responsabilidades em pastas específicas.

A organização pensada foi:

```text
app/
├── core/
├── models/
├── repositories/
├── routers/
├── schemas/
├── services/
└── utils/
```

Cada pasta possui uma responsabilidade dentro do sistema:

- **core:** configurações principais do projeto;
- **models:** representação das entidades do banco de dados;
- **repositories:** acesso e manipulação dos dados;
- **routers:** definição das rotas da API;
- **schemas:** validação e estrutura dos dados de entrada e saída;
- **services:** regras de negócio da aplicação;
- **utils:** funções auxiliares reutilizáveis.

Essa divisão ajuda a manter o código mais organizado, facilitando a manutenção e a evolução do sistema.

---

## 6. Visões Arquiteturais

O Documento de Arquitetura também organizou o projeto por meio de visões, facilitando a compreensão do sistema por diferentes perspectivas.

As principais visões consideradas foram:

- **Visão de uso:** apresenta o escopo do sistema e como os usuários interagem com ele;
- **Visão lógica:** mostra a organização em camadas e responsabilidades;
- **Visão estrutural:** apresenta os componentes principais do sistema e suas relações;
- **Visão de implantação:** descreve o ambiente em que o sistema será executado.

Essas visões ajudaram a equipe a compreender melhor o funcionamento geral do KeepUnB e a comunicar a arquitetura de forma mais clara.

---

## 7. Resultados da Sprint

Ao final da Sprint 2, a equipe conseguiu consolidar as principais decisões técnicas do projeto.

Os principais resultados foram:

- Elaboração do Documento de Arquitetura;
- Definição da estrutura geral do sistema;
- Escolha das tecnologias principais do projeto;
- Organização das camadas da aplicação;
- Definição da estrutura inicial do backend;
- Planejamento da comunicação entre frontend, backend e banco de dados;
- Padronização inicial do ambiente com Docker;
- Definição das ferramentas de documentação e versionamento.

Essas decisões deram mais segurança para o início da implementação prática do sistema nas próximas sprints.

---

## 8. Conclusão

A Sprint 2 foi essencial para transformar a visão do produto em uma estrutura técnica organizada.

Nessa etapa, a equipe definiu como o KeepUnB seria construído, quais ferramentas seriam utilizadas e como as partes do sistema se conectariam.

A elaboração do Documento de Arquitetura foi fundamental para registrar essas decisões e orientar o desenvolvimento do projeto, garantindo maior padronização, clareza e organização para a equipe.

Dessa forma, a Sprint 2 consolidou a base técnica necessária para que o KeepUnB pudesse avançar para a implementação de suas funcionalidades principais.

## 9. Ata de reunião

**Data:** 05/05/2026    
**Horário:** 14:00 - 16:00  
**Local:** FCTE - S10   
**Participantes:** @felipemso, @arthur-mariani, @carloshfgit, @vellloso, @caioNapoles, @Danielfelipe08, @prietum, @RodrigoCBarbosa. 

**Objetivo:**   
Realizar a delegação de tarefas para a produção do documento de arquitetura, estipular stack/ferramentas a serem utilizadas e realizar estudo de métodos e estruturas de software.

**Discussões e Decisões:**       
- Foram decididas as responsabilidades em relação à produção do documento de arquitetura.  
- Foram definidos conceitos-base do sistema e visões de uso.  
- Optou-se por seguir inicialmente uma arquitetura _Clean-Arc_ para o backend e _Feature-Based_ para o frontend.  