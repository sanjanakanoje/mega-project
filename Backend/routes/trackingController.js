// const express = require("express");
// const router = express.Router();

// const trackingController = require("../controllers/trackingController");

// router.get(
//   "/:id",
//   trackingController.getTrackingDetails
// );

// router.put(
//   "/:id/completed",
//   trackingController.updateCompletedTests
// );

// module.exports = router;


const express = require('express');
const router = express.Router();

const trackingController =
  require('../controllers/trackingController');

router.get('/:id', trackingController.getTrackingDetails);

router.put(
  '/:id/completed',
  trackingController.updateCompletedTests
);

module.exports = router;