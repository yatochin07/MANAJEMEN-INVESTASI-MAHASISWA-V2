const express = require('express');
const cors = require('cors');
require('dotenv').config();

const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const alloRoutes = require('./routes/alloRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const marketRoutes = require('./routes/marketRoutes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// ========================================================
// API SAHAM MURNI 100% REAL-TIME VIA YAHOO URL (TANPA DUMMY)
// ========================================================
app.get('/api/price/saham/:ticker', async (req, res) => {
    try {
        let ticker = req.params.ticker.toUpperCase();

        if (!ticker.includes('=') && !ticker.includes('.')) {
            ticker += '.JK';
        }

        // BUKTI KODINGAN BARU JALAN: Tulisan ini yang harusnya muncul di Vercel nanti BRO
        console.log(`[DEBUG] Murni URL Fetch: ${ticker}`);

        const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' 
            }
        });

        if (!response.ok) {
            console.error(`[ERROR] Ticker ${ticker} tidak ditemukan.`);
            return res.status(404).json({ error: `Ticker ${ticker} gagal diambil.` });
        }

        const data = await response.json();
        const livePrice = data.chart.result[0].meta.regularMarketPrice;

        res.json({ ticker: ticker, price: livePrice });

    } catch (error) {
        console.error("ERROR TARIK SAHAM:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/allocations', alloRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/market', marketRoutes);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
