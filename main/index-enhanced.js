/**
 * VCI Magic Browser - Enhanced Main Process
 * Complete integration of all advanced features
 */

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import modules
const SessionManager = require('./session-manager');
const { PerformanceOptimizer } = require('./optimizer');
const UpdateManager = require('./update-manager');
const CookieManager = require('./cookie-manager');
const { antiDetect } = require('./anti-detect');

// Constants
const isDev = process.env.NODE_ENV === 'development';
const appDataPath = path.join(app.getPath('userData'), 'vci-magic-browser-data');
const DEFAULT_PASSWORD = 'jasaSEOterdekat.com';
const APP_VERSION = require('../package.json').version;

// Initialize modules
const sessionManager = new SessionManager(appDataPath);
const performanceOptimizer = new PerformanceOptimizer();
const updateManager = new UpdateManager(APP_VERSION);
const cookieManager = new CookieManager(appDataPath);

// Ensure app data directory exists
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

let mainWindow;
let isAuthenticated = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload-enhanced.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true
    },
    icon: path.join(__dirname, '../assets/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ============ AUTHENTICATION ============
ipcMain.handle('authenticate', async (event, password) => {
  if (password === DEFAULT_PASSWORD) {
    isAuthenticated = true;
    return { success: true, message: 'Authentication successful' };
  }
  return { success: false, message: 'Invalid password' };
});

ipcMain.handle('is-authenticated', async () => {
  return isAuthenticated;
});

// ============ GROUP MANAGEMENT ============
ipcMain.handle('save-groups', async (event, groups) => {
  return sessionManager.saveGroups(groups) ? { success: true } : { success: false };
});

ipcMain.handle('load-groups', async () => {
  try {
    const groups = sessionManager.loadGroups();
    return { success: true, groups };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ============ SESSION MANAGEMENT ============
ipcMain.handle('save-sessions', async (event, sessions) => {
  return sessionManager.saveSessions(sessions) ? { success: true } : { success: false };
});

ipcMain.handle('load-sessions', async () => {
  try {
    const sessions = sessionManager.loadSessions();
    return { success: true, sessions };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-session', async (event, sessionId) => {
  return sessionManager.exportSession(sessionId);
});

ipcMain.handle('import-session', async (event, sessionData) => {
  return sessionManager.importSession(sessionData);
});

// ============ DOWNLOAD MANAGEMENT ============
ipcMain.handle('select-download-directory', async () => {
  return await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    defaultPath: path.join(appDataPath, 'downloads')
  });
});

ipcMain.handle('set-download-path', async (event, downloadPath) => {
  try {
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }
    let config = sessionManager.loadConfig();
    config.downloadPath = downloadPath;
    sessionManager.saveConfig(config);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-config', async () => {
  try {
    const config = sessionManager.loadConfig();
    return { success: true, config };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ============ PERFORMANCE MONITORING ============
ipcMain.handle('get-performance-stats', async () => {
  return performanceOptimizer.getStats();
});

// ============ ANTI-DETECT FEATURES ============
ipcMain.handle('get-fingerprint', (event, sessionId) => {
  return antiDetect.getFingerprint(sessionId);
});

ipcMain.handle('generate-fingerprint', (event, sessionId) => {
  return antiDetect.generateFingerprint(sessionId);
});

// ============ COOKIE MANAGEMENT ============
ipcMain.handle('save-cookies', (event, sessionId, cookies) => {
  return cookieManager.saveCookies(sessionId, cookies);
});

ipcMain.handle('load-cookies', (event, sessionId) => {
  return cookieManager.loadCookies(sessionId);
});

ipcMain.handle('clear-cookies', (event, sessionId) => {
  return cookieManager.clearCookies(sessionId);
});

ipcMain.handle('export-cookies', (event, sessionId, exportPath) => {
  return cookieManager.exportCookies(sessionId, exportPath);
});

ipcMain.handle('import-cookies', (event, sessionId, importPath) => {
  return cookieManager.importCookies(sessionId, importPath);
});

// ============ UPDATE CHECKING ============
ipcMain.handle('check-for-updates', async () => {
  return await updateManager.checkForUpdates();
});

// ============ APP LIFECYCLE ============
app.on('ready', () => {
  createWindow();
  createMenu();
  performanceOptimizer.start();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ============ MENU ============
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = { appDataPath, APP_VERSION, sessionManager };
