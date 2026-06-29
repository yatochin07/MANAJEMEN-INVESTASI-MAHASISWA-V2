EduVesting - Manajemen Portofolio Mahasiswa

struktur :

'''
📂 eduvesting/
├── 📁 backend/                 # Folder API dan server Node.js
│   ├── 📁 config/              # Konfigurasi database & eksternal
│   ├── 📁 controllers/         # Logika utama (MVC Pattern)
│   │   ├── aiController.js     
│   │   ├── alloController.js   
│   │   ├── authController.js   
│   │   ├── calculatorController.js 
│   │   ├── marketController.js 
│   │   └── settingsController.js 
│   ├── 📁 models/              # Struktur tabel/data Supabase
│   ├── 📁 routes/              # Pengaturan Endpoint API
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
│   ├── 📁 utils/               # Fungsi bantuan/helper
│   ├── package-lock.json       
│   ├── package.json            # Dependencies khusus backend
│   └── server.js               # Entry point untuk server backend
├── 📁 frontend/                # Antarmuka pengguna (UI murni)
│   ├── 📁 css/                 
│   │   ├── eduvestingAI.jpg    # Aset gambar styling
│   │   └── style.css           # Desain visual halaman
│   ├── 📁 js/                  
│   │   ├── api.js              # Fetch eksternal (Yahoo, Groq, dll)
│   │   └── charts.js           # Render grafik TradingView
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
├── .gitignore                  # Mencegah .env dan node_modules ter-upload
├── README.md                   # Dokumentasi proyek
├── package-lock.json           
├── package.json                # Dependencies utama
└── vercel.json                 # Pengaturan routing deployment Vercel

'''