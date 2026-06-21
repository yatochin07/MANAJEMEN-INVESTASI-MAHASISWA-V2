const express = require('express');

const router = express.Router();

const {

    marketInsights

} = require(
    '../controllers/marketController'
);

router.post(
    '/',
    marketInsights
);

module.exports = router;
