const express = require('express');

const cors = require('cors');

require('dotenv').config();



// ========================================================

// FIX: Import Library Yahoo Finance versi terbaru

// Jangan pakai 'new YahooFinance()', langsung panggil objeknya

// ========================================================

const yahooFinance = require('yahoo-finance2').default;



// ======================

// IMPORT ROUTES

// ======================

const portfolioRoutes = require('./routes/portfolioRoutes');

const transactionRoutes = require('./routes/transactionRoutes');

const goalsRoutes = require('./routes/goalsRoutes');

const aiRoutes = require('./routes/aiRoutes');

const alloRoutes = require('./routes/alloRoutes');

const calculatorRoutes = require('./routes/calculatorRoutes');

const settingsRoutes = require('./routes/settingsRoutes');



// ======================

// APP & MIDDLEWARE

// ======================

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());



// (Sisa kodingan Mongoose / MongoDB sudah dihapus bersih dari sini karena sudah pakai Supabase)



// ======================

// ROUTES (API PIHAK KETIGA / EXTERNAL)

// ======================



// Endpoint untuk menarik harga realtime dari Yahoo Finance

app.get('/api/price/saham/:ticker', async (req, res) => {

try {

let ticker = req.params.ticker.toUpperCase();



// Logika Cerdas: Jangan tambahkan .JK kalau tickernya Emas (GC=F)

// atau kalau tickernya sudah pakai titik (XPIN.JK)

if (!ticker.includes('=') && !ticker.includes('.')) {

ticker += '.JK';

}



console.log(`[DEBUG] Mencoba tarik dari Yahoo: ${ticker}`);



// ========================================================

// FIX: Panggil langsung dari 'yahooFinance'

// ========================================================

const quote = await yahooFinance.quote(ticker);



if (!quote || !quote.regularMarketPrice) {

return res.status(404).json({ error: "Harga tidak ditemukan" });

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

app.use('/api/ai', aiRoutes); // <--- Rute AI

app.use('/api/allocations', alloRoutes);

app.use('/api/market', calculatorRoutes);

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



// WAJIB UNTUK VERCEL

module.exports = app; 

