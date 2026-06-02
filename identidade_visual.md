# Manual de Identidade Visual • KeepUnB

Este documento estabelece as diretrizes de identidade visual e o sistema de design do projeto **KeepUnB**. Ele serve como um guia abrangente para desenvolvedores, designers e membros da equipe garantirem a consistência visual em todas as telas, comunicações e materiais do sistema.

---

## 1. O Logotipo Oficial

O logotipo do **KeepUnB** foi projetado para representar a essência do projeto: a gestão de manutenção em ambiente universitário. Ele é composto por duas partes principais: o **Símbolo Gráfico** e a **Assinatura Tipográfica**.

![Logotipo Oficial KeepUnB](frontend/public/Keep-unb-logo.png)

### Conceito e Elementos Visuais
1. **O Operário (À Esquerda)**:
   - Um contorno minimalista em formato de linha grossa na cor Azul Marinho Escuro.
   - O uso do capacete de proteção e do martelo erguido simboliza o trabalho manual, a engenharia de infraestrutura, os reparos, a ação rápida e a manutenção.
2. **O Emblema da UnB (À Direita)**:
   - Uma releitura geométrica moderna do icônico símbolo da **Universidade de Brasília (UnB)**.
   - Consiste em dois blocos com cantos arredondados, divididos horizontalmente por uma curva côncava branca que cria uma sensação de fluidez e dinâmica (inspirada na arquitetura de Oscar Niemeyer).
   - A metade superior é colorida em **Azul Marinho** e a metade inferior em **Verde UnB**, reforçando as cores tradicionais da instituição.
3. **A Tipografia (Abaixo)**:
   - A palavra é unificada como **KeepUnB**.
   - **Keep** (em Azul Marinho): Reflete conservação, cuidado, persistência e gestão de chamados.
   - **UnB** (em Verde): Identifica diretamente a universidade, trazendo o sentimento de pertencimento e oficialidade institucional.

---

## 2. Paleta de Cores

A paleta de cores do **KeepUnB** foi extraída das cores tradicionais da Universidade de Brasília (Azul e Verde) e expandida para criar um contraste contemporâneo e elegante. Ela está configurada no CSS global do projeto como variáveis customizadas (`:root`).

```mermaid
graph TD
    subgraph Tons de Azul (Confiança e Estrutura)
        NavyDark["Navy Dark<br>#071A3E"]
        Navy["Navy (Base)<br>#0D2B5E"]
        NavyMid["Navy Mid<br>#1A3F7A"]
        NavyLight["Navy Light<br>#2557A7"]
    end
    subgraph Tons de Verde (Ação e Sucesso)
        Green["Green (Base)<br>#1B7A3A"]
        GreenMid["Green Mid<br>#2AA34E"]
        GreenLight["Green Light<br>#3DC966"]
        GreenPale["Green Pale<br>#D4F0DC"]
    end
    subgraph Neutros (Leitura e Superfícies)
        White["White<br>#FFFFFF"]
        OffWhite["Off-White<br>#F4F7FB"]
        GrayText["Gray Text<br>#6B7A99"]
    end
```

### Detalhamento dos Códigos de Cores

| Nome da Variável CSS | Cor Visual | Código HEX | Aplicação Recomendada / Significado |
| :--- | :---: | :--- | :--- |
| `--navy-dark` | 🟦 | `#071A3E` | Fundo principal da aplicação (Dark Mode), gerando uma estética premium. |
| `--navy` | 🟦 | `#0D2B5E` | Cor institucional primária. Usada no "Keep", no ícone do operário e textos fortes. |
| `--navy-mid` | 🟦 | `#1A3F7A` | Tons intermediários de fundo, gradientes do Hero e bordas ativas. |
| `--navy-light` | 🟦 | `#2557A7` | Destaques sutis em azul e estados de hover em elementos secundários. |
| `--green` | 🟩 | `#1B7A3A` | Cor institucional secundária (Verde UnB). Usada no "UnB", botões principais (CTA) e ícones de sucesso. |
| `--green-mid` | 🟩 | `#2AA34E` | Estado de hover (`:hover`) de botões e links que utilizam a cor verde primária. |
| `--green-light` | 🟩 | `#3DC966` | Destaques luminosos no Dark Mode, badges ativos, textos destacados e ícones de status bem-sucedidos. |
| `--green-pale` | 🟩 | `#D4F0DC` | Fundo de alertas ou badges de sucesso (alta legibilidade de texto verde sobre este fundo). |
| `--white` | ⬜ | `#FFFFFF` | Texto principal no Dark Mode e fundo de cartões/inputs no Light Mode. |
| `--off-white` | ⬜ | `#F4F7FB` | Fundo de seções claras (como a seção de Features) e elementos de contraste leve. |
| `--gray-text` | 🔲 | `#6B7A99` | Textos secundários, legendas, parágrafos de menor prioridade e placeholders. |
| `--border` | ◽ | `rgba(255,255,255,0.12)` | Bordas finas de cartões em vidro (Glassmorphism), criando divisores sutis e elegantes. |

---

## 3. Tipografia

O **KeepUnB** utiliza duas famílias de fontes do Google Fonts altamente legíveis, modernas e com forte apelo geométrico.

