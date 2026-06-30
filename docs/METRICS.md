# Métricas do Projeto

Este documento reúne todas as métricas e indicadores definidos no [Documento de Visão](visao/visao.md) do KeepUnB. As métricas estão estruturadas utilizando a metodologia **GQM (Goal, Question, Metric)** para apoiar o andamento do projeto, a qualidade do software e o controle do débito técnico.

---

## 1. Métricas de Processo e Qualidade (GQM)

A equipe elaborou o GQM para guiar o acompanhamento do projeto, do débito técnico e da qualidade do software em desenvolvimento.

### 1.1 Taxa de Conclusao da Sprint (*Sprint Velocity*)

| Campo | Descrição |
| :--- | :--- |
| **Métrica Associada** | **Taxa de Conclusao da Sprint** |
| **Objetivo da Medição** | Avaliar a estabilidade e a presença de defeitos no software gerado. |
| **Questão a ser respondida** | A equipe está conseguindo entregar o escopo planejado na Sprint dentro do prazo estabelecido? |
| **Definição da Métrica** | Mede a quantidade de esforço (em *Issues*) entregue com sucesso ao final de uma iteração. |
| **Forma de Cálculo** | $$\text{Taxa de Conclusao} = \frac{\text{Somatório das Issues concluídas}}{\text{Somatório das Issues planejadas na Sprint}} \times 100$$ |
| **Escala de Unidade** | Porcentagem (%) |
| **Valores Esperados** | Entre 90% e 100% dos pontos planejados concluídos a cada Sprint. |
| **Forma de Análise** | Se o valor for sistematicamente inferior a 90%, a equipe deverá analisar no replanejamento se há sobrecarga de tarefas ou impedimentos não resolvidos. |

### 1.2 Taxa de Resolução de Defeitos (*Bug Resolution Rate*)

| Campo | Descrição |
| :--- | :--- |
| **Métrica Associada** | **Taxa de Resolução de Defeitos (*Bug Resolution Rate*)** |
| **Objetivo da Medição** | Avaliar a estabilidade e a presença de defeitos no software gerado. |
| **Questão a ser respondida** | Qual é a densidade de falhas e defeitos nas funcionalidades entregues? |
| **Definição da Métrica** | Proporção de defeitos encontrados durante os testes que foram efetivamente corrigidos. |
| **Forma de Cálculo** | $$\text{Taxa de Resolução} = \left( \frac{\text{Número de defeitos corrigidos}}{\text{Número de defeitos reportados}} \right) \times 100$$ |
| **Escala de Unidade** | Porcentagem (%) |
| **Valores Esperados** | 0% de ocorrência de bugs críticos/bloqueantes em produção; no mínimo 80% de resolução para defeitos não críticos na mesma Sprint. |
| **Forma de Análise** | Realizada ao fim de cada Sprint. Bugs críticos não resolvidos impedem a entrega do incremento. |

### 1.3 Cobertura de Código (*Code Coverage*)

| Campo | Descrição |
| :--- | :--- |
| **Métrica Associada** | **Cobertura de Código (*Code Coverage*)** |
| **Objetivo da Medição** | Controlar o débito técnico e garantir a manutenibilidade do código. |
| **Questão a ser respondida** | O código desenvolvido possui cobertura suficiente para evitar regressões e garantir segurança? |
| **Definição da Métrica** | Porcentagem do código-fonte que é percorrida e validada por testes automatizados. |
| **Forma de Cálculo** | $$\text{Cobertura} = \frac{\text{Linhas de código executadas pelos testes}}{\text{Total de linhas de código do sistema}} \times 100$$ |
| **Escala de Unidade** | Porcentagem (%) |
| **Valores Esperados** | Mínimo de 80% de cobertura de testes para novas funcionalidades desenvolvidas no back-end e front-end. |
| **Forma de Análise** | Medição contínua via ferramentas de integração contínua (CI). *Pull Requests* com cobertura inferior a 80% devem ser bloqueados. |

---

## 2. Histórico de Resultados das Sprints

A tabela abaixo consolida os resultados reais de todas as sprints do KeepUnB desenvolvidas até o momento (com exceção das sprints 0, 1 e 2):

| Sprint | Taxa de Conclusão | Taxa de Resolução de Defeitos | Cobertura de Código |
| :---: | :---: | :---: | :---: |
| **Sprint 3** | 100.00% | 100.00% | N/A |
| **Sprint 4** | 100.00% | 100.00% | 80.50% (com 32 testes) |
| **Sprint 5** | 100.00% | 100.00% | 82.10% (com 68 testes) |
| **Sprint 6** | 100.00% | 100.00% | 84.60% (com 92 testes) |
| **Sprint 7** | 100.00% | 100.00% | 88.30% (com 114 testes) |

---

## 3. Indicadores de Produto (Painel do Gerente)

Conforme definido no escopo do produto (Requisito `C04/R01`), o painel administrativo da aplicação KeepUnB apresentará os seguintes indicadores de desempenho operacional para apoiar a gestão de infraestrutura:

1. **Volume de Chamados:** Total de solicitações de manutenção abertas e finalizadas em um período.
2. **Chamados por Categoria:** Distribuição das demandas por tipo de problema (ex: elétrico, hidráulico, estrutural) e por local da FCTE.
