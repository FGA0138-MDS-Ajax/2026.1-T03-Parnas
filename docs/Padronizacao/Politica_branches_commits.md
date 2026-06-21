# Guia de Padronização - KeepUnB

Este documento estabelece o fluxo de trabalho, o modelo de branches, a estrutura de issues e a convenção de commits para o desenvolvimento do projeto **KeepUnB**. O objetivo é manter o repositório organizado, garantir a rastreabilidade e facilitar a colaboração contínua do time.


## 1. Fluxo Principal de Trabalho

O ciclo padrão de desenvolvimento de qualquer atividade segue o fluxo linear abaixo:

```
Issue ➔ Branch ➔ Commits ➔ Pull Request ➔ Revisão ➔ Merge
```

1. **Issue:** Criar uma issue no GitHub para registrar, descrever e planejar a tarefa.
2. **Branch:** Criar uma ramificação local a partir da branch `developer`.
3. **Commits:** Realizar commits incrementais, pequenos e focados.
4. **Pull Request (PR):** Enviar a branch local para o GitHub e abrir um PR apontando para a branch `developer`.
5. **Revisão:** Aguardar feedback e aprovação dos revisores designados.
6. **Merge:** Realizar a integração do código na branch `developer` (ação restrita ao Arquiteto ou PO).

---

## 2. Modelo e Tipos de Branches

Para organizar o desenvolvimento paralelo, utilizamos um modelo de ramificação baseado em branches permanentes e branches temporárias de trabalho.

### Branches Permanentes

*   `main`: Contém a versão de produção estável. Recebe apenas código homologado e testado vindo da `developer`.
*   `developer`: Branch de integração contínua. Todos os desenvolvimentos de novas funcionalidades e correções de bugs devem ser mesclados aqui primeiro.
*   `docs`: Contém a documentação técnica oficial do projeto (ex: MkDocs).
*   `gh-pages`: Utilizada para o deploy automático e hospedagem da documentação via GitHub Pages.

### Branches de Trabalho (Temporárias)

Devem ser criadas sempre a partir da branch `developer` atualizada. O nome da branch deve seguir o padrão:
`tipo/descricao-curta`

| Tipo de Branch | Prefixo | Quando Usar | Exemplo |
| :--- | :--- | :--- | :--- |
| **Funcionalidade** | `feature/` | Implementação de novas telas, rotas ou lógicas de negócio. | `feature/tela-login` |
| **Correção** | `fix/` | Resolução de bugs e comportamentos inadequados detectados. | `fix/erro-autenticacao` |
| **Documentação** | `docs/` | Criação ou atualização de guias, READMEs ou documentações técnicas. | `docs/atualizar-readme` |
| **Configuração** | `chore/` | Ajustes de ambiente, dependências de pacotes ou arquivos de infraestrutura. | `chore/setup-docker` |
| **Refatoração** | `refactor/` | Melhorias estruturais no código existente sem alterar o comportamento externo. | `refactor/simplifica-api` |
| **Correção Crítica** | `hotfix/` | Correções urgentes aplicadas diretamente à branch `main`. | `hotfix/correcao-login-prod` |

#### Comandos Rápidos de Criação:
```bash
git checkout developer
git pull origin developer
git checkout -b feature/tela-login
```

---

## 3. Issues e Template de Criação

Cada tarefa, bug ou melhoria da Sprint deve possuir uma issue correspondente no GitHub. O preenchimento deve seguir o padrão do template abaixo para assegurar clareza e completude.

### Template de Issue

**Descrição:**    

- [Descreva de forma concisa o objetivo desta issue, a funcionalidade proposta ou o problema a ser resolvido.]

**Deve conter:**  

- [ ] [Elemento ou comportamento esperado 1]  
- [ ] [Elemento ou comportamento esperado 2]  

**Critérios de aceitação:**

--> OBSERVAÇÃO: Descreva brevemente os comportamentos esperados ou regras de negócio a serem validadas para aceitação da issue.  

- [ ] [Exemplo: Ao clicar no botão enviar, o usuário deve ser redirecionado e ver uma mensagem de sucesso]  
- [ ] [Exemplo: O sistema deve retornar erro 400 se o campo CPF estiver vazio]

**Detalhes técnicos:**

- [Defina tecnologias envolvidas, novas dependências, rotas de API afetadas, modelagens de dados ou variáveis de ambiente necessárias.]

---

## 4. Convenção e Tipos de Commits

As mensagens de commit devem descrever claramente o que foi feito na alteração, utilizando o padrão de commits semânticos (Conventional Commits).

### Estrutura do Commit

```
tipo(escopo): descrição curta em português e com letras minúsculas
```
*O escopo é opcional e identifica a parte específica do sistema afetada (ex: `login`, `api`, `docker`).*

### Tipos de Commits e Quando Usar

*   `feat`: Adição de uma nova funcionalidade ou recurso ao sistema.
    *   *Exemplo:* `feat(auth): adiciona fluxo de login social`
*   `fix`: Resolução de um bug ou erro reportado.
    *   *Exemplo:* `fix(api): corrige estouro de memória na rota de busca`
*   `docs`: Alterações exclusivas em arquivos de documentação (ex: README, guias de configuração, arquivos markdown).
    *   *Exemplo:* `docs: atualiza guia de instalação rápida`
*   `chore`: Alterações de configuração, setup de ambiente, dependências de pacotes ou organização interna de arquivos.
    *   *Exemplo:* `chore(npm): instala biblioteca axios`
*   `refactor`: Modificação que melhora a legibilidade ou estrutura do código de produção sem alterar seu comportamento público ou corrigir bugs.
    *   *Exemplo:* `refactor(utils): otimiza função de formatação de datas`
*   `test`: Adição de novos testes automatizados ou correção de testes existentes.
    *   *Exemplo:* `test(login): implementa teste unitário para autenticação`
*   `style`: Alterações estritamente estéticas de formatação de código (espaçamentos, linter, chaves, ponto e vírgula) que não afetam a lógica de negócio.
    *   *Exemplo:* `style: formata código de acordo com o eslint`
