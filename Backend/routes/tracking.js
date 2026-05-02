const express = require('express');
const router = express.Router();

const tracking =
require('../controllers/tracking');

router.post('/scan', tracking.scanBarcode);

router.get('/history/:barcode',
tracking.getHistory);

module.exports = router;