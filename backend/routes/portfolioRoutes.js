const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    res.json([
        {
            asset: 'BBCA',
            type: 'Saham',
            value: 5050000,
            profit: 450000
        },

        {
            asset: 'BTC',
            type: 'Kripto',
            value: 1050000,
            profit: 130000
        }
    ]);

});

module.exports = router;