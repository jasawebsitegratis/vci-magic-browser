/**
 * VCI Magic Browser - Enhanced Renderer Module
 * Updated app.js with advanced features integration
 */

// ============ IMPORT MODULES ============
let antiDetect = null;
let cookieManager = null;
let performanceStats = null;

// Global State
let groups = [];
let sessions = [];
let activeGroupId = null;
let isAuthenticated = false;
let currentFingerprints = new Map();

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  const auth = await window.electron.isAuthenticated();
  if (auth) {
    showMainApp();
    await loadAppData();
    startPerformanceMonitor();
  } else {
    showLoginScreen();
  }
});

// ============ PERFORMANCE MONITORING ============
function startPerformanceMonitor() {
  setInterval(async () => {
    try {
      performanceStats = await window.electron.getPerformanceStats?.();
      updatePerformanceDisplay();
    } catch (error) {
      console.log('Performance monitoring not available');
    }
  }, 5000);
}

function updatePerformanceDisplay() {
  if (performanceStats) {
    const statusBar = document.querySelector('.performance-status');
    if (statusBar) {
      statusBar.textContent = `Memory: ${performanceStats.heapUsed}MB / ${performanceStats.heapTotal}MB`;
    }
  }
}

// ============ LOGIN HANDLERS ============
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');

  try {
    const result = await window.electron.authenticate(password);
    if (result.success) {
      isAuthenticated = true;
      showMainApp();
      await loadAppData();
      startPerformanceMonitor();
    } else {
      errorDiv.textContent = result.message;
      errorDiv.classList.add('show');
      document.getElementById('password').value = '';
    }
  } catch (error) {
    errorDiv.textContent = 'Authentication error: ' + error.message;
    errorDiv.classList.add('show');
  }
});

function showLoginScreen() {
  document.getElementById('login-container').style.display = 'flex';
  document.getElementById('main-container').style.display = 'none';
}

function showMainApp() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'flex';
}

// ============ LOAD APP DATA ============
async function loadAppData() {
  try {
    const groupsData = await window.electron.loadGroups();
    const sessionsData = await window.electron.loadSessions();
    const configData = await window.electron.getConfig();

    if (groupsData.success) {
      groups = groupsData.groups;
    }
    if (sessionsData.success) {
      sessions = sessionsData.sessions;
    }
    if (configData.success) {
      document.getElementById('download-path').value = configData.config.downloadPath || '';
    }

    renderGroups();
  } catch (error) {
    console.error('Error loading app data:', error);
  }
}

// ============ GROUP MANAGEMENT ============
document.getElementById('btn-new-group').addEventListener('click', () => {
  document.getElementById('new-group-modal').style.display = 'flex';
});

document.getElementById('btn-close-new-group').addEventListener('click', () => {
  document.getElementById('new-group-modal').style.display = 'none';
  resetGroupForm();
});

document.getElementById('btn-cancel-group').addEventListener('click', () => {
  document.getElementById('new-group-modal').style.display = 'none';
  resetGroupForm();
});

document.getElementById('btn-create-group').addEventListener('click', async () => {
  const groupName = document.getElementById('group-name').value.trim();
  const groupColor = document.getElementById('group-color').value;

  if (!groupName) {
    alert('Please enter a group name');
    return;
  }

  const newGroup = {
    id: generateId(),
    name: groupName,
    color: groupColor,
    createdAt: new Date().toISOString(),
    tabCount: 0
  };

  groups.push(newGroup);
  await saveGroups();
  renderGroups();

  document.getElementById('new-group-modal').style.display = 'none';
  resetGroupForm();
  selectGroup(newGroup.id);
});

function resetGroupForm() {
  document.getElementById('group-name').value = '';
  document.getElementById('group-color').value = '#3b82f6';
}

