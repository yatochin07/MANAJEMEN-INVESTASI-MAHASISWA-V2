const express = require('express');

const router = express.Router();

let transactions = [
    {
        type: 'Beli',
        asset: 'BBCA',
        price: 10100,
        volume: 2
    }
];


// GET all transactions
router.get('/', (req, res) => {

    res.json(transactions);

});


// POST new transaction
router.post('/', (req, res) => {

    const newTransaction = req.body;

    transactions.push(newTransaction);

    res.json({
        message: 'Transaksi berhasil disimpan',
        data: newTransaction
    });

});

module.exports = router;