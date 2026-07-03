# 📈 EduVesting — Platform Simulasi & Manajemen Portofolio Mahasiswa

![Status](https://img.shields.io/badge/status-active--development-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-Academic%20Project-blue)
![Deployment](https://img.shields.io/badge/deploy-Vercel-black)

**EduVesting** adalah platform simulasi manajemen portofolio investasi multi-aset (Saham, Kripto, Emas, dan Reksa Dana) yang dirancang khusus untuk mahasiswa dan investor pemula. Aplikasi ini mengombinasikan pencatatan keuangan harian, pelacakan target dana (*goals*), simulasi kalkulator finansial, dan asisten kecerdasan buatan (AI Copilot) dalam satu *dashboard* terpusat.

Tujuan utama proyek ini adalah mendobrak batasan literasi finansial dengan menyediakan *sandbox* (lingkungan uji coba) yang aman dan realistis, tanpa mengekspos pengguna pada risiko kerugian finansial sungguhan.

---

## 📑 Daftar Isi

1. [Latar Belakang & Business Case](#-latar-belakang--business-case)
2. [Stakeholder Proyek](#-stakeholder-proyek)
3. [Fitur Utama](#-fitur-utama-key-features)
4. [Business Logic Inti](#-business-logic-inti)
5. [Arsitektur Sistem & Tech Stack](#️-arsitektur-sistem--teknologi-tech-stack)
6. [Alur Kerja Sistem](#-alur-kerja-sistem-system-workflow)
7. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
8. [Skema Database](#️-skema-database-supabase-postgresql)
9. [Panduan Instalasi & Pengembangan Lokal](#️-panduan-instalasi--pengembangan-lokal)
10. [Deployment](#4-deployment)
11. [Roadmap](#-roadmap-pengembangan)
12. [Kontribusi](#-kontribusi)
13. [Informasi Akademik](#-informasi-akademik)

---

## 🎯 Latar Belakang & Business Case

### Masalah (Problem Statement)
Tingkat literasi finansial mahasiswa dan investor pemula di Indonesia masih tergolong rendah dibanding tingkat inklusi keuangan. Banyak calon investor terjun langsung ke pasar riil (saham, kripto) tanpa pemahaman dasar tentang alokasi aset, manajemen risiko, dan disiplin *cashflow* — sehingga rentan mengalami kerugian pada transaksi pertama mereka.

### Solusi (Value Proposition)
EduVesting menjawab masalah ini dengan menyediakan **lingkungan simulasi berisiko nol** yang meniru kondisi pasar nyata (harga *real-time*, fluktuasi aset, analisis portofolio) namun tanpa uang sungguhan. Pengguna dapat:
- Berlatih mengalokasikan "modal virtual" ke berbagai kelas aset.
- Membangun kebiasaan mencatat keuangan harian.
- Mendapatkan umpan balik instan dari AI Copilot layaknya mentor finansial pribadi.
- Mengukur kesiapan mereka sebelum benar-benar berinvestasi dengan uang riil di platform sungguhan.

### Target Pengguna (User Persona)
| Persona | Kebutuhan | Bagaimana EduVesting Membantu |
|---|---|---|
| Mahasiswa pemula | Belajar dasar investasi tanpa risiko | Simulasi portofolio & kalkulator edukatif |
| Investor muda | Menguji strategi alokasi aset | Analisis rebalancing & profil risiko |
| Pengelola keuangan pribadi | Disiplin mencatat arus kas | Modul *daily finance tracker* |
| Peneliti/dosen (opsional) | Studi kasus literasi finansial | Data agregat & modul edukasi (guide.html) |

### Model Nilai Bisnis (Potensi Monetisasi ke Depan)
Meski saat ini berstatus proyek edukasi/akademik, arsitektur EduVesting terbuka untuk pengembangan model bisnis lanjutan, misalnya:
- **Freemium**: fitur AI Copilot lanjutan atau riwayat kalkulator tak terbatas sebagai fitur premium.
- **Partnership edukasi**: integrasi dengan universitas atau lembaga literasi keuangan.
- **White-label**: platform simulasi dapat dilisensikan ke institusi pendidikan lain.

---

## 👥 Stakeholder Proyek

| Peran | Deskripsi Tanggung Jawab |
|---|---|
| **Product Owner / Inisiator Proyek** | Menentukan visi produk, prioritas fitur, dan target pengguna akhir. |
| **Tim Pengembang (Developer)** | Membangun dan memelihara *frontend*, *backend*, serta integrasi API pihak ketiga. |
| **Pengguna Akhir (End User)** | Mahasiswa/investor pemula yang menggunakan aplikasi untuk simulasi dan edukasi finansial. |
| **Dosen Pembimbing / Penguji (jika akademik)** | Mengevaluasi kelayakan proyek dari sisi akademik, teknis, dan dampak edukatif. |
| **Penyedia Layanan Pihak Ketiga** | Supabase (BaaS), Groq AI (LLM), CoinGecko, Yahoo Finance, TradingView — menyediakan infrastruktur data dan kecerdasan buatan. |
| **Vercel (Infrastructure Provider)** | Menyediakan *hosting* dan *serverless deployment* untuk *production environment*. |

> 💡 *Catatan: Bagian ini dapat disesuaikan lebih lanjut sesuai struktur tim aktual (mis. nama anggota kelompok, pembagian peran Front-End/Back-End/UI-UX) sebelum dimasukkan ke slide presentasi.*

---

## 🚀 Fitur Utama (Key Features)

1. **Dashboard Multi-Aset Interaktif** — Memantau metrik krusial seperti *Net Worth*, *Floating Profit/Loss*, proporsi rasio kas, dan ketersediaan Dana Darurat secara *real-time*.
2. **Manajemen Portofolio & Keuangan Harian** — Pencatatan aset komprehensif yang terintegrasi langsung dengan pelacak arus kas (*cashflow*) harian.
3. **Analisis Alokasi & Rebalancing** — Pemantauan deviasi portofolio aktual terhadap profil risiko target (Konservatif, Moderat, Agresif, atau Kustom) dengan saran penyeimbangan.
4. **EduVesting AI Copilot** — Asisten finansial berbasis *Large Language Model* (LLM) yang mampu melakukan *"roasting"* portofolio, mengevaluasi kelayakan target dana, dan menganalisis fundamental aset berdasarkan konteks data personal pengguna.
5. **Kalkulator Finansial Lanjutan** — Simulasi investasi menggunakan metode *Dollar Cost Averaging* (DCA), *Lump-Sum Compound Interest*, dan *Goal Achiever*, dengan riwayat (*history*) tersimpan di *cloud*.
6. **Market Insights** — Pemantauan pasar global *real-time* dengan integrasi *Advanced Chart*, *Screener*, dan *Watchlist* kustom (Saham Indo, Saham US, Kripto, Indeks).

---

## 🧠 Business Logic Inti

Bagian ini menjelaskan aturan bisnis (*business rules*) utama yang mengatur perilaku sistem — penting untuk dijelaskan ke penguji/pembimbing karena ini adalah "otak" logika aplikasi, bukan sekadar tampilan.

### 1. Perhitungan Net Worth & Floating P/L
- `Net Worth = Total Nilai Aset (harga pasar terkini × kuantitas) + Saldo Kas`
- `Floating P/L = (Harga Pasar Terkini − Harga Rata-rata Beli) × Kuantitas`
- Harga pasar terkini diambil melalui *sinkronisasi* ke Yahoo Finance/CoinGecko, sehingga P/L bersifat dinamis mengikuti kondisi pasar riil.

### 2. Logika Alokasi & Rebalancing
- Setiap pengguna memiliki *target allocation* (persentase ideal per kelas aset) berdasarkan profil risiko yang dipilih (Konservatif/Moderat/Agresif/Kustom).
- Sistem menghitung **deviasi** = *(alokasi aktual − alokasi target)* per kelas aset.
- Jika deviasi melewati ambang batas tertentu, sistem memberi rekomendasi rebalancing (mis. "kurangi porsi kripto, tambah porsi reksa dana").

### 3. Logika Goals (Target Dana)
- Setiap *goal* memiliki `target_amount`, `current_amount`, dan `target_date`.
- Sistem menghitung proyeksi kelayakan (*feasibility*) target berdasarkan sisa waktu dan rata-rata tabungan historis pengguna, lalu memberi status seperti "on track", "tertinggal", atau "tercapai".

### 4. Logika Kalkulator Finansial
- **DCA (Dollar Cost Averaging)**: mensimulasikan investasi rutin berkala dengan asumsi *rate of return* tertentu.
- **Lump-Sum Compound Interest**: menghitung pertumbuhan investasi tunggal menggunakan rumus bunga majemuk.
- **Goal Achiever**: menghitung besaran investasi rutin minimum yang dibutuhkan untuk mencapai target dana pada tanggal tertentu.
- Setiap hasil simulasi otomatis tersimpan ke `calculator_history` untuk ditinjau ulang pengguna.

### 5. Logika AI Copilot (Context-Aware Reasoning)
- AI **tidak** menjawab berdasarkan pengetahuan umum semata, melainkan **dikontekstualisasikan** dengan data finansial pribadi pengguna (portofolio, cashflow, goals, watchlist) yang dirangkai menjadi `aiContextString` sebelum dikirim ke Groq API.
- Ini memastikan setiap saran/analisis relevan secara personal, bukan generik.
- Hasil evaluasi kesehatan portofolio disimpan di tabel `ai_scores` (Score, Risk, Diversification) sebagai riwayat historis.

### 6. Keamanan Data & Kepemilikan (Data Ownership)
- Seluruh data pengguna diisolasi menggunakan **Row Level Security (RLS)** di Supabase — satu pengguna tidak dapat mengakses data pengguna lain, bahkan melalui manipulasi request API.
- Relasi antar tabel menggunakan `ON DELETE CASCADE` ke `auth.users(id)`, memastikan konsistensi data saat akun dihapus.

---

## 🛠️ Arsitektur Sistem & Teknologi (Tech Stack)

Proyek ini dibangun menggunakan arsitektur modern pemisahan *Frontend* dan *Backend*, didukung oleh sistem *Backend-as-a-Service* (BaaS) terkelola.

### 1. Frontend (Klien)
- **HTML5, CSS3, Vanilla JavaScript** — Fondasi utama antarmuka tanpa *framework* reaktif berat demi menjaga *footprint* tetap ringan.
- **Tailwind CSS (via CDN)** — Framework *utility-first* untuk *styling*, *glassmorphism*, dan transisi Mode Gelap/Terang.
- **SweetAlert2** — Pustaka manajemen *pop-up/toast notification* untuk UX yang lebih modern.
- **FontAwesome** — Pustaka ikon vektor.

### 2. Backend (Server)
- **Node.js & Express.js** — Menangani *routing* API menggunakan pola arsitektur MVC (*Model-View-Controller*).
- **Serverless Deployment** — Di-*hosting* menggunakan **Vercel** (`vercel.json`), mengubah *routes* Express menjadi fungsi *serverless* terisolasi.

### 3. Backend-as-a-Service (BaaS) — Supabase
- **Supabase Auth** — Autentikasi pengguna (Email/Password dan Google OAuth), pengganti sistem otentikasi lokal lawas (Passport.js).
- **PostgreSQL Database** — Menyimpan data relasional secara persisten di *cloud*.
- **Row Level Security (RLS)** — Memastikan setiap pengguna hanya dapat mengakses data miliknya sendiri berdasarkan `user_id`.

### 4. Integrasi Pihak Ketiga & API Eksternal
- **Groq AI (llama-3.3-70b-versatile)** — Otak di balik fitur *EduVesting AI Insights*.
- **CoinGecko API** — Data harga kripto (sistem utama maupun *fallback*).
- **Yahoo Finance API (via Backend)** — Data *live* harga Saham Indonesia (IDX), Saham US, dan Komoditas (Emas), digunakan di `marketController.js`.
- **TradingView Widgets** — Disematkan di *frontend* untuk *Ticker Tape*, *Advanced Candlestick Chart*, *Market Screener*, dan *Heatmap* tanpa membebani server lokal.

---

## 🔄 Alur Kerja Sistem (System Workflow)

### 1. Alur Autentikasi (Authentication Flow)
Pengguna mendaftar melalui `login.html`. Form mengirim permintaan ke Supabase Auth, yang membuat ID pengguna unik (UUID) dan mengirim *email* konfirmasi. Untuk Google OAuth, pengguna langsung di-*redirect* menggunakan *token* sesi aman. Data kredensial sepenuhnya disimpan di server Supabase, mengabaikan struktur model lokal (*deprecated*).

### 2. Alur Penyimpanan Data (CRUD Data Flow)
- Saat pengguna menambah transaksi di *Keuangan Harian* atau memperbarui *Target Dana*, fungsi di `api.js` mengeksekusi `supabaseClient.from('nama_tabel').insert(...)`.
- Berkat **Row Level Security (RLS)**, permintaan diverifikasi keabsahannya. Jika sesi *token* valid, data masuk ke *database* PostgreSQL *cloud*.

### 3. Alur Kecerdasan Buatan (AI Copilot Workflow)
- Pengguna membuka `insights.html`.
- *Frontend* melakukan *fetch* serentak ke Supabase untuk menarik: Total Portofolio, Cashflow Harian, Target Alokasi, Goals, dan Watchlist.
- Data digabung menjadi `aiContextString`.
- Konteks dan pertanyaan pengguna dikirim ke `/api/ai/chat` di *backend*, diteruskan ke Groq AI.
- Model LLaMA memproses data finansial, mengembalikan respons JSON untuk dirender sebagai *chat bubble*.

### 4. Alur Market Data & Sinkronisasi
- Di `dashboard.html`/`portfolio.html`, saat pengguna menekan "Sinkronisasi Harga", *frontend* memanggil `/api/price/saham/:ticker`.
- *Backend* bertindak sebagai *proxy* ke Yahoo Finance/CoinGecko, mengambil harga *real-time*, mengembalikannya ke klien untuk menghitung *Floating P/L* terkini sebelum disimpan kembali ke Supabase.

---

## 📁 Struktur Direktori Proyek

```text
📂 eduvesting/
├── 📁 backend/                 # Environment Node.js untuk API / Serverless
│   ├── 📁 config/              # [DEPRECATED] Konfigurasi lokal lama
│   ├── 📁 controllers/         # Logika komputasi utama
│   │   ├── aiController.js     # Request ke Groq API
│   │   ├── alloController.js   # Kalkulasi logika alokasi tambahan
│   │   ├── authController.js   # [DEPRECATED] Manajemen sesi lokal
│   │   ├── calculatorController.js
│   │   ├── marketController.js # Fetching ke Yahoo Finance/CoinGecko
│   │   └── settingsController.js
│   ├── 📁 models/              # [DEPRECATED] Model database lokal
│   ├── 📁 routes/              # Rute Endpoint Express.js
│   │   ├── aiRoutes.js
│   │   ├── alloRoutes.js
│   │   ├── authRoutes.js
│   │   ├── calculatorRoutes.js
│   │   ├── goalsRoutes.js
│   │   ├── guideRoutes.js
│   │   ├── marketRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── transactionRoutes.js
│   ├── 📁 utils/                # [DEPRECATED] Mailer lokal
│   ├── package-lock.json
│   ├── package.json            # Dependensi Backend (Express, Axios, CORS, dotenv)
│   └── server.js               # Entry point server
├── 📁 frontend/                 # Sisi Klien (UI)
│   ├── 📁 css/
│   │   ├── eduvestingAI.jpg    # Aset gambar profil AI Copilot
│   │   └── style.css
│   ├── 📁 js/
│   │   ├── api.js              # Interaksi klien dengan Supabase & API lokal
│   │   └── charts.js
│   ├── about.html
│   ├── allocations.html
│   ├── calculator.html
│   ├── dashboard.html
│   ├── goals.html
│   ├── guide.html
│   ├── insights.html
│   ├── login.html
│   ├── logout.html
│   ├── market.html
│   ├── portfolio.html
│   ├── privacy.html
│   ├── settings.html
│   ├── terms.html
│   └── transactions.html
├── .gitignore
├── README.md
├── package-lock.json
├── package.json
└── vercel.json
```

---

## 🗄️ Skema Database (Supabase PostgreSQL)

Seluruh tabel diatur dengan kebijakan `ON DELETE CASCADE` dengan referensi ke `auth.users(id)`.

| Tabel | Deskripsi |
|---|---|
| `portfolios` | Menyimpan aset (ticker, harga rata-rata, kuantitas) |
| `daily_finances` | Riwayat pengeluaran/pemasukan harian (type, amount, category, date) |
| `goals` | Target tabungan finansial (target_amount, current_amount, target_date) |
| `allocation_targets` | Preferensi profil risiko (Agresif/Moderat/Konservatif/Kustom) |
| `calculator_history` | Rekaman otomatis hasil simulasi DCA/Lump-Sum |
| `watchlists` | Daftar aset pantauan pasar milik pengguna |
| `ai_scores` | Nilai kesehatan portofolio (Score, Risk, Diversification) |

---

## ⚙️ Panduan Instalasi & Pengembangan Lokal

### 1. Prasyarat
- Node.js (versi 18+)
- Akun Supabase aktif
- Akun Groq API (untuk *keys*)

### 2. Konfigurasi Environment (Backend)
Buat file `.env` di dalam folder `backend/`:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
# URL Supabase dan KEY anon diletakkan langsung di sisi frontend HTML (js/api.js)
```

### 3. Menjalankan Aplikasi
```bash
# Masuk ke direktori backend
cd eduvesting/backend

# Instalasi dependensi
npm install

# Jalankan server
npm start
```
Buka *file* HTML (seperti `login.html`) di *browser* Anda (disarankan menggunakan ekstensi *Live Server* di VSCode).

### 4. Deployment
Aplikasi dikonfigurasi untuk siap diluncurkan ke **Vercel**. File `vercel.json` memastikan lalu lintas ke jalur `/api/*` diteruskan (*rewrite*) ke `backend/server.js`, memungkinkan *frontend* dan *backend* berjalan beriringan dalam satu *production environment*.

---

## 🗺️ Roadmap Pengembangan

- [ ] Modul notifikasi push untuk pengingat target dana
- [ ] Ekspor laporan portofolio ke PDF/Excel
- [ ] Mode kolaborasi (portofolio kelompok/kelas)
- [ ] Leaderboard edukatif antar pengguna (gamifikasi)
- [ ] Migrasi penuh menghapus folder `[DEPRECATED]`

---

## 🤝 Kontribusi

Kontribusi terbuka untuk perbaikan bug, penambahan fitur, atau perbaikan dokumentasi:
1. *Fork* repository ini.
2. Buat *branch* baru (`git checkout -b fitur/nama-fitur`).
3. Commit perubahan Anda.
4. Ajukan *Pull Request* dengan deskripsi jelas.

---

## 🎓 Informasi Akademik

Proyek ini dikembangkan sebagai **tugas/proyek pribadi mahasiswa** dalam rangka pembelajaran dan/atau pemenuhan tugas kuliah, bukan merupakan produk komersial maupun perangkat lunak *open-source* publik.

- **Status**: Proyek akademik / portofolio pribadi
- **Penggunaan**: Kode dan dokumentasi ini disusun untuk keperluan pembelajaran, demonstrasi, dan penilaian tugas. Tidak diperuntukkan untuk transaksi finansial sungguhan.
- **Hak Cipta**: © 2026 — seluruh hak atas kode dan konten proyek ini dipegang oleh penulis/pengembang, kecuali dinyatakan lain.
- **Disclaimer**: Data harga aset (saham, kripto, emas) bersifat simulasi berbasis data pasar riil untuk tujuan edukasi. EduVesting **bukan** platform investasi resmi dan tidak memfasilitasi transaksi keuangan nyata.

> Jika suatu saat proyek ini ingin dibuka untuk kontribusi publik atau dipublikasikan sebagai *open-source*, bagian ini dapat diganti dengan lisensi yang sesuai (mis. MIT, Apache 2.0, atau GPL) sesuai keputusan penulis.
