# VendAI - Assistente Inteligente de Vendas

Extensão do Chrome que utiliza IA para analisar videochamadas em tempo real e fornecer insights valiosos para vendedores.

## 📋 Funcionalidades

- ✅ **Análise em Tempo Real**: Captura e analisa conversas durante videochamadas
- 💡 **Insights Inteligentes**: Identifica objeções, sinais de interesse e pontos de dor
- 💬 **Chat com IA**: Tire dúvidas durante a reunião
- ⚙️ **Configurações Personalizáveis**: Ajuste a IA ao seu produto/serviço
- 🌐 **Suporte Multi-plataforma**: Google Meet, Zoom, Microsoft Teams

## 📁 Estrutura do Projeto

```
vendai/
├── manifest.json                    # Configuração da extensão
├── background.js                    # Service worker
├── content.js                       # Script injetado nas páginas
├── content.css                      # Estilos do content script
├── popup.html                       # Popup da extensão
├── popup.js                         # Lógica do popup
├── login.html                       # Tela de login
├── style.css                        # Estilos do login
├── script.js                        # Lógica do login
├── insights.html                    # Tela de insights
├── insights-style.css               # Estilos dos insights
├── insights-script.js               # Lógica dos insights
├── configuracoes.html               # Tela de configurações
├── configuracoes-style.css          # Estilos das configurações
├── configuracoes-script.js          # Lógica das configurações
├── chat.html                        # Tela de chat
├── chat-style.css                   # Estilos do chat
├── chat-script.js                   # Lógica do chat
├── configuracoes-ia.html            # Tela de config. da IA
├── configuracoes-ia-style.css       # Estilos da config. da IA
├── configuracoes-ia-script.js       # Lógica da config. da IA
├── icons/                           # Ícones da extensão
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md                        # Este arquivo
```

## 🚀 Como Instalar

### 1. Preparar os Arquivos

1. Crie uma pasta chamada `vendai` no seu computador
2. Copie todos os arquivos HTML, CSS e JS para esta pasta
3. Crie uma subpasta chamada `icons` e adicione os ícones da extensão

### 2. Criar Ícones

Você precisa criar 4 ícones PNG com os seguintes tamanhos:
- `icon16.png` (16x16 pixels)
- `icon32.png` (32x32 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

**Dica**: Use uma ferramenta online como [Favicon.io](https://favicon.io/) ou [RealFaviconGenerator](https://realfavicongenerator.net/) para gerar os ícones.

### 3. Carregar no Chrome

1. Abra o Chrome e digite na barra de endereços: `chrome://extensions/`
2. Ative o **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `vendai` que você criou
5. A extensão será instalada e aparecerá na barra de ferramentas

## 🎯 Como Usar

### Primeira Configuração

1. Após instalar, clique no ícone da extensão
2. Faça login com sua conta Google ou crie uma conta
3. Configure as preferências em **Configurações da IA**
4. Adicione a descrição do seu produto/serviço

### Durante uma Videochamada

1. Entre em uma reunião no Google Meet, Zoom ou Teams
2. Clique no ícone da extensão ou use o botão flutuante
3. Escolha uma das opções:
   - **Insights**: Ver análises em tempo real
   - **Chat**: Conversar com a IA
   - **Configurações**: Ajustar preferências
   - **Config. da IA**: Personalizar o assistente

### Atalhos de Teclado

- `Alt + V`: Abrir insights
- `Alt + C`: Abrir chat
- `Esc`: Fechar painel atual
- `Ctrl/Cmd + S`: Salvar configurações (quando em tela de config)

## 🔧 Integração com Backend

Todos os pontos de integração com backend/IA estão comentados no código. Procure por:

```javascript
// ==========================================
// 🔴 BACKEND: Descrição da integração
// ==========================================
```

### APIs Necessárias

1. **Autenticação**: Login/logout de usuários
2. **Transcrição**: Converter áudio em texto (Whisper, Google Speech-to-Text, etc)
3. **IA**: Análise de texto e geração de insights (OpenAI, Anthropic Claude, etc)
4. **WebSocket**: Comunicação em tempo real
5. **Storage**: Salvar configurações e histórico

### Exemplo de Fluxo

```
1. Usuário inicia reunião
2. Extensão captura áudio → POST /transcribe
3. Backend transcreve → Retorna texto
4. Texto enviado para IA → POST /ai/analyze
5. IA retorna insights → WebSocket envia para frontend
6. Frontend exibe insights em tempo real
```

## 🛠️ Desenvolvimento

### Testar Localmente

1. Faça alterações nos arquivos
2. Volte em `chrome://extensions/`
3. Clique no botão de atualizar (🔄) na extensão VendAI
4. Recarregue a página da videochamada

### Debug

- Clique com botão direito no ícone da extensão → **Inspecionar**
- Isso abrirá o DevTools para o popup
- Para debugar o content script, abra o DevTools na página da videochamada

### Logs

Os logs aparecem em diferentes lugares:
- **Popup**: DevTools do popup
- **Content Script**: DevTools da página
- **Background**: `chrome://extensions/` → Clique em "service worker"

## 📦 Publicar na Chrome Web Store

1. Crie uma conta de desenvolvedor no [Chrome Web Store](https://chrome.google.com/webstore/devconsole/)
2. Pague a taxa única de $5
3. Compacte a pasta `vendai` em um arquivo ZIP
4. Faça upload do ZIP
5. Preencha as informações (nome, descrição, screenshots)
6. Envie para revisão

## 🔒 Permissões

A extensão solicita as seguintes permissões:

- `activeTab`: Interagir com a aba ativa
- `storage`: Salvar configurações localmente
- `tabs`: Detectar mudanças de URL
- `scripting`: Injetar scripts nas páginas

## ⚠️ Notas Importantes

1. **Áudio**: A captura de áudio de videochamadas pode ter limitações por políticas de segurança do navegador
2. **HTTPS**: Todas as chamadas de API devem usar HTTPS
3. **Privacidade**: Implemente criptografia para dados sensíveis
4. **GDPR**: Esteja em conformidade com leis de proteção de dados

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato: suporte@vendai.com

## 🎉 Roadmap

- [ ] Suporte para mais plataformas de videochamada
- [ ] Integração com CRMs (Salesforce, HubSpot)
- [ ] Gravação e transcrição de reuniões
- [ ] Análise pós-reunião com relatórios
- [ ] Suporte multilíngue
- [ ] App mobile

---

Desenvolvido com ❤️ para vendedores que querem vender mais
