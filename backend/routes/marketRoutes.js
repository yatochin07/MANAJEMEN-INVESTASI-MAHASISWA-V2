const express = require('express');
const router = express.Router();

// Panggil controllernya
const marketController = require('../controllers/marketController');

// Daftarin rutenya (Sekarang namanya sudah SAMA PERSIS dengan di controller)
router.get('/screener', marketController.getMarketScreener);
router.get('/watchlist', marketController.getWatchlistPrices);

module.exports = router;
