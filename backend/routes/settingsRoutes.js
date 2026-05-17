const express = require('express');

const router =
express.Router();

const {

    updateProfile

} = require(
    '../controllers/settingsController'
);


// ======================
// ROUTES
// ======================

router.put(
    '/profile',
    updateProfile
);


// ======================
// EXPORT
// ======================

module.exports =
router;