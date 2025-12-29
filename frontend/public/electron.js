const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let backendProcess;

function getBackendPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend', 'main.js');
  }
  return path.join(__dirname, '../../backend/dist/main.js');
}

function startBackend() {
  const script = getBackendPath();
  console.log('Запуск Backend из:', script);

  backendProcess = fork(script, [], {
    env: { ...process.env, PORT: 3000 },
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend Info]: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error]: ${data}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Не удалось запустить процесс Backend:', err);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});