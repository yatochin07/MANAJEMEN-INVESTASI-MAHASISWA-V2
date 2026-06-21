const express = require('express');

const router = express.Router();

const {

    calculateFee

} = require(
    '../controllers/calculatorController'
);

router.post(
    '/',
    calculateFee
);

module.exports = router;
