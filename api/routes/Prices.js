const express = require('express');

const router = express.Router();

// GET /prices
router.get('/prices/', (req, res) => {
    res.json({ message: 'Prices route is working!' });
});

module.exports = router;