const { app, BrowserWindow, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let nextServer;

function createWindow() {
  // Criar a janela principal do aplicativo
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    show: false, // Não mostrar até estar pronto
    titleBarStyle: 'default',
    autoHideMenuBar: true,
  });

  // URL da aplicação Next.js
  const url = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../out/index.html')}`;

  // Carregar a aplicação
  if (isDev) {
    // Em desenvolvimento, aguardar o servidor Next.js estar pronto
    mainWindow.loadURL(url);
    
    // Abrir DevTools em desenvolvimento
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, carregar os arquivos estáticos
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focar na janela
    if (isDev) {
      mainWindow.focus();
    }
  });

  // Abrir links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Limpar referência quando a janela for fechada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startNextServer() {
  if (isDev) {
    // Em desenvolvimento, iniciar o servidor Next.js
    nextServer = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      shell: true
    });

    nextServer.stdout.on('data', (data) => {
      console.log(`Next.js: ${data}`);
    });

    nextServer.stderr.on('data', (data) => {
      console.error(`Next.js Error: ${data}`);
    });

    // Aguardar o servidor estar pronto antes de criar a janela
    setTimeout(createWindow, 5000);
  } else {
    // Em produção, criar a janela diretamente
    createWindow();
  }
}

// Este método será chamado quando o Electron terminar de inicializar
app.whenReady().then(() => {
  startNextServer();

  app.on('activate', () => {
    // No macOS, é comum recriar uma janela quando o ícone do dock é clicado
    // e não há outras janelas abertas
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Sair quando todas as janelas forem fechadas, exceto no macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Encerrar servidor Next.js se estiver rodando
    if (nextServer) {
      nextServer.kill();
    }
    app.quit();
  }
});

// Encerrar servidor Next.js quando a aplicação for fechada
app.on('before-quit', () => {
  if (nextServer) {
    nextServer.kill();
  }
});

// Definir o protocolo de segurança da aplicação
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    // Abrir links externos no navegador padrão
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
