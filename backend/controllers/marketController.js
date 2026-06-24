const yahooFinance = require('yahoo-finance2').default;

// Controller buat narik data "Screener" (Gabungan Saham & Kripto)
exports.getScreener = async (req, res) => {
  try {
    // Daftar saham ID yang liquid
    const stocks = ['BBCA.JK', 'BBRI.JK', 'TLKM.JK', 'GOTO.JK', 'BMRI.JK', 'BBNI.JK', 'ASII.JK', 'AMMN.JK', 'ADRO.JK', 'UNVR.JK'];

    // 1. TARIK DATA SAHAM (BATCH REQUEST - PARALEL)
    // Langsung tembak array 'stocks' ke dalam quote.
    // Ini jauh lebih cepat karena ditarik berbarengan, tidak antre satu-satu.
    const quotes = await yahooFinance.quote(stocks);
    
    const results = quotes.map(quote => ({
      symbol: quote.symbol.replace('.JK', ''),
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice,
      changePct: quote.regularMarketChangePercent || 0,
      currency: 'Rp '
    }));

    // 2. TARIK DATA KRIPTO
    let cryptos = [];
    const cgRes = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&order=volume_desc&per_page=10&page=1');
    
    // Cek apakah response dari CoinGecko aman (bukan limit/error)
    if (cgRes.ok) {
      const cgData = await cgRes.json();
      cryptos = cgData.map(c => ({
        symbol: c.symbol.toUpperCase(),
        name: c.name,
        price: c.current_price,
        changePct: c.price_change_percentage_24h || 0,
        currency: 'Rp '
      }));
    } else {
      // Print ke console server supaya Anda tahu CoinGecko sedang melimit request
      console.warn('Peringatan: Gagal menarik data CoinGecko. Status:', cgRes.status);
    }

    // 3. KIRIM RESPONSE KE FRONTEND
    res.json({ sukses: true, saham: results, kripto: cryptos });

  } catch (error) {
    console.error('Error pada getScreener:', error); // Log error di console backend
    res.status(500).json({ sukses: false, error: error.message });
  }
};
