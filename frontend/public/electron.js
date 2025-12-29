const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { fork, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let mainWindow;
let backendProcess;
let backendLogStream;

function checkInternet(callback) {
  http.get('http://clients3.google.com/generate_204', (res) => {
    callback(res.statusCode === 204);
  }).on('error', () => {
    callback(false);
  });
}

function waitForBackendReady(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      http.get(url, (res) => {
        if (res.statusCode === 200) return resolve();
        if (Date.now() - start > timeout) return reject(new Error('Backend not ready'));
        setTimeout(check, 500);
      }).on('error', (err) => {
        if (Date.now() - start > timeout) return reject(new Error('Backend not ready: ' + err.message));
        setTimeout(check, 500);
      });
    }
    check();
  });
}

function getBackendPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend', 'main.js');
  } else {
    return path.join(__dirname, '../../backend/dist/main.js');
  }
}

function startBackend() {
  const script = getBackendPath();
  if (!fs.existsSync(script)) {
    dialog.showErrorBox('Ошибка', 'Backend не найден: ' + script);
    throw new Error('Backend not found: ' + script);
  }
  const logPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend.log')
    : path.join(__dirname, '../../backend/backend.log');
  backendLogStream = fs.createWriteStream(logPath, { flags: 'a' });
  if (app.isPackaged) {
    const nodePath = path.join(process.resourcesPath, 'node.exe');
    backendProcess = spawn(nodePath, [script], {
      env: { ...process.env, PORT: 3000 },
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } else {
    backendProcess = fork(script, [], {
      env: { ...process.env, PORT: 3000 },
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
  }
  backendProcess.stdout.on('data', (data) => {
    const msg = `Backend: ${data}`;
    console.log(msg);
    backendLogStream.write(msg);
    if (mainWindow) mainWindow.webContents.send('backend-log', msg);
  });
  backendProcess.stderr.on('data', (data) => {
    const msg = `Backend Error: ${data}`;
    console.error(msg);
    backendLogStream.write(msg);
    if (mainWindow) mainWindow.webContents.send('backend-log', msg);
  });
  backendProcess.on('exit', (code, signal) => {
    const msg = `Backend exited with code ${code}, signal ${signal}\n`;
    backendLogStream.write(msg);
    if (mainWindow) mainWindow.webContents.send('backend-log', msg);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../assets/icon.ico'),
    title: 'E-ZANAMA',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  mainWindow.setMenu(null);

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(startUrl);

  ipcMain.on('check-online', (event) => {
    checkInternet((isOnline) => {
      event.reply('online-status', isOnline);
    });
  });
  // Показываем логи backend в окне (можно сделать отдельную вкладку или popup)
  ipcMain.on('get-backend-log', (event) => {
    const logPath = app.isPackaged
      ? path.join(process.resourcesPath, 'backend.log')
      : path.join(__dirname, '../../backend/backend.log');
    if (fs.existsSync(logPath)) {
      event.reply('backend-log', fs.readFileSync(logPath, 'utf8'));
    } else {
      event.reply('backend-log', 'Лог backend не найден');
    }
  });
}

app.whenReady().then(async () => {
  try {
    startBackend();
    await waitForBackendReady('http://localhost:3000/api/health');
    createWindow();
  } catch (e) {
    dialog.showErrorBox('Ошибка запуска backend', e.message);
    if (backendLogStream) backendLogStream.write('Backend start error: ' + e.message + '\n');
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (backendLogStream) {
    backendLogStream.end();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});