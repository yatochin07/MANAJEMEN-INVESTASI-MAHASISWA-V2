const express = require('express');
const router = express.Router();

// Endpoint dasar untuk ngetes API Guide
router.get('/status', (req, res) => {
    res.status(200).json({ 
        sukses: true, 
        pesan: "Jalur API Panduan & Edukasi siap digunakan!" 
    });
});

// Nanti lu bisa nambahin route lain di sini, 
// misalnya: router.post('/bookmark', guideController.saveBookmark)

module.exports = router;
