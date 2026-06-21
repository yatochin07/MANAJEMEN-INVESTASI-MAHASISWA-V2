const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// ======================
// TAMBAHAN: IMPORT SESSION & PASSPORT
// ======================
const session = require('express-session');
const passport = require('./config/passport'); // Mengambil konfigurasi passport yang sudah dibuat

// Tambahan: Import Library Yahoo Finance versi terbaru (v3)
const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance();

// ======================
// IMPORT ROUTES
// ======================
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const alloRoutes = require('./routes/alloRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// ======================
// APP
// ======================
const app = express();



// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// TAMBAHAN: MIDDLEWARE SESSION & PASSPORT
// ======================
// Session diperlukan oleh Google OAuth untuk menyimpan status login sementara
app.use(session({
    secret: process.env.SESSION_SECRET || 'rahasia_sementara_eduvesting', 
    resave: false,
    saveUninitialized: false
}));

// Inisialisasi Passport agar aktif di aplikasi
app.use(passport.initialize());
app.use(passport.session());


// ======================
// DATABASE
// ======================
mongoose.connect(
    process.env.MONGO_URI
)
.then(() => {
    console.log('MongoDB Connected');
})
.catch((err) => {
    console.log(err);
});

// ======================
// ROUTES (API PIHAK KETIGA / EXTERNAL)
// ======================

// Endpoint untuk menarik harga saham realtime dari Yahoo Finance
app.get('/api/price/saham/:ticker', async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase() + '.JK';
        console.log(`[DEBUG] Mencoba tarik: ${ticker}`);
        
        // Memanggil fungsi menggunakan instance 'yf'
        const quote = await yf.quote(ticker);
        
        if (!quote || !quote.regularMarketPrice) {
            return res.status(404).json({ error: "Harga saham tidak ditemukan" });
        }

        res.json({ ticker: req.params.ticker.toUpperCase(), price: quote.regularMarketPrice });
    } catch (error) {
        console.error("ERROR DETAIL:", error); 
        res.status(500).json({ error: "Gagal: " + error.message }); 
    }
});

// ======================
// ROUTES (INTERNAL / MODULAR)
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/allocations', alloRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/settings', settingsRoutes);

// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('✅ SERVER BERHASIL JALAN');
});