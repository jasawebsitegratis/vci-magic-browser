/**
 * VCI Magic Browser - Update Manager
 * Handles version checking and updates
 */

const { ipcMain } = require('electron');
const https = require('https');

class UpdateManager {
  constructor(currentVersion) {
    this.currentVersion = currentVersion;
    this.updateUrl = 'https://api.github.com/repos/jasawebsitegratis/vci-magic-browser/releases/latest';
  }

  async checkForUpdates() {
    return new Promise((resolve) => {
      https.get(this.updateUrl, {
        headers: { 'User-Agent': 'VCI-Magic-Browser' }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const release = JSON.parse(data);
            const latestVersion = release.tag_name.replace('v', '');
            const hasUpdate = this.compareVersions(latestVersion, this.currentVersion) > 0;
            resolve({
              hasUpdate,
              currentVersion: this.currentVersion,
              latestVersion,
              downloadUrl: release.assets[0]?.browser_download_url || release.html_url,
              releaseNotes: release.body
            });
          } catch (error) {
            resolve({
              hasUpdate: false,
              currentVersion: this.currentVersion,
              error: error.message
            });
          }
        });
      }).on('error', () => {
        resolve({
          hasUpdate: false,
          currentVersion: this.currentVersion,
          error: 'Failed to check for updates'
        });
      });
    });
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  }
}

module.exports = UpdateManager;
