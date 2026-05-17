const express = require('express');

const router = express.Router();

const {

    getAllocationData

} = require('../controllers/alloController');


router.get(
    '/',
    getAllocationData
);

module.exports = router;