#!/usr/bin/env node

/**
 * VCI Magic Browser - CLI Helper
 * Utility script untuk development dan debugging
 */

const fs = require('fs');
const path = require('path');

const command = process.argv[2];
const args = process.argv.slice(3);

const commands = {
  help: () => {
    console.log(`
VCI Magic Browser - CLI Helper\n`);
    console.log('Usage: node cli.js [command] [options]\n');
    console.log('Commands:');
    console.log('  help              Show this help message');
    console.log('  version           Show version info');
    console.log('  check-deps        Check dependencies');
    console.log('  clear-data        Clear user data');
    console.log('  reset-password    Reset password (for demo)');
    console.log('  gen-icons         Generate app icons');
    console.log('  setup             First time setup');
    console.log('');
  },

  version: () => {
    const pkg = require('../package.json');
    console.log(`\nVCI Magic Browser v${pkg.version}`);
    console.log(`Author: ${pkg.author}`);
    console.log(`Homepage: ${pkg.homepage}\n`);
  },

  'check-deps': () => {
    console.log('\nChecking dependencies...\n');
    const pkg = require('../package.json');
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    Object.entries(deps).forEach(([name, version]) => {
      try {
        require.resolve(name);
        console.log(`✅ ${name}@${version}`);
      } catch {
        console.log(`❌ ${name}@${version} (NOT INSTALLED)`);
      }
    });
    console.log('');
  },

  'clear-data': () => {
    const dataPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'vci-magic-browser-data');
    if (fs.existsSync(dataPath)) {
      fs.rmSync(dataPath, { recursive: true, force: true });
      console.log(`\n✅ Cleared data: ${dataPath}\n`);
    } else {
      console.log(`\n⚠️  Data folder not found: ${dataPath}\n`);
    }
  },

  'reset-password': () => {
    console.log('\n⚠️  Password reset is locked for security reasons!');
    console.log('Default password: jasaSEOterdekat.com\n');
  },

  'gen-icons': () => {
    console.log('\n🎨 Generating icons...');
    console.log('⚠️  This requires ImageMagick or GraphicsMagick');
    console.log('For now, use online tools:');
    console.log('  - https://convertio.co/png-ico/');
    console.log('  - https://icoconvert.com/\n');
  },

  setup: () => {
    console.log('\n🚀 VCI Magic Browser - First Time Setup\n');
    console.log('1. Install dependencies:');
    console.log('   npm install\n');
    console.log('2. Start development:');
    console.log('   npm start\n');
    console.log('3. Build for production:');
    console.log('   npm run build\n');
    console.log('For more info, see README.md');
    console.log('Documentation: https://jasaSEOterdekat.com\n');
  }
};

if (commands[command]) {
  commands[command]();
} else if (command) {
  console.log(`\n❌ Unknown command: ${command}\n`);
  commands.help();
} else {
  commands.help();
}
