const yahooFinance = require('yahoo-finance2').default;

// ==========================================
// 1. FUNGSI AMBIL DATA KRIPTO (CoinGecko)
// ==========================================
exports.getCryptoPrices = async (req, res) => {
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=idr&include_24hr_change=true';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`CoinGecko merespon dengan status: ${response.status}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error Fetch Kripto:', error.message);
    res.status(500).json({ sukses: false, pesan: 'Gagal mengambil data Kripto.', error: error.message });
  }
};

// ==========================================
// 2. FUNGSI AMBIL DATA SAHAM IDX & EMAS
// ==========================================
exports.getStockPrice = async (req, res) => {
  try {
    let { ticker } = req.params;
    ticker = ticker.toUpperCase();

    let yahooTicker = ticker;
    let isGold = false;

    if (ticker === 'EMAS' || ticker === 'XAU' || ticker === 'GC=F') {
      yahooTicker = 'GC=F';
      isGold = true;
    } 
    else if (!ticker.includes('.')) {
      yahooTicker = `${ticker}.JK`;
    }

    const quote = await yahooFinance.quote(yahooTicker);

    if (!quote || !quote.regularMarketPrice) {
      throw new Error('Data ticker tidak ditemukan di pasar.');
    }

    let finalPrice = quote.regularMarketPrice;

    if (isGold) finalPrice = finalPrice * 16000; 

    res.status(200).json({
      sukses: true,
      ticker: ticker,
      yahoo_symbol: quote.symbol,
      price: finalPrice,
      change_percent: quote.regularMarketChangePercent || 0,
      currency: isGold ? 'IDR (Converted)' : quote.currency
    });

  } catch (error) {
    console.error(`❌ Error Fetch Saham/Emas (${req.params.ticker}):`, error.message);
    res.status(500).json({ sukses: false, pesan: 'Gagal mengambil harga saham/emas.', error: error.message });
  }
};

// ==========================================
// 3. FUNGSI TRENDING MARKET (100% REAL-TIME)
// ==========================================
exports.getTrendingMarket = async (req, res) => {
  try {
    // Menarik data trending sungguhan dari Yahoo Finance
    const trending = await yahooFinance.trendingSymbols('US'); 
    res.status(200).json({ sukses: true, data: trending.quotes.slice(0, 5) });
  } catch (error) {
    console.error('❌ Error Fetch Trending:', error.message);
    res.status(500).json({ sukses: false, pesan: 'Gagal memuat tren pasar sungguhan.' });
  }
};