# Documentação Técnica - Venda.AI HUD (Chrome Extension)

## Visão Geral

Extensão Chrome que injeta uma interface de usuário flutuante (HUD) como overlay em qualquer página web, fornecendo funcionalidades de chat com IA e insights para vendedores. A extensão utiliza Shadow DOM para isolamento completo de estilos e APIs modernas do Chrome.

## Arquitetura Técnica

### Estrutura de Manifest (v3)

A extensão utiliza o **Chrome Manifest V3**, seguindo as práticas mais recentes:

```json
{
  "manifest_version": 3,
  "host_permissions": ["<all_urls>"],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content_script.js"],
      "run_at": "document_idle"
    }
  ]
}
```

- **Content Script**: Injetado em todas as páginas (`<all_urls>`)
- **Execução**: `document_idle` garante que o DOM esteja pronto
- **Recursos Web Acessíveis**: CSS e HTML componentizados disponíveis via `chrome.runtime.getURL()`

### Shadow DOM

O isolamento de estilos é garantido através de **Shadow DOM (mode: 'open')**:

```javascript
const host = document.createElement('div');
const root = host.attachShadow({ mode: 'open' });
```

**Benefícios:**
- Zero conflitos com CSS da página hospedeira
- Encapsulamento completo dos estilos da extensão
- Performance otimizada (estilos não vazam para fora)

### Arquitetura CSS Modular

Sistema de design baseado em **CSS Custom Properties** (variáveis CSS):

#### `css/variables.css`
Define todo o design system em um único arquivo:

```css
:host, :root {
  --hud-w: 315px;
  --hud-h: 89px;
  --panel-w: 552px;
  --panel-h: 397px;
  --blur: 14px;
  --glass: rgba(24,24,27,0.92);
  --btn-gradient: linear-gradient(180deg, #6F8CFF 0%, #5A79F5 100%);
}
```

#### Efeito Glassmorphism
Aplicado via **backdrop-filter** para criar interfaces translúcidas modernas:

```css
backdrop-filter: blur(var(--blur));
-webkit-backdrop-filter: blur(var(--blur));
background: var(--glass);
```

- **Compatibilidade**: Prefixo `-webkit-` para Safari
- **Performance**: `will-change` implícito via `position: fixed`

#### Sistema de Sombras Duplas
Efeito de profundidade usando sombras internas e externas:

```css
box-shadow: var(--shadow-in), var(--shadow-out);
/* 
  --shadow-in: 0 4px 24px rgba(0,0,0,0.25) inset;
  --shadow-out: 0 8px 24px rgba(0,0,0,0.25);
*/
```

## Front-End: Componentes e Interatividade

### 1. HUD (Barra Flutuante)

**Tecnologias:**
- **CSS Grid/Flexbox**: Layout responsivo e centralização
- **CSS Transitions**: Animações suaves em hover/active
- **Pointer Events API**: Drag & drop nativo

#### Funcionalidades

**Drag & Drop:**
```javascript
hud.addEventListener('pointerdown', (e) => {
  hud.setPointerCapture(e.pointerId); // Captura eventos mesmo fora do elemento
  // Cálculo de posição relativa ao cursor
  shiftX = e.clientX - rect.left;
  shiftY = e.clientY - rect.top;
});
```

- **Persistência**: Posição salva em `localStorage` por domínio
- **Boundary checking**: Limites da viewport respeitados
- **Performance**: `transform` evitado durante drag (usa `left/top` direto)

**Timer com Estado:**
```javascript
setInterval(() => {
  if (!isRunning) return;
  seconds++;
  const m = String(Math.floor(seconds/60)).padStart(2,'0');
  const s = String(seconds%60).padStart(2,'0');
  timerEl.textContent = `${m}:${s}`;
}, 1000);
```

### 2. Painel de Chat

**Stack Tecnológico:**
- **Google Gemini 2.0 Flash API**: IA conversacional
- **Markdown Parsing**: RegEx customizado para formatação
- **Streaming Simulation**: Efeito de digitação animado

#### Integração com Gemini API

```javascript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  {
    method: 'POST',
    headers: {
      'x-goog-api-key': 'API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system_instruction: { /* Prompt de sistema */ },
      contents: conversationHistory
    })
  }
);
```

