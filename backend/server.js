const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ========================================================
// FIX MUTLAK: YAHOO FINANCE V3
// ========================================================
// 1. Panggil class utamanya dari .default
const YahooFinance = require('yahoo-finance2').default;
// 2. Wajib nyalakan pakai 'new' sesuai permintaan error tadi
const yahooFinance = new YahooFinance();

// ======================
// IMPORT ROUTES
// ======================
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const alloRoutes = require('./routes/alloRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// SEMENTARA KITA MATIKAN ROUTE AI AGAR SERVER FOKUS KE SAHAM
// const aiRoutes = require('./routes/aiRoutes');

// ======================
// APP & MIDDLEWARE
// ======================
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// ======================
// ROUTES (YAHOO FINANCE)
// ======================
app.get('/api/price/saham/:ticker', async (req, res) => {
    try {
        let ticker = req.params.ticker.toUpperCase();

        if (!ticker.includes('=') && !ticker.includes('.')) {
            ticker += '.JK';
        }

        console.log(`[DEBUG] Mencoba tarik dari Yahoo: ${ticker}`);

        const quote = await yahooFinance.quote(ticker);

        if (!quote || !quote.regularMarketPrice) {
            return res.status(404).json({ error: "Harga tidak ditemukan" });
        }

        res.json({ ticker: req.params.ticker.toUpperCase(), price: quote.regularMarketPrice });
    } catch (error) {
        console.error("ERROR DETAIL YAHOO:", error.message);
        res.status(500).json({ error: "Gagal: " + error.message });
    }
});

// ======================
// ROUTES (INTERNAL)
// ======================
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/allocations', alloRoutes);
app.use('/api/market', calculatorRoutes);
app.use('/api/settings', settingsRoutes);

// app.use('/api/ai', aiRoutes);

// ======================
// SERVER EXPORT
// ======================
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
