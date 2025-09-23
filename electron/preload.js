const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemplo de API segura para comunicação com o processo principal
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Informações sobre a aplicação
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Eventos do sistema
  onAppReady: (callback) => ipcRenderer.on('app-ready', callback),
});

// Desabilitar node integration por segurança
window.addEventListener('DOMContentLoaded', () => {
  // Remover referências globais perigosas
  delete window.require;
  delete window.exports;
  delete window.module;
});
