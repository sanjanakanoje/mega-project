// const express = require('express');
// const router = express.Router();

// const testController =
// require('../controllers/tests');


// router.post(
//   '/create',
//   testController.createTestRequest
// );

// router.get(
//   '/',
//   testController.getAllTests
// );

// router.get(
//   '/:id',
//   testController.getSingleTest
// );

// router.delete(
//   '/:id',
//   testController.deleteTest
// );

// router.put('/:id/completed', testController.updateCompletedTests);


// module.exports = router;


// routes/tests.js

const express = require('express');

const router = express.Router();


// =====================================================
// CONTROLLER IMPORT
// =====================================================

const {
  createTestRequest,
  getAllTests,
  getSingleTest,
  updateCompletedTests,
  deleteTest
} = require('../controllers/tests');


// =====================================================
// AUTH MIDDLEWARE IMPORT
// =====================================================

const {
  authenticateToken
} = require('../middleware/authMiddleware');


// =====================================================
// DEBUG HANDLER TYPES
// =====================================================

console.log('Tests route handlers:', {
  createTestRequest: typeof createTestRequest,
  getAllTests: typeof getAllTests,
  getSingleTest: typeof getSingleTest,
  updateCompletedTests: typeof updateCompletedTests,
  deleteTest: typeof deleteTest,
  authenticateToken: typeof authenticateToken
});


// =====================================================
// CREATE TEST REQUEST
// POST /api/tests/create
// =====================================================

router.post(
  '/create',
  authenticateToken,
  createTestRequest
);


// =====================================================
// GET ALL TEST REQUESTS
// GET /api/tests
// =====================================================

router.get(
  '/',
  authenticateToken,
  getAllTests
);


// =====================================================
// GET SINGLE TEST REQUEST
// GET /api/tests/:id
// =====================================================

router.get(
  '/:id',
  authenticateToken,
  getSingleTest
);


// =====================================================
// UPDATE COMPLETED TESTS
// PUT /api/tests/:id/completed
// =====================================================

router.put(
  '/:id/completed',
  authenticateToken,
  updateCompletedTests
);


// =====================================================
// DELETE TEST REQUEST
// DELETE /api/tests/:id
// =====================================================

router.delete(
  '/:id',
  authenticateToken,
  deleteTest
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;