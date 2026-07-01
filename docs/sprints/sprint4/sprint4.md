# Sprint 4

## 1. Contexto da Sprint

A **Sprint 4** do projeto **KeepUnB** teve como foco consolidar as funcionalidades principais do sistema e transformar as definições das sprints anteriores em um produto funcional.

Após a definição do problema, do produto, da visão e da arquitetura do sistema, a equipe passou a trabalhar na construção do **MVP (Produto Mínimo Viável)**. O objetivo foi entregar uma versão inicial do KeepUnB que já representasse o fluxo central da aplicação e permitisse validar a proposta do sistema.

Nessa sprint, o foco principal foi integrar as partes essenciais do projeto, conectando frontend, backend e banco de dados para permitir o funcionamento básico do sistema de chamados.

---

## 2. Objetivo da Sprint

O objetivo da Sprint 4 foi desenvolver o **MVP do KeepUnB**, contendo as funcionalidades mínimas necessárias para demonstrar o funcionamento principal do produto.

O MVP foi pensado para permitir que os usuários realizassem o fluxo básico de manutenção:

```text
Solicitante abre chamado → Gerente atribui técnico → Técnico atualiza status
```

Esse fluxo representa a base do KeepUnB e mostra como o sistema pode organizar o processo de manutenção dentro do ambiente universitário.

---

## 3. Funcionalidades desenvolvidas no MVP

Durante a Sprint 4, foram priorizadas as funcionalidades essenciais para que o sistema pudesse ser utilizado em sua versão inicial.

As principais funcionalidades previstas para o MVP foram:

- Autenticação de usuários;
- Controle básico de níveis de acesso;
- Abertura de chamados de manutenção;
- Visualização de chamados por perfil de usuário;
- Registro de informações como local, tipo de manutenção e descrição do problema;
- Atribuição de técnicos disponíveis pelo gerente;
- Atualização do status do chamado pelo técnico;
- Integração entre telas do frontend e rotas do backend;
- Persistência das informações no banco de dados;
- Validação do fluxo principal do sistema.

Essas funcionalidades foram escolhidas por representarem o núcleo do produto e permitirem que o KeepUnB fosse testado como uma solução funcional.

---

## 4. Integração entre as partes do sistema

Um dos principais pontos da Sprint 4 foi a integração entre as camadas do projeto.

O frontend ficou responsável por apresentar as telas e permitir a interação dos usuários com o sistema. O backend ficou responsável pelas regras de negócio, rotas da API e validações. O banco de dados ficou responsável por armazenar as informações de usuários, chamados e demais entidades necessárias.

A integração seguiu a comunicação por API REST, permitindo que as telas consumissem os dados fornecidos pelo backend.

Essa etapa foi importante para transformar as partes isoladas do projeto em um sistema funcional.

---

## 5. Perfis contemplados

O MVP considerou os principais perfis definidos para o KeepUnB:

- **Solicitante:** pode criar chamados informando local, tipo de manutenção e descrição do problema;
- **Gerente:** pode visualizar chamados e atribuir técnicos disponíveis;
- **Técnico:** pode visualizar os chamados atribuídos a ele e atualizar o andamento da manutenção;
- **Administrador:** pode apoiar o controle de usuários e níveis de acesso.

A separação por perfis foi essencial para garantir que cada usuário tivesse acesso apenas às funcionalidades relacionadas às suas responsabilidades.

---

## 6. Validação do fluxo principal

Durante a Sprint 4, a equipe buscou validar o funcionamento do fluxo principal do KeepUnB.

O fluxo validado foi:

```text
1. O solicitante cria um chamado de manutenção;
2. O gerente visualiza o chamado aberto;
3. O gerente atribui um técnico disponível;
4. O técnico acessa o chamado atribuído;
5. O técnico atualiza o status da manutenção;
6. O chamado pode ser acompanhado dentro do sistema.
```

Esse processo representa o funcionamento mínimo necessário para que o produto cumpra sua proposta inicial.

---

## 7. Produto final da Sprint

