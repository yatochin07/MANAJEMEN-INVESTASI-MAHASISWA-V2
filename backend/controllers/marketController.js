const yahooFinance = require('yahoo-finance2').default;

// Fungsi helper internal untuk menembak TradingView Scanner API dari Server (Bebas CORS & Limit)
async function fetchFromTradingView(routing, tickers) {
  try {
    const response = await fetch(`https://scanner.tradingview.com/${routing}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbols: { tickers: tickers },
        columns: ["description", "close", "change"]
      })
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error(`Gagal fetch TV region ${routing}:`, err);
    return [];
  }
}

// 1. ENDPOINT SCREENER (GAINERS & LOSERS REALTIME)
exports.getMarketScreener = async (req, res) => {
  try {
    const idxTickers = [
      'IDX:BBCA', 'IDX:BBRI', 'IDX:BMRI', 'IDX:BBNI', 'IDX:TLKM', 
      'IDX:ASII', 'IDX:AMMN', 'IDX:GOTO', 'IDX:BREN', 'IDX:CUAN', 
      'IDX:PGEO', 'IDX:BRPT', 'IDX:ADRO', 'IDX:UNTR', 'IDX:ICBP', 
      'IDX:INDF', 'IDX:KLBF', 'IDX:SMDR', 'IDX:ANTM', 'IDX:PTBA'
    ];
    const usTickers = [
      'NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:NVDA', 'NASDAQ:TSLA', 'NASDAQ:GOOGL',
      'NASDAQ:AMZN', 'NASDAQ:META', 'NASDAQ:NFLX', 'NASDAQ:AMD', 'NASDAQ:INTC'
    ];
    const cryptoTickers = [
      'BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:BNBUSDT', 'BINANCE:SOLUSDT',
      'BINANCE:XRPUSDT', 'BINANCE:ADAUSDT', 'BINANCE:DOGEUSDT'
    ];

    // Eksekusi paralel di server agar secepat kilat
    const [idxData, usData, cryptoData] = await Promise.all([
      fetchFromTradingView('indonesia', idxTickers),
      fetchFromTradingView('america', usTickers),
      fetchFromTradingView('crypto', cryptoTickers)
    ]);

    let allStocks = [];
    const parseStocks = (items, isUS) => {
      items.forEach(item => {
        allStocks.push({
          symbol: item.s.split(':')[1],
          name: item.d[0],
          price: item.d[1],
          changePct: item.d[2],
          currency: isUS ? 'USD ' : 'Rp '
        });
      });
    };
    parseStocks(idxData, false);
    parseStocks(usData, true);

    let allCrypto = [];
    cryptoData.forEach(item => {
      const ticker = item.s.split(':')[1].replace('USDT', '');
      allCrypto.push({
        symbol: ticker,
        name: ticker === 'BTC' ? 'Bitcoin' : ticker === 'ETH' ? 'Ethereum' : ticker === 'BNB' ? 'Binance Coin' : item.d[0],
        price: item.d[1] * 16000, // Konversi standard rupiah dari basis USDT
        changePct: item.d[2],
        currency: 'Rp '
      });
    });

    // Sortir menggunakan filter matematika murni tanpa bergantung pada Yahoo yang labil
    res.status(200).json({
      sukses: true,
      screener: {
        gainer_saham: allStocks.filter(s => s.changePct > 0).sort((a,b) => b.changePct - a.changePct).slice(0,5),
        loser_saham: allStocks.filter(s => s.changePct < 0).sort((a,b) => a.changePct - b.changePct).slice(0,5),
        gainer_kripto: allCrypto.filter(c => c.changePct > 0).sort((a,b) => b.changePct - a.changePct).slice(0,5),
        loser_kripto: allCrypto.filter(c => c.changePct < 0).sort((a,b) => a.changePct - b.changePct).slice(0,5)
      }
    });
  } catch (error) {
    res.status(500).json({ sukses: false, error: error.message });
  }
};

// 2. ENDPOINT WATCHLIST DINAMIS
exports.getWatchlistPrices = async (req, res) => {
  try {
    const { tickers } = req.query;
    if (!tickers) return res.status(200).json({ sukses: true, data: {} });

    const tickerList = tickers.split(',').map(t => t.trim().toUpperCase());
    const usStocks = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'META', 'GOOGL', 'NFLX', 'AMD', 'INTC'];
    const cryptos = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE'];

    let idxTvSymbols = [];
    let usTvSymbols = [];
    let cryptoTvSymbols = [];

    tickerList.forEach(t => {
      if (cryptos.includes(t)) cryptoTvSymbols.push(`BINANCE:${t}USDT`);
      else if (usStocks.includes(t)) usTvSymbols.push(`NASDAQ:${t}`);
      else if (t !== 'EMAS' && t !== 'GOLD' && t !== 'IHSG') idxTvSymbols.push(`IDX:${t}`);
    });

    const [idxRes, usRes, cryptoRes] = await Promise.all([
      idxTvSymbols.length ? fetchFromTradingView('indonesia', idxTvSymbols) : Promise.resolve([]),
      usTvSymbols.length ? fetchFromTradingView('america', usTvSymbols) : Promise.resolve([]),
      cryptoTvSymbols.length ? fetchFromTradingView('crypto', cryptoTvSymbols) : Promise.resolve([])
    ]);

    let results = {};
    const mergeData = (items, isCrypto, isUS) => {
      items.forEach(item => {
        let key = item.s.split(':')[1];
        if (isCrypto) key = key.replace('USDT', '');
        results[key] = {
          price: isCrypto ? item.d[1] * 16000 : item.d[1],
          currency: isUS ? 'USD ' : 'Rp ',
          isCrypto: isCrypto
        };
      });
    };

    mergeData(idxRes, false, false);
    mergeData(usRes, false, true);
    mergeData(cryptoRes, true, false);

    // Fallback spesial Komoditas & Index global jika dimasukkan ke watchlist
    if (tickerList.includes('EMAS') || tickerList.includes('GOLD')) {
      const gold = await fetchFromTradingView('commodities', ['TVC:GOLD']);
      if(gold.length) results['EMAS'] = { price: gold[0].d[1] * 16000, currency: 'Rp ', isCrypto: false };
    }
    if (tickerList.includes('IHSG')) {
      const ihsg = await fetchFromTradingView('indonesia', ['IDX:COMPOSITE']);
      if(ihsg.length) results['IHSG'] = { price: ihsg[0].d[1], currency: 'Rp ', isCrypto: false };
    }

    res.status(200).json({ sukses: true, data: results });
  } catch (error) {
    res.status(500).json({ sukses: false, error: error.message });
  }
};

// Fungsi bawaan lama mu tetap aman di bawah jika dibutuhkan route lain
exports.getCryptoPrices = async (req, res) => { /* ... */ };
exports.getStockPrice = async (req, res) => { /* ... */ };
