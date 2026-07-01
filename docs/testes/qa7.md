# Relatório de Qualidade (QA) - Sprint 7

> 📌 **Baseado no commit:** [`fc0c9de`](https://github.com/FGA0138-MDS-Ajax/2026.1-T03-Parnas/commit/fc0c9de93b2d4881fd9db47ced6e80dfdcd85881) · **branch:** `developer`

Este documento consolida os testes e validações de interface da reta final do projeto realizados durante a **Sprint 7**.

---

## 1. Ajustes de Regra de Negócio e Permissões

- **Perfil Administrador inviolável:** Retirar a opção de um administrador excluir o "usuário excluído padrão" do sistema. A conta deve ser blindada como um "perfil inviolável" ou "Admin+".

## 2. Menu Hambúrguer para Mobile ✅

A responsividade dos menus para dispositivos móveis foi validada e implementada com sucesso para todos os papéis:

- **Administrador**: Botão "sair" inserido no menu sanduíche ✅
- **Solicitante**: Menu completo (opções da sidebar + botão sair) ✅
- **Gerente**: Ajuste no botão de sair no menu sanduíche ✅
- **Técnico**: Menu completo (com as opções da sidebar + botão sair) ✅

![Demonstração do menu hambúrguer](assets/qa7/image.png)

---

## 3. Experiência do Usuário (UX)

- **Retirar pop-ups nativos do navegador**: Evitar o uso de `alert()` e diálogos nativos do navegador, substituindo por modais amigáveis estilizados com a identidade visual da aplicação.

![Substituição de pop-ups nativos](assets/qa7/image%201.png)
