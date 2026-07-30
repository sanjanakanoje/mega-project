const express = require('express');
const router = express.Router();

const testController =
require('../controllers/tests');


router.post(
  '/create',
  testController.createTestRequest
);

router.get(
  '/',
  testController.getAllTests
);

router.get(
  '/:id',
  testController.getSingleTest
);

router.delete(
  '/:id',
  testController.deleteTest
);

router.put('/:id/completed', testController.updateCompletedTests);


module.exports = router;