**Recursos:**
- **Context Retention**: Histórico de conversação mantido no array `conversationHistory`
- **System Instruction**: Persona customizada focada em vendas
- **Error Handling**: Rollback do histórico em caso de falha

#### Markdown Parser Customizado

Suporta:
- **Code blocks** com syntax highlighting placeholder: ` ```language\ncode``` `
- **Inline code**: `` `code` ``
- **Bold/Italic**: `**bold**`, `*italic*`
- **Links**: `[text](url)` com `target="_blank"`
- **Headers**: `#`, `##`, `###`
- **Lists**: `*` ou `-`

```javascript
const parseMarkdown = (text) => {
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, 
    (match, lang, code) => `<pre><code class="language-${lang}">${code.trim()}</code></pre>`
  );
  // Inline code, bold, italic, etc.
};
```

#### Animação de Streaming

Simula resposta em tempo real da IA:

```javascript
const streamText = (element, text, speed = 45) => {
  return new Promise((resolve) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        displayText += text[index];
        element.innerHTML = parseMarkdown(displayText);
        index++;
        messages.scrollTop = messages.scrollHeight; // Auto-scroll
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
};
```

### 3. Painel de Insights

Componente estático carregado de `Panel.html`:

**Características:**
- **Semantic HTML**: `<section>`, `aria-label` para acessibilidade
- **CSS Grid**: Layout de ações com emoji + texto
- **Dividers**: Gradiente sutil para separação visual

```css
.divider {
  height: 1px;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0.15), 
    rgba(255,255,255,0.45), 
    rgba(255,255,255,0.15)
  );
}
```

## Otimizações de Performance

### 1. Lazy Loading de Recursos

```javascript
const loadText = async (path) => {
  const url = chrome.runtime.getURL(path);
  const res = await fetch(url);
  return await res.text();
};

const [varsCss, baseCss, hudCss, panelCss, chatCss] = await Promise.all([
  loadText('css/variables.css'),
  // ... outros arquivos
]);
```

- **Parallel Loading**: `Promise.all()` para carregar todos os CSS simultaneamente
- **Single Style Tag**: Todos os CSS concatenados em um único `<style>`

### 2. Posicionamento Inteligente

Painéis reposicionam-se automaticamente para evitar overflow da viewport:

```javascript
const repositionPanels = () => {
  const hudRect = hud.getBoundingClientRect();
  let top = hudRect.bottom + gap;
  // Se não couber abaixo, coloca acima
  if (top + panelH + margin > vh) {
    top = Math.max(margin, hudRect.top - panelH - gap);
  }
};
```

### 3. Event Delegation

Botões usam event listeners únicos em vez de múltiplos:

```javascript
sendBtn._bound = true; // Flag para evitar múltiplos bindings
```

## Responsividade e Acessibilidade

### ARIA Labels
```html
<button aria-label="Pausar" title="Pausar">
<div aria-live="polite">00:00</div>
<section aria-label="Painel de chat">
```

### Media Query para Movimentos Reduzidos
```css
@media (prefers-reduced-motion: reduce) {
  .icon-btn { transition: none; }
  .icon-btn svg { transition: none; }
}
```

### Custom Scrollbar Styling
```css
.chat-messages::-webkit-scrollbar {
  width: 6px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
```

## Stack Resumido

| Tecnologia | Uso |
|------------|-----|
| **Chrome Manifest V3** | Estrutura da extensão |
| **Shadow DOM** | Isolamento de estilos |
| **CSS Custom Properties** | Design system |
| **Glassmorphism** | UI moderna translúcida |
| **Pointer Events API** | Drag & drop |
| **Google Gemini API** | IA conversacional |
| **RegEx Markdown Parser** | Formatação de mensagens |
| **localStorage** | Persistência de posição |
| **Async/Await + Fetch** | Requisições HTTP |
| **ARIA** | Acessibilidade |

## Limitações Conhecidas

- **API Key hardcoded**: Deve ser movida para variáveis de ambiente
- **No rate limiting**: Sem controle de requisições à API
- **Histórico não persistente**: Chat limpa ao recarregar página
- **Sem i18n**: Interface apenas em português
