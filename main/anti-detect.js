/**
 * VCI Magic Browser - Anti-Detect Module
 * Browser fingerprinting protection (foundation)
 */

const { ipcMain, BrowserWindow } = require('electron');

class AntiDetectBrowser {
  constructor() {
    this.fingerprints = new Map();
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ];
  }

  /**
   * Generate unique fingerprint per session
   */
  generateFingerprint(sessionId) {
    const fingerprint = {
      sessionId,
      userAgent: this.userAgents[Math.floor(Math.random() * this.userAgents.length)],
      webGL: this.generateWebGLVendor(),
      timezone: this.getRandomTimezone(),
      language: this.getRandomLanguage(),
      platform: this.getRandomPlatform(),
      hardwareConcurrency: Math.floor(Math.random() * (8 - 2 + 1)) + 2,
      deviceMemory: [4, 8, 16, 32][Math.floor(Math.random() * 4)],
      screenResolution: this.getRandomResolution(),
      colorDepth: [24, 32][Math.floor(Math.random() * 2)],
      createdAt: new Date().toISOString()
    };

    this.fingerprints.set(sessionId, fingerprint);
    return fingerprint;
  }

  getFingerprint(sessionId) {
    if (!this.fingerprints.has(sessionId)) {
      return this.generateFingerprint(sessionId);
    }
    return this.fingerprints.get(sessionId);
  }

  generateWebGLVendor() {
    const vendors = ['Google', 'Apple', 'Mozilla', 'Intel'];
    return vendors[Math.floor(Math.random() * vendors.length)];
  }

  getRandomTimezone() {
    const timezones = [
      'America/New_York',
      'America/Chicago',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Asia/Hong_Kong',
      'Australia/Sydney'
    ];
    return timezones[Math.floor(Math.random() * timezones.length)];
  }

  getRandomLanguage() {
    const languages = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'];
    return languages[Math.floor(Math.random() * languages.length)];
  }

  getRandomPlatform() {
    const platforms = ['Win32', 'MacIntel', 'Linux x86_64'];
    return platforms[Math.floor(Math.random() * platforms.length)];
  }

  getRandomResolution() {
    const resolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 2560, height: 1440 },
      { width: 1280, height: 720 }
    ];
    return resolutions[Math.floor(Math.random() * resolutions.length)];
  }

  /**
   * Inject anti-detection scripts into webview
   */
  getInjectionScript(fingerprint) {
    return `
    (() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () => '${fingerprint.userAgent}'
      });
      Object.defineProperty(navigator, 'platform', {
        get: () => '${fingerprint.platform}'
      });
      Object.defineProperty(navigator, 'language', {
        get: () => '${fingerprint.language}'
      });
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => ${fingerprint.hardwareConcurrency}
      });
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => ${fingerprint.deviceMemory}
      });
      Object.defineProperty(screen, 'width', {
        get: () => ${fingerprint.screenResolution.width}
      });
      Object.defineProperty(screen, 'height', {
        get: () => ${fingerprint.screenResolution.height}
      });
      Object.defineProperty(screen, 'colorDepth', {
        get: () => ${fingerprint.colorDepth}
      });
    })();
    `;
  }

  removeFingerprint(sessionId) {
    this.fingerprints.delete(sessionId);
  }
}

const antiDetect = new AntiDetectBrowser();

ipcMain.handle('get-fingerprint', (event, sessionId) => {
  return antiDetect.getFingerprint(sessionId);
});

ipcMain.handle('generate-fingerprint', (event, sessionId) => {
  return antiDetect.generateFingerprint(sessionId);
});

module.exports = { AntiDetectBrowser, antiDetect };
