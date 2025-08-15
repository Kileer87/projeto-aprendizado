const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Cria a janela do navegador.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // __dirname aponta para a raiz do projeto
      // Isso é importante para que seus outros scripts (common.js, etc.) funcionem
      preload: path.join(__dirname, 'preload.js'), // Opcional, mas boa prática
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // e carrega o index.html do seu aplicativo.
  mainWindow.loadFile('index.html');

  // Abre as Ferramentas de Desenvolvedor (opcional, bom para depuração).
  // mainWindow.webContents.openDevTools();
}

// Este método será chamado quando o Electron tiver finalizado
// a inicialização e estiver pronto para criar janelas do navegador.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // No macOS, é comum recriar uma janela no aplicativo quando o
    // ícone do dock é clicado e não há outras janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Encerra o aplicativo quando todas as janelas forem fechadas, exceto no macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});