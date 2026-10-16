import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  const indexPath = path.join(__dirname, '..', 'index.html');
  mainWindow.loadFile(indexPath);

  // Mirror renderer console output to the main process (handy for debugging).
  mainWindow.webContents.on('console-message', (event, level, message) => {
    const levels = ['LOG', 'WARN', 'ERROR', 'INFO'];
    console.log(`[RENDERER ${levels[level] || level}] ${message}`);
  });

  // Open DevTools automatically in dev mode (npm run dev).
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
