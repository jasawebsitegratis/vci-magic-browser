/**
 * VCI Magic Browser - Session Manager
 * Handles browser sessions and persistence
 */

const fs = require('fs');
const path = require('path');

class SessionManager {
  constructor(dataPath) {
    this.dataPath = dataPath;
    this.groupsFile = path.join(dataPath, 'groups.json');
    this.sessionsFile = path.join(dataPath, 'sessions.json');
    this.configFile = path.join(dataPath, 'config.json');
    this.backupDir = path.join(dataPath, 'backups');

    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  loadGroups() {
    try {
      if (fs.existsSync(this.groupsFile)) {
        return JSON.parse(fs.readFileSync(this.groupsFile, 'utf-8'));
      }
      return [];
    } catch (error) {
      console.error('Error loading groups:', error);
      return [];
    }
  }

  saveGroups(groups) {
    try {
      this.createBackup('groups.json');
      fs.writeFileSync(this.groupsFile, JSON.stringify(groups, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving groups:', error);
      return false;
    }
  }

  loadSessions() {
    try {
      if (fs.existsSync(this.sessionsFile)) {
        return JSON.parse(fs.readFileSync(this.sessionsFile, 'utf-8'));
      }
      return [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  saveSessions(sessions) {
    try {
      this.createBackup('sessions.json');
      fs.writeFileSync(this.sessionsFile, JSON.stringify(sessions, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving sessions:', error);
      return false;
    }
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        return JSON.parse(fs.readFileSync(this.configFile, 'utf-8'));
      }
      return this.getDefaultConfig();
    } catch (error) {
      console.error('Error loading config:', error);
      return this.getDefaultConfig();
    }
  }

  saveConfig(config) {
    try {
      this.createBackup('config.json');
      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  }

  getDefaultConfig() {
    return {
      theme: 'dark',
      downloadPath: path.join(this.dataPath, 'downloads'),
      autoUpdate: true,
      lastUpdate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  createBackup(filename) {
    const sourcePath = path.join(this.dataPath, filename);
    if (fs.existsSync(sourcePath)) {
      const timestamp = new Date().getTime();
      const backupPath = path.join(this.backupDir, `${filename}.${timestamp}.backup`);
      fs.copyFileSync(sourcePath, backupPath);

      // Keep only last 10 backups
      this.cleanOldBackups(filename, 10);
    }
  }

  cleanOldBackups(filename, keep = 10) {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith(filename))
        .map(f => ({
          name: f,
          time: parseInt(f.match(/\.(\d+)\.backup/)[1])
        }))
        .sort((a, b) => b.time - a.time);

      files.slice(keep).forEach(file => {
        fs.unlinkSync(path.join(this.backupDir, file.name));
      });
    } catch (error) {
      console.warn('Error cleaning backups:', error);
    }
  }

  restoreFromBackup(filename) {
    try {
      const backupFiles = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith(filename))
        .sort()
        .reverse();

      if (backupFiles.length > 0) {
        const latestBackup = path.join(this.backupDir, backupFiles[0]);
        const targetPath = path.join(this.dataPath, filename);
        fs.copyFileSync(latestBackup, targetPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  exportSession(sessionId) {
    try {
      const sessions = this.loadSessions();
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        return JSON.stringify(session, null, 2);
      }
      return null;
    } catch (error) {
      console.error('Error exporting session:', error);
      return null;
    }
  }

  importSession(sessionData) {
    try {
      const session = JSON.parse(sessionData);
      const sessions = this.loadSessions();
      session.id = 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessions.push(session);
      this.saveSessions(sessions);
      return session.id;
    } catch (error) {
      console.error('Error importing session:', error);
      return null;
    }
  }
}

module.exports = SessionManager;