O produto final da Sprint 4 foi o **MVP do KeepUnB**.

Esse MVP representa a primeira versão funcional do sistema, contendo as funcionalidades básicas necessárias para demonstrar a solução proposta.

O MVP não tem como objetivo entregar todas as funcionalidades futuras do sistema, como relatórios completos, métricas avançadas ou automações complexas. Seu foco é validar o fluxo principal de chamados e permitir que a equipe tenha uma base funcional para evoluir o produto nas próximas sprints.

---

## 8. Resultados esperados

Ao final da Sprint 4, espera-se que o KeepUnB possua uma versão mínima funcional, permitindo:

- Login e acesso de usuários ao sistema;
- Criação de chamados de manutenção;
- Visualização dos chamados pelos perfis corretos;
- Atribuição de técnicos pelo gerente;
- Atualização do andamento dos chamados pelo técnico;
- Comunicação entre frontend, backend e banco de dados;
- Validação prática do fluxo principal do produto.

Esses resultados permitem que o projeto deixe de ser apenas uma estrutura planejada e passe a ter uma versão inicial utilizável.

---

## 9. Conclusão

A Sprint 4 foi uma etapa fundamental para o KeepUnB, pois teve como foco transformar o planejamento do produto em uma versão funcional.

Com o desenvolvimento do MVP, a equipe conseguiu concentrar esforços nas funcionalidades essenciais do sistema, garantindo que o fluxo principal de abertura, atribuição e acompanhamento de chamados pudesse ser demonstrado.

Dessa forma, a Sprint 4 representa a consolidação inicial do KeepUnB como produto, entregando uma base funcional que poderá ser aprimorada nas próximas etapas do projeto.


## 4. Ata de reunião 

**Data:** 04/06/2026    
**Horário:** 20:00 - 21:00  
**Local:** Discord  
**Participantes:** @felipemso, @carloshfgit, @vellloso, @caioNapoles, @Danielfelipe08, @prietum,  @arthurrcoelho, @Dandot1, @Guilhermesouza21, @CharlesRuan-MAP.

**Objetivo:**   
Discutir sobre a sprint 4, realizar análises em relação à sprint anterior, alinhar responsabilidades da equipe, discutir melhorias no fluxo de trabalho e esclarecer dúvidas relacionadas ao desenvolvimento do projeto.

**Discussões e Decisões:**       
- Foi discutida a baixa participação de alguns membros nas atividades do projeto reforçando a importância do comprometimento da equipe.  
- Foi apresentada a proposta de criação de um gráfico Burndown para acompanhamento do progresso da sprint.  
- Foram realizadas atualizações sobre a configuração e execução do ambiente de desenvolvimento.  
- Foram esclarecidas dúvidas dos integrantes relacionadas ao ambiente e às atividades em andamento.  
- Houve distribuição de tarefas entre os membros da equipe.

---

## Métricas da Sprint

Esta seção apresenta os resultados das métricas de processo, qualidade e testes coletados para a Sprint 4:

| Métrica | Valor Obtido | Valor Esperado |
| :--- | :---: | :---: |
| **Taxa de Conclusão da Sprint** | 91.67% | 90% - 100% |
| **Taxa de Resolução de Defeitos** | 100.00% | ≥ 80% (não críticos) |
| **Cobertura de Código** | 80.50% | ≥ 80% |

### Detalhes das Métricas:
- **Issues Planejadas (24):** #57, #58, #59, #68, #69, #71, #74, #75, #76, #77, #78, #81, #82, #83, #84, #85, #86, #87, #88, #90, #91, #92, #93, #98
- **Issues Concluídas (22):** #57, #58, #59, #68, #69, #71, #74, #75, #76, #77, #78, #81, #82, #83, #84, #85, #86, #88, #90, #91, #92, #98
- **Bugs/Erros Reportados:** 1
- **Bugs/Erros Corrigidos:** 1
- **Cobertura de Testes (FastAPI backend):** 80.50% (Total de 32 testes automatizados)