### 3.1. Tipografia de Títulos: `Sora`
*   **Família**: `'Sora', sans-serif`
*   **Pesos Importados**: `300`, `400`, `600`, `700`, `800`
*   **Aplicação**: Cabeçalhos (`h1`, `h2`, `h3`), logomarca de navegação, números grandes de estatísticas e botões de chamada para ação (CTAs).
*   **Características**: Uma fonte sem serifa contemporânea com estrutura bem aberta e geométrica, ideal para passar modernidade e solidez.
*   **Exemplo de CSS**:
    ```css
    font-family: 'Sora', sans-serif;
    font-weight: 800; /* Para títulos principais com forte impacto visual */
    letter-spacing: -0.04em; /* Recomendado reduzir o espaçamento em títulos grandes */
    ```

### 3.2. Tipografia de Corpo de Texto: `DM Sans`
*   **Família**: `'DM Sans', sans-serif`
*   **Pesos Importados**: `300`, `400`, `500`
*   **Aplicação**: Parágrafos (`p`), textos de ajuda, rótulos de campos de formulário, descrições secundárias e elementos de tabela.
*   **Características**: Altamente legível em telas pequenas e dispositivos móveis. Desenho limpo e neutro que não compete visualmente com a fonte dos títulos.
*   **Exemplo de CSS**:
    ```css
    font-family: 'DM Sans', sans-serif;
    font-weight: 400; /* Regular para leitura contínua */
    line-height: 1.75; /* Espaçamento de linha confortável para blocos de texto */
    ```

### 3.3. Hierarquia Tipográfica Sugerida

| Elemento | Família | Tamanho (Rem / Clamp) | Peso (Weight) | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Título Principal (Hero)** | `Sora` | `clamp(2.8rem, 5vw, 4.2rem)` | `800` (Extra Bold) | `-0.04em` |
| **Título de Seção (h2)** | `Sora` | `2.5rem` | `700` (Bold) | `-0.03em` |
| **Subtítulo / Título Médio** | `Sora` | `1.4rem` a `1.6rem` | `600` (Semi Bold) | `-0.02em` |
| **Texto de Botão / CTA** | `Sora` | `0.95rem` | `600` (Semi Bold) | `normal` |
| **Texto de Parágrafo** | `DM Sans` | `1.0rem` a `1.1rem` | `300` ou `400` | `normal` |
| **Pílulas / Labels Curtos** | `Sora` / `DM Sans`| `0.78rem` a `0.8rem` | `500` ou `600` | `0.12em` (Uppercase) |

---

## 4. Diretrizes de Uso do Logotipo

Para manter a integridade visual da marca, é fundamental seguir estas regras de aplicação:

### 4.1. Espaço de Respiro (Margem de Segurança)
Deve-se manter uma margem de segurança ao redor do logotipo equivalente à altura da letra "**K**" do texto "KeepUnB" para evitar que outros elementos da interface (textos, botões, imagens) fiquem colados ou poluam a visualização da marca.

### 4.2. Fundos Recomendados
- **Preferencial (Dark Mode)**: O logotipo se destaca magnificamente sobre fundos escuros baseados na cor `--navy-dark` (`#071A3E`) ou pretos puro, pois o contraste com a metade verde e branca sobressai perfeitamente.
- **Alternativo (Light Mode)**: Em fundos brancos (`#FFFFFF`) ou off-white (`#F4F7FB`), o logotipo se comporta muito bem, devendo-se apenas ter atenção com o contraste do capacete do operário e do texto "Keep", que estão em azul marinho.

### 4.3. Usos Proibidos 🚫
- **Não distorcer**: Nunca redimensionar o logotipo de forma não proporcional (esticar horizontalmente ou achatar verticalmente).
- **Não rotacionar**: O logotipo deve ser exibido estritamente na horizontal.
- **Não alterar as cores**: Não substitua as cores originais (Azul Marinho e Verde UnB) por outras variações cromáticas aleatórias.
- **Não separar os elementos em telas de identidade estrita**: O operário, o emblema UnB e o texto "KeepUnB" devem preferencialmente caminhar juntos nas telas principais de introdução. Para layouts reduzidos de navegação (Navbars), recomenda-se o uso apenas da assinatura tipográfica ou de ícones unificados já previstos.

---

## 5. Elementos e Padrões de Componentes (Design Tokens)

As diretrizes visuais estendem-se aos componentes interativos da interface para garantir consistência estética.

### 5.1. Cantos Arredondados (Bordas)
O projeto adota uma estética amigável e moderna, com cantos bem arredondados:
- **Botões de Ação**: `border-radius: 8px` ou `10px`
- **Pílulas / Badges de Informação**: `border-radius: 100px` (formato cápsula completo)
- **Inputs e Campos de Texto**: `border-radius: 8px` ou `10px`
- **Cartões e Painéis (Cards)**: `border-radius: 20px` (proporciona o visual moderno de painel)
- **Containers do Logotipo (Wraps)**: `border-radius: 14px`

### 5.2. Efeito Vidro (Glassmorphism)
Para criar profundidade no Dark Mode sem poluir a tela com excesso de cores chapadas, o sistema utiliza o visual de vidro semi-transparente:
```css
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.12); /* Equivalente a var(--border) */
backdrop-filter: blur(8px);
```

### 5.3. Interações e Micro-Animações
- **Transições Suaves**: Toda alteração de estado (hover, focus, active) deve utilizar transições de tempo controlado, preferencialmente `transition: all 0.2s ease` ou `transition: background 0.2s, transform 0.15s`.
- **Efeito de Elevação**: Ao passar o mouse sobre botões principais (`.btn-primary`) ou cartões interativos, eles devem sofrer uma sutil translação vertical negativa para passar sensação de clique tridimensional:
  ```css
  transform: translateY(-2px);
  ```
