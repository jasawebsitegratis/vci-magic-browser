/**
 * VCI Magic Browser - Cookie Manager
 * Handles cookie storage and management
 */

const fs = require('fs');
const path = require('path');

class CookieManager {
  constructor(dataPath) {
    this.cookiesDir = path.join(dataPath, 'cookies');
    this.ensureDir();
  }

  ensureDir() {
    if (!fs.existsSync(this.cookiesDir)) {
      fs.mkdirSync(this.cookiesDir, { recursive: true });
    }
  }

  /**
   * Save cookies for a session
   */
  saveCookies(sessionId, cookies) {
    try {
      const cookieFile = path.join(this.cookiesDir, `${sessionId}.json`);
      fs.writeFileSync(cookieFile, JSON.stringify(cookies, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving cookies:', error);
      return false;
    }
  }

  /**
   * Load cookies for a session
   */
  loadCookies(sessionId) {
    try {
      const cookieFile = path.join(this.cookiesDir, `${sessionId}.json`);
      if (fs.existsSync(cookieFile)) {
        return JSON.parse(fs.readFileSync(cookieFile, 'utf-8'));
      }
      return [];
    } catch (error) {
      console.error('Error loading cookies:', error);
      return [];
    }
  }

  /**
   * Clear cookies for a session
   */
  clearCookies(sessionId) {
    try {
      const cookieFile = path.join(this.cookiesDir, `${sessionId}.json`);
      if (fs.existsSync(cookieFile)) {
        fs.unlinkSync(cookieFile);
      }
      return true;
    } catch (error) {
      console.error('Error clearing cookies:', error);
      return false;
    }
  }

  /**
   * Export cookies to file
   */
  exportCookies(sessionId, exportPath) {
    try {
      const cookies = this.loadCookies(sessionId);
      fs.writeFileSync(exportPath, JSON.stringify(cookies, null, 2));
      return true;
    } catch (error) {
      console.error('Error exporting cookies:', error);
      return false;
    }
  }

  /**
   * Import cookies from file
   */
  importCookies(sessionId, importPath) {
    try {
      const data = fs.readFileSync(importPath, 'utf-8');
      const cookies = JSON.parse(data);
      this.saveCookies(sessionId, cookies);
      return true;
    } catch (error) {
      console.error('Error importing cookies:', error);
      return false;
    }
  }
}

module.exports = CookieManager;
