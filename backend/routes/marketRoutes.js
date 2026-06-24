const express = require('express');
const router = express.Router();

// Panggil controllernya
const marketController = require('../controllers/marketController');

// Daftarin rutenya (Harus persis sama namanya dengan yang di controller)
router.get('/crypto', marketController.getCryptoPrices);
router.get('/stock/:ticker', marketController.getStockPrice);

module.exports = router;
