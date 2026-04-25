const express = require('express');
const router = express.Router();

const sampleController =
require('../controllers/sample');

router.post('/add', sampleController.addSample);

router.get('/all', sampleController.getAllSamples);

router.get('/:id', sampleController.getSampleById);

module.exports = router;