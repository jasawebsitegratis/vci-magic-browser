/**
 * VCI Magic Browser - Development Guide
 * Comprehensive guide for developers contributing to the project
 */

# Developer Guide

## Project Architecture

### Main Process (`main/`)
- **index.js** - Electron app entry point, window management, IPC handlers
- **optimizer.js** - Performance monitoring and auto-balancing
- **session-manager.js** - Data persistence and backup
- **update-manager.js** - Version checking and update logic
- **anti-detect.js** - Browser fingerprinting protection
- **cookie-manager.js** - Cookie storage and management

### Preload Script (`preload/`)
- **preload.js** - Secure context bridge between renderer and main process

### Renderer Process (`renderer/`)
- **index.html** - Main UI structure
- **app.js** - Frontend logic and state management
- **app-enhanced.js** - Enhanced version with advanced features
- **styles.css** - Styling and responsive design

## Technology Stack

- **Electron 14+** - Desktop application framework
- **Node.js 14+** - Server-side runtime
- **Chromium** - Browser engine
- **Vanilla JavaScript** - No frameworks, pure JS
- **Electron Builder** - Build and package application

## Setting Up Development Environment

### Prerequisites
```bash
# Node.js 14 or higher
node --version

# npm 6 or higher
npm --version
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/jasawebsitegratis/vci-magic-browser.git
cd vci-magic-browser

# Install dependencies
npm install

# Start development server
npm start

# Or with auto-reload
npm run dev
```

## Project Structure Deep Dive

### Directory Tree
```
vci-magic-browser/
├── main/                          # Electron main process
│   ├── index.js                  # App entry point
│   ├── optimizer.js              # Performance optimization
│   ├── session-manager.js        # Data management
│   ├── update-manager.js         # Update checking
│   ├── anti-detect.js            # Anti-detection features
│   └── cookie-manager.js         # Cookie handling
│
├── preload/                       # Preload scripts
│   └── preload.js                # Context bridge
│
├── renderer/                      # Renderer process (UI)
│   ├── index.html                # Main HTML
│   ├── app.js                    # Basic logic
│   ├── app-enhanced.js           # Advanced features
│   └── styles.css                # Styling
│
├── scripts/                       # Utility scripts
│   └── cli.js                    # CLI helper
│
├── assets/                        # App resources
│   ├── icon.png                  # App icon
│   └── icon.ico                  # Windows icon
│
├── package.json                   # Project manifest
├── run.bat                        # Windows build script
├── run.sh                         # Unix build script
├── README.md                      # Documentation
├── INSTALL.md                     # Installation guide
├── CONTRIBUTING.md               # Contribution guidelines
├── CHANGELOG.md                  # Version history
└── LICENSE                        # MIT License
```

## Key Concepts

### 1. IPC Communication
Electron uses IPC (Inter-Process Communication) to communicate between main and renderer processes:

```javascript
// Main Process (main/index.js)
ipcMain.handle('save-groups', async (event, groups) => {
  // Handle save operation
  return { success: true };
});

// Renderer Process (renderer/app.js)
const result = await window.electron.saveGroups(groups);
```

### 2. Context Isolation
Security best practice - main and renderer processes are isolated:

```javascript
// preload.js bridges the gap securely
contextBridge.exposeInMainWorld('electron', {
  saveGroups: (groups) => ipcRenderer.invoke('save-groups', groups)
});
```

### 3. Persistent Storage
Data stored in JSON files within app data directory:

```
Windows:
C:\Users\[User]\AppData\Roaming\vci-magic-browser-data/
  ├── groups.json
  ├── sessions.json
  ├── config.json
  └── backups/

No server needed - all local!
```

### 4. State Management
Simple state stored in renderer global variables:

```javascript
let groups = [];      // All groups
let sessions = [];    // All sessions/tabs
let activeGroupId = null;  // Current group
```

## Building & Distribution

### Windows Build
```bash
# Portable executable (x64 + x86)
npm run build:portable

# Installer (x64 + x86)
npm run build

# Both versions
npm run build
```

### Output Files
- `dist/VCI-Magic-Browser-1.0.0-x64-portable.exe` - 64-bit portable
- `dist/VCI-Magic-Browser-1.0.0-ia32-portable.exe` - 32-bit portable
- `dist/VCI-Magic-Browser-1.0.0-x64-installer.exe` - 64-bit installer
- `dist/VCI-Magic-Browser-1.0.0-ia32-installer.exe` - 32-bit installer

## Common Development Tasks

### Adding a New Feature

1. **Create a new module** in `main/` if needed:
```javascript
// main/my-feature.js
class MyFeature {
  // Implementation
}

module.exports = MyFeature;
```

2. **Export IPC handler** in `main/index.js`:
```javascript
const MyFeature = require('./my-feature');
const myFeature = new MyFeature();

ipcMain.handle('my-feature-action', async (event, data) => {
  return myFeature.doSomething(data);
});
```

3. **Expose in preload** (`preload/preload.js`):
```javascript
contextBridge.exposeInMainWorld('electron', {
  myFeatureAction: (data) => ipcRenderer.invoke('my-feature-action', data)
});
```

4. **Use in renderer** (`renderer/app.js`):
```javascript
const result = await window.electron.myFeatureAction(data);
```

### Debugging

```bash
# Open DevTools in development
# Press: Ctrl+Shift+I or F12

# Enable detailed logging
DEBUG=* npm start

# Check renderer console
Ctrl+Shift+I > Console tab
```

### Performance Optimization

1. **Monitor memory usage**:
```javascript
const stats = await window.electron.getPerformanceStats();
console.log(stats.heapUsed); // Current heap usage
```

2. **Implement lazy loading** for tabs
3. **Use virtualization** for long lists
4. **Cache frequently accessed data**

## Testing

### Manual Testing Checklist
- [ ] Login with correct password
- [ ] Create new group
- [ ] Add tabs to group
- [ ] Switch between tabs
- [ ] Delete tab
- [ ] Delete group
- [ ] Download file
- [ ] Check update
- [ ] Change download directory
- [ ] Logout and re-login

## Code Style Guide

### JavaScript
```javascript
// Use const/let, not var
const myVar = 'value';

// Use camelCase
function myFunction() { }

// Use arrow functions
const handler = () => { };

// Use async/await
async function loadData() {
  const data = await fetchSomething();
}

// Comment complex logic
// This calculation determines the optimal memory threshold
const threshold = heapSize * 0.8;
```

### HTML/CSS
```html
<!-- Use semantic HTML -->
<button class="btn btn-primary">Click me</button>

<!-- Use kebab-case for classes -->
<div class="group-item"></div>
```

## Common Issues & Solutions

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Failed to extract asar"
```bash
# Clean build
rm -rf dist
npm run build
```

### "EACCES: permission denied"
```bash
# Run with elevated privileges
sudo npm run build
```

## Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Test portable version
- [ ] Test installer version
- [ ] Test on 32-bit system
- [ ] Test on 64-bit system
- [ ] Verify password protection works
- [ ] Verify data persistence
- [ ] Create GitHub release
- [ ] Upload build files

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Chromium Project](https://www.chromium.org/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Electron Builder](https://www.electron.build/)

## Getting Help

1. Check existing issues on GitHub
2. Join WhatsApp group: https://chat.whatsapp.com/Jdbm4TagXzKEvEELSLLogY
3. Contact: info@jasaSEOterdekat.com

---

**Happy Coding!** 🚀
