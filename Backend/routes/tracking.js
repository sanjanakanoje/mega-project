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


const express = require("express");
const router = express.Router();

const trackingController = require("../controllers/tracking");

router.get(
  "/test/:sampleId",
  trackingController.getTestRequirementsBySample
);

module.exports = router;