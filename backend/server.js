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
        let originalTicker = req.params.ticker.toUpperCase();
        
        console.log(`[DEBUG] Murni URL Fetch: ${originalTicker}`);

        // Fungsi pembantu untuk fetch meta data Yahoo
        const fetchYahooMeta = async (t) => {
            const url = `https://query2.finance.yahoo.com/v8/finance/chart/${t}`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            if (!response.ok) return null;
            const data = await response.json();
            if (!data.chart.result || !data.chart.result[0]) return null;
            return data.chart.result[0].meta;
        };

        let meta = null;

        if (originalTicker.includes('=') || originalTicker.includes('.')) {
            // Ticker sudah spesifik (contoh: GC=F, XPIN.JK)
            meta = await fetchYahooMeta(originalTicker);
        } else {
            // STEP 1: Coba anggap ini saham Indo dulu (tambah .JK)
            meta = await fetchYahooMeta(originalTicker + '.JK');
            
            // STEP 2: Jika gagal (null), berarti kemungkinan Saham US (coba tanpa .JK)
            if (!meta) {
                meta = await fetchYahooMeta(originalTicker);
            }
        }

        if (!meta) {
            console.error(`[ERROR] Ticker ${originalTicker} tidak ditemukan di Yahoo Finance.`);
            return res.status(404).json({ error: `Ticker ${originalTicker} gagal diambil.` });
        }

        let livePrice = meta.regularMarketPrice;
        const currency = meta.currency;

        // STEP 3: Konversi otomatis USD ke IDR secara Real-Time jika saham US
        if (currency === 'USD') {
            const idrMeta = await fetchYahooMeta('IDR=X'); // Tarik kurs Rupiah realtime
            if (idrMeta && idrMeta.regularMarketPrice) {
                const usdToIdrRate = idrMeta.regularMarketPrice;
                livePrice = livePrice * usdToIdrRate; // Kalikan harga USD dengan kurs IDR hari ini
                console.log(`[DEBUG] Konversi Kurs: ${originalTicker} | $1 = Rp${usdToIdrRate}`);
            }
        }

        // Return data dalam format IDR
        res.json({ ticker: originalTicker, price: livePrice });

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
