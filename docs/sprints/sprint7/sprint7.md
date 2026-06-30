# Sprint 7

## Objetivo da Sprint

Finalizar o KeepUnB para entrega, corrigindo bugs, validando todos os fluxos, revisando documentação, preparando a apresentação e garantindo que o sistema executasse corretamente em ambiente local. Nesta sprint, também foi mantido o padrão de documentação das sprints anteriores para facilitar o fechamento do projeto.

## Resumo do que foi realizado

A Sprint 7 concentrou os ajustes finais de estabilidade, usabilidade e documentação do KeepUnB. O trabalho priorizou a correção de falhas que ainda afetavam a experiência de uso e a consistência entre frontend, backend e documentação técnica, além da validação dos fluxos principais do sistema.

No frontend, foram corrigidos problemas de exibição e navegação que impactavam páginas e perfis específicos. Entre os ajustes feitos estão a correção de overflow de caracteres em telas, a remoção de pop-ups desnecessários do navegador, a criação de um menu lateral responsivo para mobile, o redirecionamento do cadastro direto para a tela correta e melhorias de layout e comportamento na página do administrador. Também houve uma página de gerente com identidade visual própria, alinhada às diferenças de perfil do sistema.

Ainda no frontend, foi realizado um conjunto de otimizações para reduzir o tempo de carregamento inicial sem alterar funcionalidades nem comprometer a segurança. Isso incluiu a remoção de esperas artificiais em fluxos de carregamento, a eliminação de chamadas duplicadas no dashboard do solicitante, a reutilização de dados já carregados para cálculo de indicadores e a consolidação de estatísticas do gerente a partir do resumo já fornecido pelo backend.

No backend, foram aplicados ajustes importantes de regra de negócio e segurança. Entre eles, destacam-se a limitação de tentativas incorretas de senha, a solução do fluxo de recuperação de senha, a garantia de que administradores não possam excluir outros administradores e a correção do funcionamento do seed de dados. Também foi ajustado o comportamento de imagens em chamados, garantindo que os anexos apareçam corretamente para os perfis autorizados.

Na documentação, foram feitos registros e atualizações para manter o projeto coerente com o estado real do sistema. Isso incluiu a atualização da documentação de endpoints, a documentação do painel administrativo, da sugestão de técnico e do comportamento de múltiplas abas, além da revisão de itens ligados à organização geral da entrega. A Sprint 7 também consolidou o preparo do projeto para apresentação e entrega final.

## Principais entregas por tema

### Correções e estabilidade

- Corrigido o overflow de caracteres em páginas do frontend.
- Ajustado o funcionamento do botão "lembrar-me" no login.
- Corrigido o fluxo de recuperação de senha.
- Limitadas as tentativas incorretas de senha.
- Corrigido o seed de dados para facilitar a inicialização do ambiente.
- Ajustado o carregamento de imagens dos chamados para os técnicos.

### Experiência e interface

- Adicionado menu de navegação para mobile.
- Removidos pop-ups do navegador.
- Atualizada a página do gerente para ter comportamento e apresentação diferentes dos demais perfis.
- Melhorada a página do administrador.
- Ajustado o redirecionamento do cadastro direto para a tela correta.

### Desempenho

- Otimizado o carregamento inicial do site.
- Removidas esperas artificiais de carregamento.
- Eliminação de requisições duplicadas no dashboard do solicitante.
- Reaproveitamento de dados já carregados para calcular estatísticas.
- Uso do resumo consolidado do backend no painel do gerente.

### Segurança e regras de negócio

- Impedida a exclusão de administradores por outros administradores.
- Reforçadas validações de fluxo no backend.
- Mantida a separação entre regras de exibição e regras de autorização.

### Documentação

- Atualizada a documentação de endpoints.
- Documentado o painel administrativo.
- Documentada a sugestão de técnico.
- Documentado o comportamento de múltiplas abas.
- Revisadas anotações e materiais de apoio para a entrega final.

## Ata de reunião

**Data:** 22/06/2026  
**Horário:**  19:30 - 19:45
**Local:**  Discord
**Participantes:**  @felipemso, @arthur-mariani, @carloshfgit, @vellloso, @caioNapoles, @Danielfelipe08, @prietum, @RodrigoCBarbosa, @arthurrcoelho, @Dandot1, @Guilhermesouza21, @CharlesRuan-MAP.

**Objetivo:**  
Discutir melhorias finais e correção de bugs identificados no projeto.

**Discussões e Decisões:**  
-  Foram citados diversos bugs que encontramos e proposição de melhorias simples de coisas que já existiam anteriormente no projeto. Todos os bugs encontrados foram corrigidos e citados acima.

