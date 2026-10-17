// const express = require("express");
// const router = express.Router();

// const trackingController = require("../controllers/tracking");

// // scan barcode → fetch tests only
// router.get("/test/:sampleId", trackingController.getTestRequirementsBySample);

// // Customer Tracking Page
// router.get('/:id', trackingController.getTrackingDetails);

// // Save Completed Tests
// router.put('/:id/completed', trackingController.updateCompletedTests);

// module.exports = router;


// const express = require("express");
// const router = express.Router();

// const trackingController = require("../controllers/tracking");

// router.get(
//   "/test/:sampleId",
//   trackingController.getTestRequirementsBySample
// );

// module.exports = router;


const express = require('express');

const router = express.Router();

const trackingController = require('../controllers/tracking');

const {
  authenticateToken
} = require('../middleware/authMiddleware');

/*
==================================================
GET TEST REQUIREMENTS
==================================================
*/

router.get(
  '/test/:sampleId',
  authenticateToken,
  trackingController.getTestRequirementsBySample
);

/*
==================================================
GET TRACKING DETAILS
==================================================
*/

router.get(
  '/:id',
  authenticateToken,
  trackingController.getTrackingDetails
);

/*
==================================================
UPDATE COMPLETED TESTS
==================================================
*/

router.put(
  '/:id/completed',
  authenticateToken,
  trackingController.updateCompletedTests
);

module.exports = router;