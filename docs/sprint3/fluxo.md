# Fluxo Principal do Sistema — Sprint 3

## Objetivo do Fluxo

Descrever o funcionamento principal do sistema de gerenciamento de manutenção da plataforma KeepUnB durante a Sprint 3.

---

# Perfis Envolvidos

| Perfil | Responsabilidade |
|---|---|
| Solicitante | Registrar chamados de manutenção e acompanhar solicitações |
| Gerente | Monitorar chamados abertos e atribuir técnicos |
| Técnico | Executar a manutenção e atualizar o andamento do chamado |

---

# Fluxo Funcional Principal

## 1. Abertura do Chamado — Solicitante

O solicitante acessa o sistema KeepUnB e registra um novo chamado de manutenção.

### Informações obrigatórias

- Local da manutenção
- Tipo/categoria da manutenção
- Descrição do problema

### Resultado

O sistema cria o chamado com status inicial:

`Aberto`

---

## 2. Visualização de Chamados — Gerente

O gerente acessa o painel administrativo e visualiza os chamados aguardando atendimento.

### Ações do gerente

- Consultar chamados abertos
- Verificar detalhes da solicitação
- Avaliar prioridade da manutenção

---

## 3. Atribuição de Técnico — Gerente

Após analisar o chamado, o gerente seleciona um técnico disponível.

### Ações do gerente

- Escolher técnico responsável
- Delegar o chamado

### Resultado

O chamado passa para o status:

`Atribuído`

---

## 4. Visualização da Fila — Técnico

O técnico acessa o sistema e visualiza os chamados atribuídos.

### Informações exibidas

- Local do problema
- Tipo de manutenção
- Descrição do chamado
- Prioridade/status

---

## 5. Atualização da Manutenção — Técnico

Durante a execução do serviço, o técnico atualiza o andamento da manutenção.

### Possíveis atualizações

- Início da manutenção
- Manutenção em execução
- Finalização do serviço

---

# Status Possíveis do Chamado

| Status | Descrição |
|---|---|
| Aberto | Chamado criado pelo solicitante |
| Atribuído | Chamado encaminhado para um técnico |
| Em andamento | Técnico iniciou a manutenção |
| Concluído | Manutenção finalizada pelo técnico |
| Finalizado | Chamado encerrado no sistema |

---

# Resumo do Fluxo

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