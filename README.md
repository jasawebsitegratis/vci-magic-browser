# VCI Magic Browser

**Multi Session Browser dengan Grouping - Ringan, Cepat & Teroptimasi**

VCI Magic Browser adalah aplikasi browser modern berbasis Electron yang memungkinkan Anda membuka multiple session browser dalam satu aplikasi dengan fitur grouping yang powerful. Sempurna untuk social media marketing, SEO testing, dan productivity multi-akun!

## 🚀 Fitur Utama

- ✅ **Group Management** - Buat grup browser sessions dengan nama custom (misal: Facebook, Instagram, LinkedIn)
- ✅ **Unlimited Tabs** - Buka unlimited tabs dalam setiap group tanpa batas
- ✅ **Ringan & Teroptimasi** - Auto-balancing CPU/RAM, stabil bahkan dengan ratusan tab
- ✅ **Password Protected** - Aplikasi terkunci dengan password (default: `jasaSEOterdekat.com`)
- ✅ **Google Chrome Engine** - Menggunakan Chromium engine terbaru
- ✅ **Portable & Installer** - Tersedia dalam versi portable dan installer
- ✅ **Multi Platform** - Support Windows 32-bit & 64-bit
- ✅ **Download Manager** - Atur lokasi download dengan bebas
- ✅ **Auto Update** - Fitur update otomatis built-in
- ✅ **Full Chrome Features** - Semua fitur Chrome standar tersedia

## 📋 Requirements

- Windows 7/8/10/11 (32-bit atau 64-bit)
- Node.js 14+ (untuk development)
- 2GB RAM minimum (recommended 4GB+)
- 200MB disk space

## 🔧 Installation & Build

### Development Setup

```bash
# Clone repository
git clone https://github.com/jasawebsitegratis/vci-magic-browser.git
cd vci-magic-browser

# Install dependencies
npm install

# Run development
npm start
```

### Build untuk Production

#### Windows (.bat script):
```bash
run.bat
```

Pilih opsi:
1. **Portable Executable** - Tidak perlu install, bisa langsung jalankan
2. **Installer** - Install di `C:\Program Files\`, tidak bisa dipindah-pindah
3. **Build Both** - Buat kedua versi

#### macOS/Linux (.sh script):
```bash
chmod +x run.sh
./run.sh
```

### Manual Build Commands

```bash
# Build Portable (x64 + x86)
npm run build:portable

# Build Installer (x64 + x86)
npm run build

# Build keduanya
npm run build

