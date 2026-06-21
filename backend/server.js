const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Tambahan: Import Library Yahoo Finance versi terbaru (v3)
const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance();

// ======================
// IMPORT ROUTES
// ======================
// Catatan: authRoutes dihapus karena autentikasi sudah sepenuhnya ditangani oleh Supabase di Frontend
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const alloRoutes = require('./routes/alloRoutes');
const marketRoutes = require('./routes/marketRoutes');
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
// Catatan: express-session dan passport dihapus karena Vercel Serverless bersifat stateless

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
    console.error('MongoDB Connection Error:', err);
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
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/allocations', alloRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/settings', settingsRoutes);

// ======================
// SERVER EXPORT (VERCEL & LOKAL)
// ======================
const PORT = process.env.PORT || 5000;

// Jika dijalankan di localhost (node server.js), maka app.listen akan berjalan
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('✅ SERVER BERHASIL JALAN DI LOKAL');
    });
}

// WAJIB UNTUK VERCEL: Export app agar Vercel bisa menjadikannya Serverless Function
module.exports = app;
