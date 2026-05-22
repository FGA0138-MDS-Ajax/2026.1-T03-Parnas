# Guia de Git e Fluxo de Trabalho - KeepUnB

Este guia reúne todas as orientações, comandos e boas práticas de Git adotadas no **KeepUnB**. Seguir estes padrões garante que o histórico do nosso repositório seja limpo, compreensível e que a integração contínua (CI/CD) funcione perfeitamente.

---

##  1. Modelo de Branching (Git Flow)

Trabalhamos com ramificações estruturadas a partir de duas branches principais permanentes:

*   `main`: Contém o código estável em produção.
*   `developer`: Branch de integração onde todas as novas funcionalidades e correções são mescladas antes de irem para produção.

```mermaid
graph TD
    main["main (Produção)"] -->|Branch inicial| developer["developer (Integração)"]
    developer -->|Criação| feat["feature/nome-da-feature"]
    developer -->|Criação| fix["fix/correcao-bug"]
    feat -->|Pull Request + Review| developer
    fix -->|Pull Request + Review| developer
    developer -->|Release / Merge| main
    main -->|Hotfix Crítico| hotfix["hotfix/correcao-urgente"]
    hotfix -->|Merge Direto| main
    hotfix -->|Merge Direto| developer
```

### Tipos de Branches e Padrões de Nomes

Todas as branches de trabalho devem ser criadas a partir da `developer` e seguir as nomenclaturas:

| Tipo | Prefixo | Exemplo | Finalidade |
| :--- | :--- | :--- | :--- |
| **Funcionalidade** | `feature/` | `feature/login-solicitante` | Adicionar novas telas, endpoints ou lógicas. |
| **Correção de Bug** | `fix/` | `fix/validacao-cpf` | Corrigir problemas ou comportamentos inesperados. |
| **Melhoria/Refatoração** | `refactor/` | `refactor/api-client` | Alterações estruturais que não alteram comportamento. |
| **Correção Crítica** | `hotfix/` | `hotfix/vulnerabilidade-jwt` | Correções urgentes que devem ir direto para produção (`main`). |

---

##  2. Convenção de Commits (Conventional Commits)

Nossas mensagens de commit devem ser claras e padronizadas para facilitar a leitura do histórico e a geração de changelogs automáticos.

### Estrutura do Commit

```
<tipo>(<escopo>): <descrição curta em minúsculas>

[corpo opcional explicando o motivo da alteração]
```

### Tipos Permitidos

> [!TIP]
> Os tipos mais comuns em desenvolvimento diário são `feat`, `fix` e `chore`.

*   `feat`: Uma nova funcionalidade (ex: `feat(auth): implementar login com JWT`).
*   `fix`: Correção de um bug (ex: `fix(database): corrigir timeout na conexão`).
*   `docs`: Mudanças apenas na documentação (ex: `docs: atualizar guia de git`).
*   `style`: Alterações apenas visuais/formatação (espaços, ponto e vírgula) que não mudam o código.
*   `refactor`: Alteração que não corrige bug nem adiciona funcionalidade (ex: `refactor(services): otimizar query de chamados`).
*   `test`: Adicionar ou corrigir testes existentes (ex: `test(routers): adicionar teste de autenticação`).
*   `chore`: Tarefas de build, ferramentas, dependências ou scaffolding (ex: `chore(scaffold): estruturar pastas base`).

---

##  3. Ciclo de Vida de uma Feature (Passo a Passo)

Siga este roteiro ao desenvolver qualquer tarefa no projeto:

### Passo 1: Atualizar a sua branch `developer` local
Antes de começar qualquer nova tarefa, baixe as atualizações mais recentes do servidor remoto:
```bash
git checkout developer
git pull origin developer
```

### Passo 2: Criar a sua branch de trabalho
Crie uma nova branch com a nomenclatura padrão:
```bash
git checkout -b feature/minha-nova-funcionalidade
```

### Passo 3: Fazer pequenos commits frequentes
Evite fazer um único commit gigante com milhares de alterações. Divida seu trabalho em partes lógicas pequenas e commit-as de forma descritiva:
```bash
git add backend/app/models/solicitacao.py
git commit -m "feat(models): criar modelo de solicitacao com relacionamento de usuario"
```

### Passo 4: Sincronizar com a `developer` antes de enviar (Rebase/Merge)
Se outros desenvolvedores enviaram alterações enquanto você trabalhava, atualize sua branch para evitar conflitos no GitHub:
```bash
git fetch origin
git merge origin/developer
# Ou resolva conflitos localmente se existirem.
```

### Passo 5: Enviar a branch para o GitHub
Envie a branch para o servidor remoto:
```bash
git push origin feature/minha-nova-funcionalidade
```

### Passo 6: Abrir o Pull Request (PR)
Acesse o repositório no GitHub e crie o Pull Request direcionando a sua branch para a branch **`developer`**. Adicione uma descrição detalhada das mudanças.

---

##  4. Autenticação e Resolução de Problemas (Token/PAT)

Se você receber erros como **`Permission denied (403)`** ao tentar fazer um `git push`, isso significa que o Git local não está devidamente autenticado com as regras modernas do GitHub.

### O que é o Token (PAT)?
O GitHub não aceita mais a sua senha convencional no terminal por motivos de segurança. Você deve gerar um **Personal Access Token (Token de Acesso Pessoal)** nas configurações da sua conta do GitHub e usá-lo como "senha".

### Como configurar o token na máquina local

#### Método 1: Salvar na memória do Git (Recomendado)
Para que você não precise digitar o token em todas as operações:
```bash
git config --global credential.helper store
```
Na próxima vez que o terminal pedir a sua **Password** no Git, basta colar o seu token (que começa com `ghp_...`).

#### Método 2: Embutir o Token na URL remota
Caso queira pular a autenticação manual permanentemente, você pode configurar o endereço do Git com as suas credenciais embutidas:
```bash
git remote set-url origin https://SEU_USUARIO_GITHUB:SEU_TOKEN_AQUI@github.com/FGA0138-MDS-Ajax/2026.1-T03-Parnas.git
```

---

##  5. Boas Práticas Gerais

1.  **Nunca commite dados sensíveis:** Senhas, chaves privadas e arquivos `.env` jamais devem ser adicionados ao Git. Utilize sempre arquivos `.env.example` e adicione os arquivos `.env` ao `.gitignore`.
2.  **Mantenha os commits focados:** Um commit deve fazer apenas uma coisa. Se você corrigiu um bug no login e adicionou um campo no perfil, faça dois commits separados.
3.  **Rode as validações locais:** Antes de enviar as branches, certifique-se de que os testes e lints locais rodam com sucesso para não quebrar a esteira de CI/CD do GitHub.
