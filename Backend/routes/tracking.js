const express = require("express");
const router = express.Router();

const trackingController = require("../controllers/tracking");

// scan barcode → fetch tests only
router.get("/test/:sampleId", trackingController.getTestRequirementsBySample);

module.exports = router;