# Development mode
npm run dev
```

Output files akan berada di folder `dist/`

## 🔐 Default Password

```
jasaSEOterdekat.com
```

⚠️ **Penting**: Password ini di-bundle dalam aplikasi dan **TIDAK BISA DIEDIT**! Password harus diketik dengan ejaan yang SAMA persis.

## 📱 Cara Penggunaan

### 1. Login
Masukkan password default: `jasaSEOterdekat.com`

### 2. Buat Group Baru
- Klik tombol **"+ New Group"** di top bar
- Masukkan nama group (misal: "Facebook", "Instagram", "LinkedIn")
- Pilih warna group (opsional)
- Klik "Create Group"

### 3. Tambah Tab dalam Group
- Pilih group yang ingin digunakan
- Klik tombol **"+ Add Tab"** di tabs bar
- Unlimited tabs bisa ditambahkan!

### 4. Browse & Manage
- Klik tab untuk switch antar session
- Ketik URL di address bar dan tekan Enter
- Klik **×** untuk close tab
- Klik **⋮** di group untuk delete group

### 5. Settings
- Klik tombol **"⚙️ Settings"** untuk manage download directory
- Custom lokasi penyimpanan download sesuai keinginan

### 6. Check Update
- Klik tombol **"🔄 Check Update"** untuk cek versi terbaru

## 📁 Struktur Folder Aplikasi

```
VCI Magic Browser/
├── main/
│   └── index.js              # Main Electron process
├── preload/
│   └── preload.js            # Security context bridge
├── renderer/
│   ├── index.html            # Main UI
│   ├── app.js                # Frontend logic
│   └── styles.css            # Styling
├── assets/
│   ├── icon.png              # App icon
│   └── icon.ico              # Windows icon
├── package.json              # Project config
├── run.bat                   # Windows build script
├── run.sh                    # Linux/Mac build script
└── dist/                     # Build output (auto-generated)
```

### Data Storage

Semua data aplikasi disimpan di:

**Windows Portable:**
```
AppFolder/vci-magic-browser-data/
├── groups.json              # Daftar groups
├── sessions.json            # Daftar sessions/tabs
└── config.json              # Konfigurasi aplikasi
```

**Windows Installer:**
```
C:\Users\[Username]\AppData\Roaming\vci-magic-browser-data/
├── groups.json
├── sessions.json
└── config.json
```

⚠️ **TIDAK ADA** penyimpanan di `C:\`, semua data tersimpan dalam folder aplikasi!

## 🔗 Links & Kontak

- 🌐 **Website**: [jasaSEOterdekat.com](https://jasaSEOterdekat.com)
- 💬 **Group WhatsApp VCI**: [Join Here](https://chat.whatsapp.com/Jdbm4TagXzKEvEELSLLogY)
- 📧 **Email**: info@jasaSEOterdekat.com

## 🔒 Security & Privacy

- Password di-hash dan tersimpan aman
- Semua data lokal, tidak dikirim ke server
- Menggunakan Chromium engine yang aman
- Context isolation untuk keamanan maksimal

## 📊 Performance Tips

1. **Untuk 100+ Tabs**: Gunakan multiple groups agar lebih terorganisir
2. **Reduce RAM Usage**: Minimize tabs yang tidak digunakan
3. **Storage**: Pastikan download directory punya space cukup
4. **Update**: Selalu check update untuk performance terbaru

## 🐛 Troubleshooting

### "Invalid Password"
- Pastikan password ditulis EXACT: `jasaSEOterdekat.com`
- Case-sensitive!

### "Failed to Load"
- Pastikan folder `vci-magic-browser-data` punya permission read/write
- Coba jalankan sebagai Administrator

### "High CPU Usage"
- Close beberapa tabs yang tidak perlu
- Restart aplikasi
- Check browser tabs yang sedang loading berat

### "Cannot Find Modules"
```bash
# Reinstall dependencies
npm install

# Clear cache
npm cache clean --force

# Rebuild
npm install
```

## 📝 Development

### Project Structure

```
vci-magic-browser/
├── .github/
│   └── workflows/            # CI/CD automation
├── main/                      # Electron main process
├── preload/                   # Preload scripts
├── renderer/                  # Frontend (HTML/CSS/JS)
├── assets/                    # Icons & resources
└── scripts/                   # Build & utility scripts
```

### Commands

```bash
npm start          # Start app
npm run dev        # Development mode
npm run build      # Build installer
npm run pack       # Test build tanpa signing
npm run dist       # Final distribution build
```

## 📜 License

MIT License - See LICENSE file

## 👥 Credits

**Developed by**: VCI (Vibe Coding Indonesia)

**Powered by**:
- [Electron](https://www.electronjs.org/)
- [Chromium](https://www.chromium.org/)
- [Electron Builder](https://www.electron.build/)

---

## 🎯 Roadmap

- ✅ Multi Session Grouping
- ✅ Password Protection
- ✅ Download Management
- 🔄 **Coming Soon:**
  - Proxy Support untuk Anti-Detect
  - User Agent Spoofing
  - Cookie Management
  - Session Export/Import
  - Multi-Language Support
  - Dark/Light Theme Toggle

---

## 📞 Support & Feedback

Jika ada pertanyaan atau feedback:
1. Kunjungi [jasaSEOterdekat.com](https://jasaSEOterdekat.com)
2. Join [Group WhatsApp VCI](https://chat.whatsapp.com/Jdbm4TagXzKEvEELSLLogY)
3. Buka issue di GitHub repository

---

**Made with ❤️ by VCI Team**

**Enjoy your Multi-Session Browsing Experience!** 🚀
