const express = require('express');
const router = express.Router();

const marketController = require('../controllers/marketController');

// 1. Kripto Spot (CoinGecko)
router.get('/crypto', marketController.getCryptoPrices);

// 2. Saham IDX / Emas (Yahoo Finance)
router.get('/stock/:ticker', marketController.getStockPrice);

// 3. Trending Market (Real-time Yahoo Finance)
router.get('/trending', marketController.getTrendingMarket);

module.exports = router;