const express = require('express');

const router = express.Router();

const reportController = require('../controllers/report');

// Change this path if your middleware file has another name
const {
  authenticateToken
} = require('../middleware/authMiddleware');

// =====================================================
// ADD NEW / UPDATE EXISTING REPORT
// =====================================================

router.post(
  '/',
  authenticateToken,
  reportController.addReport
);


// =====================================================
// GET ALL REPORTS FOR SAMPLE + TEST
// =====================================================

router.get(
  '/test/:sampleId/:testName',
  authenticateToken,
  reportController.getReportsByTest
);


// =====================================================
// GET SINGLE REPORT BY REPORT ID
// =====================================================

router.get(
  '/id/:reportId',
  authenticateToken,
  reportController.getReportById
);


// =====================================================
// GET ALL REPORTS FOR SAMPLE
// =====================================================

router.get(
  '/sample/:sampleId',
  authenticateToken,
  reportController.getReportsBySample
);


// =====================================================
// OLD GET SINGLE REPORT
// =====================================================

router.get(
  '/:sampleId/:testName',
  authenticateToken,
  reportController.getReport
);


module.exports = router;