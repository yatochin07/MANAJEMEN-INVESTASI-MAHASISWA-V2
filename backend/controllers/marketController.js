const yahooFinance = require('yahoo-finance2').default;

exports.getCryptoPrices = async (req, res) => {
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=idr&include_24hr_change=true';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Gagal fetch CoinGecko');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ sukses: false, error: error.message });
  }
};

exports.getStockPrice = async (req, res) => {
  try {
    let ticker = req.params.ticker.toUpperCase();
    let yahooTicker = (ticker === 'EMAS' || ticker === 'GC=F') ? 'GC=F' : 
                      (ticker.includes('.') ? ticker : `${ticker}.JK`);

    const quote = await yahooFinance.quote(yahooTicker);
    let finalPrice = quote.regularMarketPrice;
    
    if (yahooTicker === 'GC=F') finalPrice = finalPrice * 16000;

    res.status(200).json({ sukses: true, price: finalPrice });
  } catch (error) {
    res.status(500).json({ sukses: false, error: error.message });
  }
};
