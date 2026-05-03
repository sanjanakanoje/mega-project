// const express = require('express');
// const router = express.Router();

// const sampleController =
// require('../controllers/sample');

// router.post('/add', sampleController.addSample);

// router.get('/', sampleController.getAllSamples);

// router.get('/:id', sampleController.getSampleById);

// module.exports = router;

const express = require('express');
const router = express.Router();
const sampleController = require('../controllers/sample');

router.get('/', sampleController.getAllSamples);

router.get('/:id', sampleController.getSampleById);

router.post('/add', sampleController.addSample);

router.get('/user/:userId', sampleController.getSamplesByUser);

module.exports = router;