// const express = require('express');
// const router = express.Router();

// const reportController = require('../controllers/report');

// // Add / Update report
// router.post('/', reportController.addReport);

// // Get all reports for a sample
// router.get('/sample/:sampleId', reportController.getReportsBySample);

// // Get one report
// router.get('/:sampleId/:testName', reportController.getReport);

// module.exports = router;

















const express = require('express');

const router = express.Router();

const reportController =
    require('../controllers/report');


// =====================================================
// ADD NEW / UPDATE EXISTING REPORT
// =====================================================

router.post(
    '/',
    reportController.addReport
);


// =====================================================
// GET ALL REPORTS FOR SAMPLE + TEST
// IMPORTANT: keep before /:sampleId/:testName
// =====================================================

router.get(
    '/test/:sampleId/:testName',
    reportController.getReportsByTest
);


// =====================================================
// GET SINGLE REPORT BY REPORT ID
// =====================================================

router.get(
    '/id/:reportId',
    reportController.getReportById
);


// =====================================================
// GET ALL REPORTS FOR SAMPLE
// =====================================================

router.get(
    '/sample/:sampleId',
    reportController.getReportsBySample
);


// =====================================================
// OLD GET SINGLE REPORT
// =====================================================

router.get(
    '/:sampleId/:testName',
    reportController.getReport
);


module.exports = router;