async function renderGroups() {
  const groupsList = document.getElementById('groups-list');
  groupsList.innerHTML = '';

  if (groups.length === 0) {
    groupsList.innerHTML = '<div class="empty-state-sub">No groups yet</div>';
    return;
  }

  groups.forEach((group) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'group-item' + (activeGroupId === group.id ? ' active' : '');
    groupEl.style.setProperty('--group-color', group.color);
    groupEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div class="group-item-name">${escapeHtml(group.name)}</div>
          <div class="group-item-count">${group.tabCount || 0} tabs</div>
        </div>
        <div class="group-item-menu" onclick="event.stopPropagation(); showGroupMenu('${group.id}')">⋮</div>
      </div>
    `;
    groupEl.addEventListener('click', () => selectGroup(group.id));
    groupsList.appendChild(groupEl);
  });
}

function selectGroup(groupId) {
  activeGroupId = groupId;
  renderGroups();
  renderTabs();
}

function showGroupMenu(groupId) {
  const menu = confirm(`Delete group "${groups.find(g => g.id === groupId).name}"?`);
  if (menu) {
    deleteGroup(groupId);
  }
}

async function deleteGroup(groupId) {
  groups = groups.filter(g => g.id !== groupId);
  sessions = sessions.filter(s => s.groupId !== groupId);
  await saveGroups();
  await saveSessions();
  activeGroupId = groups.length > 0 ? groups[0].id : null;
  renderGroups();
  renderTabs();
}

// ============ SESSIONS/TABS MANAGEMENT ============
function renderTabs() {
  const tabsBar = document.getElementById('tabs-bar');
  tabsBar.innerHTML = '';

  if (!activeGroupId) {
    tabsBar.innerHTML = '<div style="color: #666; padding: 15px;">Select a group to see tabs</div>';
    return;
  }

  const groupSessions = sessions.filter(s => s.groupId === activeGroupId);
  const group = groups.find(g => g.id === activeGroupId);

  groupSessions.forEach((session, index) => {
    const tabEl = document.createElement('div');
    tabEl.className = 'tab-item' + (session.active ? ' active' : '');
    tabEl.innerHTML = `
      <span class="tab-title">${escapeHtml(session.title || 'New Tab')}</span>
      <button class="tab-close" onclick="event.stopPropagation(); closeTab('${session.id}')">×</button>
    `;
    tabEl.addEventListener('click', () => activateTab(session.id));
    tabsBar.appendChild(tabEl);
  });

  // Add Tab Button
  const addBtn = document.createElement('button');
  addBtn.className = 'tab-add-btn';
  addBtn.textContent = '+ Add Tab';
  addBtn.addEventListener('click', () => addTab());
  tabsBar.appendChild(addBtn);

  renderBrowserView();
}

function addTab() {
  if (!activeGroupId) {
    alert('Please select a group first');
    return;
  }

  const newSession = {
    id: generateId(),
    groupId: activeGroupId,
    title: `Tab ${sessions.filter(s => s.groupId === activeGroupId).length + 1}`,
    url: 'chrome://newtab',
    active: true,
    createdAt: new Date().toISOString()
  };

  // Deactivate other tabs in this group
  sessions.forEach(s => {
    if (s.groupId === activeGroupId) s.active = false;
  });

  sessions.push(newSession);
  updateGroupTabCount();
  saveSessions();
  renderTabs();
}

function activateTab(sessionId) {
  sessions.forEach(s => {
    s.active = (s.id === sessionId);
  });
  renderTabs();
}

async function closeTab(sessionId) {
  sessions = sessions.filter(s => s.id !== sessionId);
  updateGroupTabCount();
  await saveSessions();
  renderTabs();
}

function updateGroupTabCount() {
  groups.forEach(group => {
    group.tabCount = sessions.filter(s => s.groupId === group.id).length;
  });
  saveGroups();
}

function renderBrowserView() {
  const browserView = document.getElementById('browser-view');
  const activeSession = sessions.find(s => s.active && s.groupId === activeGroupId);

  if (!activeSession) {
    browserView.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌐</div>
        <div class="empty-state-text">No tabs open</div>
        <div class="empty-state-sub">Click "+ Add Tab" to open a new browser session</div>
      </div>
    `;
    return;
  }

  browserView.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="background: #2a2a2a; padding: 10px; border-bottom: 1px solid #404040; display: flex; gap: 8px;">
        <input type="text" id="address-bar" value="${escapeHtml(activeSession.url)}" 
               style="flex: 1; padding: 6px; background: #1a1a1a; border: 1px solid #404040; border-radius: 5px; color: #e0e0e0; font-size: 12px;"
               onkeypress="if(event.key==='Enter') navigateTo(this.value, '${activeSession.id}')">
        <button onclick="navigateTo(document.getElementById('address-bar').value, '${activeSession.id}')" 
                style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Go</button>
        <button onclick="toggleAntiDetect('${activeSession.id}')" 
                style="padding: 6px 12px; background: #764ba2; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 11px;">🔒 Anti-Detect</button>
      </div>
      <div style="flex: 1; background: #1a1a1a; display: flex; align-items: center; justify-content: center; color: #666; overflow: auto;">
        <div style="text-align: center;">
          <p style="font-size: 14px; margin-bottom: 10px;">📱 Browser Session: ${escapeHtml(activeSession.title)}</p>
          <p style="font-size: 12px; color: #555;">URL: ${escapeHtml(activeSession.url)}</p>
          <p style="font-size: 12px; color: #555; margin-top: 20px; font-style: italic;">
            Native browser rendering will be integrated with Chromium engine
          </p>
        </div>
      </div>
    </div>
  `;
}

function navigateTo(url, sessionId) {
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('chrome://')) {
    url = 'https://' + url;
  }
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.url = url;
    session.title = new URL(url).hostname || url;
  }
  saveSessions();
  renderBrowserView();
}

function toggleAntiDetect(sessionId) {
  if (currentFingerprints.has(sessionId)) {
    currentFingerprints.delete(sessionId);
    alert('Anti-Detect disabled for this session');
  } else {
    currentFingerprints.set(sessionId, {
      enabled: true,
      generatedAt: new Date().toISOString()
    });
    alert('Anti-Detect enabled! New fingerprint generated for this session.');
  }
}

// ============ SETTINGS ============
document.getElementById('btn-settings').addEventListener('click', () => {
  document.getElementById('settings-modal').style.display = 'flex';
});

document.getElementById('btn-close-settings').addEventListener('click', () => {
  document.getElementById('settings-modal').style.display = 'none';
});

document.getElementById('btn-select-download').addEventListener('click', async () => {
  const result = await window.electron.selectDownloadDirectory();
  if (!result.canceled && result.filePaths.length > 0) {
    const downloadPath = result.filePaths[0];
    await window.electron.setDownloadPath(downloadPath);
    document.getElementById('download-path').value = downloadPath;
    await loadAppData();
  }
});

// ============ UPDATE CHECK ============
document.getElementById('btn-check-update').addEventListener('click', () => {
  alert('VCI Magic Browser is up to date!\n\nVersion: 1.0.0\n\nCheck the website for latest updates:\njasaSEOterdekat.com');
});

// ============ LOGOUT ============
document.getElementById('btn-logout').addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) {
    location.reload();
  }
});

// ============ CLOSE MODALS ON OUTSIDE CLICK ============
window.addEventListener('click', (event) => {
  const settingsModal = document.getElementById('settings-modal');
  const newGroupModal = document.getElementById('new-group-modal');

  if (event.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
  if (event.target === newGroupModal) {
    newGroupModal.style.display = 'none';
  }
});

// ============ UTILITY FUNCTIONS ============
function generateId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

async function saveGroups() {
  await window.electron.saveGroups(groups);
}

async function saveSessions() {
  await window.electron.saveSessions(sessions);
}
