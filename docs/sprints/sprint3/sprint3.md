# Sprint 3

Este documento reúne o fluxo principal do sistema e as permissões dos perfis
definidos para a Sprint 3 do KeepUnB.

## 1. Fluxo principal do sistema

### Objetivo do fluxo

Descrever o funcionamento principal do sistema de gerenciamento de manutenção
da plataforma KeepUnB durante a Sprint 3.

### Perfis envolvidos

| Perfil | Responsabilidade |
|---|---|
| Solicitante | Registrar chamados de manutenção e acompanhar solicitações |
| Gerente | Monitorar chamados abertos e atribuir técnicos |
| Técnico | Executar a manutenção e atualizar o andamento do chamado |

### Fluxo funcional principal

#### 1. Abertura do chamado - Solicitante

O solicitante acessa o sistema KeepUnB e registra um novo chamado de
manutenção.

**Informações obrigatórias**

- Local da manutenção
- Tipo/categoria da manutenção
- Descrição do problema

**Resultado**

O sistema cria o chamado com status inicial:

`Aberto`

#### 2. Visualização de chamados - Gerente

O gerente acessa o painel administrativo e visualiza os chamados aguardando
atendimento.

**Ações do gerente**

- Consultar chamados abertos
- Verificar detalhes da solicitação
- Avaliar prioridade da manutenção

#### 3. Atribuição de técnico - Gerente

Após analisar o chamado, o gerente seleciona um técnico disponível.

**Ações do gerente**

- Escolher técnico responsável
- Delegar o chamado

**Resultado**

O chamado passa para o status:

`Atribuído`

#### 4. Visualização da fila - Técnico

O técnico acessa o sistema e visualiza os chamados atribuídos.

**Informações exibidas**

- Local do problema
- Tipo de manutenção
- Descrição do chamado
- Prioridade/status

#### 5. Atualização da manutenção - Técnico

Durante a execução do serviço, o técnico atualiza o andamento da manutenção.

**Possíveis atualizações**

- Início da manutenção
- Manutenção em execução
- Finalização do serviço

### Status possíveis do chamado

| Status | Descrição |
|---|---|
| Aberto | Chamado criado pelo solicitante |
| Atribuído | Chamado encaminhado para um técnico |
| Em andamento | Técnico iniciou a manutenção |
| Concluído | Manutenção finalizada pelo técnico |
| Finalizado | Chamado encerrado no sistema |

### Resumo do fluxo

```text
Solicitante cria chamado
        ↓
Status: Aberto
        ↓
Gerente visualiza chamados
        ↓
Gerente atribui técnico
        ↓
Status: Atribuído
        ↓
Técnico visualiza chamados atribuídos
        ↓
Técnico inicia manutenção
        ↓
Status: Em andamento
        ↓
Técnico conclui manutenção
        ↓
Status: Concluído / Finalizado
```

## 2. Permissões dos perfis

### Objetivo

Descrever as permissões e responsabilidades dos perfis do sistema KeepUnB
durante a Sprint 3.

### Perfis do sistema

O sistema KeepUnB possui quatro perfis principais de usuário:

- Solicitante
- Gerente
- Técnico
- Administrador

### Permissões por perfil

#### Solicitante

O perfil Solicitante representa membros da comunidade acadêmica responsáveis
pela abertura de chamados de manutenção.

**Permissões**

- Criar solicitações de manutenção
- Informar local, categoria e descrição do problema
- Visualizar seus próprios chamados
- Acompanhar andamento das solicitações
- Avaliar atendimento realizado *(funcionalidade prevista)*

#### Gerente

O perfil Gerente é responsável pela supervisão operacional das solicitações de
manutenção.

**Permissões**

- Visualizar chamados abertos
- Consultar detalhes das solicitações
- Organizar fila de atendimento
- Delegar chamados para técnicos
- Monitorar andamento das manutenções
- Visualizar métricas e relatórios *(parcialmente previsto para versões futuras)*

#### Técnico

O perfil Técnico representa os responsáveis pela execução das manutenções.

**Permissões**

- Visualizar chamados atribuídos
- Consultar informações do chamado
- Atualizar status da manutenção
- Informar andamento do serviço
- Finalizar chamados atendidos

#### Administrador

O perfil Administrador é responsável pela gestão técnica e administrativa do
sistema.

**Permissões**

- Gerenciar contas de usuários
- Definir permissões de acesso
- Administrar perfis do sistema
- Configurar parâmetros da plataforma *(funcionalidade parcial/futura)*
- Realizar manutenção administrativa do sistema *(previsto)*

### Observações

Algumas permissões descritas representam funcionalidades planejadas no
documento de visão e podem ser implementadas de forma incremental ao longo das
próximas sprints.

## 3. Ata de reunião

**Data:** 21/05/2026    
**Horário:** 20:00 - 21:00  
**Local:** Discord  
**Participantes:** @felipemso, @arthur-mariani, @carloshfgit, @vellloso, @caioNapoles, @Danielfelipe08, @prietum, @RodrigoCBarbosa, @arthurrcoelho, @Dandot1, @Guilhermesouza21, @CharlesRuan-MAP.

**Objetivo:**   
Discutir sobre a sprint 3, realizar análises em relação à sprint anterior e definir/delegar tasks aos seus respectivos responsáveis.

**Discussões e Decisões:**       
- Houve mudanças na comunicação via Whatsapp, foi criada uma comunidade, dividida em frontend, backend e database, centralizada por um grupo geral.  
- Foi apresentado o modelo de produção em equipe via GitHub.  
- Foram definidas políticas de issues, branches e commits.

---

## Métricas da Sprint

Esta seção apresenta os resultados das métricas de processo, qualidade e testes coletados para a Sprint 3:

| Métrica | Valor Obtido | Valor Esperado |
| :--- | :---: | :---: |
| **Taxa de Conclusão da Sprint** | 64.00% | 90% - 100% |
| **Taxa de Resolução de Defeitos** | 100.00% | ≥ 80% (não críticos) |
| **Cobertura de Código** | N/A | ≥ 80% |

### Detalhes das Métricas:
- **Issues Planejadas (25):** #5, #6, #8, #9, #10, #12, #16, #18, #19, #20, #21, #22, #27, #28, #29, #30, #38, #40, #41, #43, #45, #46, #47, #49, #55
- **Issues Concluídas no Prazo (16):** #6, #8, #9, #10, #12, #18, #19, #20, #21, #22, #27, #28, #29, #30, #40, #41
- **Com Atraso (9):** #5, #16, #38, #43, #45, #46, #47, #49, #55
*Nota: Todas as issues planejadas foram eventualmente concluídas ao longo do projeto.*
- **Bugs/Erros Reportados:** 0
- **Bugs/Erros Corrigidos:** 0
- **Cobertura de Testes (FastAPI backend):** N/A (Total de 0 testes automatizados)
