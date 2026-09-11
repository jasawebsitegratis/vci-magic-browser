/**
 * VCI Magic Browser - Enhanced Preload Script
 * Secure bridge with performance monitoring and anti-detect support
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // ============ AUTHENTICATION ============
  authenticate: (password) => ipcRenderer.invoke('authenticate', password),
  isAuthenticated: () => ipcRenderer.invoke('is-authenticated'),

  // ============ GROUP MANAGEMENT ============
  saveGroups: (groups) => ipcRenderer.invoke('save-groups', groups),
  loadGroups: () => ipcRenderer.invoke('load-groups'),

  // ============ SESSION MANAGEMENT ============
  saveSessions: (sessions) => ipcRenderer.invoke('save-sessions', sessions),
  loadSessions: () => ipcRenderer.invoke('load-sessions'),

  // ============ DOWNLOAD SETTINGS ============
  selectDownloadDirectory: () => ipcRenderer.invoke('select-download-directory'),
  setDownloadPath: (downloadPath) => ipcRenderer.invoke('set-download-path', downloadPath),
  getConfig: () => ipcRenderer.invoke('get-config'),

  // ============ PERFORMANCE MONITORING ============
  getPerformanceStats: () => ipcRenderer.invoke('get-performance-stats'),

  // ============ ANTI-DETECT FEATURES ============
  getFingerprint: (sessionId) => ipcRenderer.invoke('get-fingerprint', sessionId),
  generateFingerprint: (sessionId) => ipcRenderer.invoke('generate-fingerprint', sessionId),

  // ============ COOKIE MANAGEMENT ============
  saveCookies: (sessionId, cookies) => ipcRenderer.invoke('save-cookies', sessionId, cookies),
  loadCookies: (sessionId) => ipcRenderer.invoke('load-cookies', sessionId),
  clearCookies: (sessionId) => ipcRenderer.invoke('clear-cookies', sessionId),
  exportCookies: (sessionId, path) => ipcRenderer.invoke('export-cookies', sessionId, path),
  importCookies: (sessionId, path) => ipcRenderer.invoke('import-cookies', sessionId, path),

  // ============ SESSION EXPORT/IMPORT ============
  exportSession: (sessionId) => ipcRenderer.invoke('export-session', sessionId),
  importSession: (data) => ipcRenderer.invoke('import-session', data),

  // ============ UPDATE CHECKING ============
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),

  // ============ SYSTEM INFO ============
  platform: process.platform,
  nodeVersion: process.version,
  chromeVersion: process.versions.chrome,
  electronVersion: process.versions.electron
});
