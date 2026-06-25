const yahooFinance = require('yahoo-finance2').default;

// Fungsi helper internal untuk nembak TradingView dari Server (Bebas CORS!)
async function fetchFromTradingView(routing, tickers) {
  if (!tickers || tickers.length === 0) return [];
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
      'BINANCE:BTCIDR', 'BINANCE:ETHIDR', 'BINANCE:BNBIDR', 'BINANCE:SOLIDR',
      'BINANCE:XRPIDR', 'BINANCE:ADAIDR', 'BINANCE:DOGEIDR',
      'BINANCE:BTCUSDT', 'BINANCE:ETHUSDT' // Fallback
    ];

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
    let cryptoKeys = new Set();
    
    cryptoData.forEach(item => {
      const symbolFull = item.s.split(':')[1];
      const isIDR = symbolFull.endsWith('IDR');
      const ticker = symbolFull.replace('USDT', '').replace('IDR', '');
      
      if (cryptoKeys.has(ticker)) return;
      cryptoKeys.add(ticker);

      allCrypto.push({
        symbol: ticker,
        name: ticker === 'BTC' ? 'Bitcoin' : ticker === 'ETH' ? 'Ethereum' : ticker === 'BNB' ? 'Binance Coin' : item.d[0],
        price: isIDR ? item.d[1] : item.d[1] * 16400, 
        changePct: item.d[2],
        currency: 'Rp '
      });
    });

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

// ENDPOINT WATCHLIST YANG SUDAH DIPERBAIKI
exports.getWatchlistPrices = async (req, res) => {
  try {
    const { tickers } = req.query;
    if (!tickers) return res.status(200).json({ sukses: true, data: {} });

    const tickerList = tickers.split(',').map(t => t.trim().toUpperCase());
    
    // Gandakan format ticker untuk semua jenis market, TradingView akan memfilter otomatis mana yang valid
    const idxTvSymbols = tickerList.map(t => t === 'IHSG' ? 'IDX:COMPOSITE' : `IDX:${t}`);
    const usTvSymbols = tickerList.flatMap(t => [`NASDAQ:${t}`, `NYSE:${t}`, `AMEX:${t}`]);
    const cryptoTvSymbols = tickerList.flatMap(t => [`BINANCE:${t}IDR`, `BINANCE:${t}USDT`, `COINBASE:${t}USD`]);

    const [idxRes, usRes, cryptoRes] = await Promise.all([
      fetchFromTradingView('indonesia', idxTvSymbols),
      fetchFromTradingView('america', usTvSymbols),
      fetchFromTradingView('crypto', cryptoTvSymbols)
    ]);

    let results = {};

    idxRes.forEach(item => {
       let key = item.s.split(':')[1];
       if (key === 'COMPOSITE') key = 'IHSG';
       results[key] = { price: item.d[1], currency: 'Rp ', isCrypto: false };
    });

    usRes.forEach(item => {
       let key = item.s.split(':')[1];
       if(!results[key]) results[key] = { price: item.d[1], currency: 'USD ', isCrypto: false };
    });

    cryptoRes.forEach(item => {
       let symbol = item.s.split(':')[1];
       let isIDR = symbol.endsWith('IDR');
       let key = symbol.replace('IDR', '').replace('USDT', '').replace('USD', '');
       
       if (results[key] && results[key].foundIDR) return;
       let finalPrice = isIDR ? item.d[1] : item.d[1] * 16400;

       results[key] = { price: finalPrice, currency: 'Rp ', isCrypto: true, foundIDR: isIDR };
    });

    if (tickerList.includes('EMAS') || tickerList.includes('GOLD')) {
      const gold = await fetchFromTradingView('cfd', ['TVC:GOLD']);
      if(gold.length) {
        results['EMAS'] = { price: gold[0].d[1] * 16400, currency: 'Rp ', isCrypto: false };
        results['GOLD'] = { price: gold[0].d[1] * 16400, currency: 'Rp ', isCrypto: false };
      }
    }

    res.status(200).json({ sukses: true, data: results });
  } catch (error) {
    res.status(500).json({ sukses: false, error: error.message });
  }
};
