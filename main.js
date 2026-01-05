
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 850,
    minWidth: 550,
    minHeight: 800,
    title: "Winamp Radio Wave",
    icon: path.join(__dirname, 'icon.ico'), // Assurez-vous d'avoir une icône
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // On peut rendre la fenêtre sans cadre pour un look encore plus Winamp
    // frame: false, 
    backgroundColor: '#0f172a',
    autoHideMenuBar: true // Cache la barre de menu Alt
  });

  // En développement, on charge l'URL locale, en production le fichier index.html
  const startUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, 'index.html')}`;

  win.loadURL(startUrl);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
