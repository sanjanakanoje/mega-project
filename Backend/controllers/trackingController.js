// const pool = require("../config/db");

// /*
// =========================================
// GET TRACKING DETAILS
// =========================================
// */

// exports.getTrackingDetails = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const result = await pool.query(
//       `
//       SELECT
//         id,
//         company_name,
//         priority,
//         tests_required,
//         completed_tests
//       FROM test_requests
//       WHERE id = $1
//       `,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Sample not found"
//       });
//     }

//     const sample = result.rows[0];

//     // Parse tests_required safely
//     let testsRequired = [];

//     try {
//       if (typeof sample.tests_required === "string") {
//         testsRequired = JSON.parse(sample.tests_required);
//       } else {
//         testsRequired = sample.tests_required || [];
//       }
//     } catch (err) {
//       testsRequired = [];
//     }

//     // Parse completed_tests safely
//     let completedTests = [];

//     try {
//       if (typeof sample.completed_tests === "string") {
//         completedTests = JSON.parse(sample.completed_tests);
//       } else {
//         completedTests = sample.completed_tests || [];
//       }
//     } catch (err) {
//       completedTests = [];
//     }

//     const pendingTests = testsRequired.filter(
//       test => !completedTests.includes(test)
//     );

//     res.status(200).json({
//       success: true,
//       data: {
//         id: sample.id,
//         company_name: sample.company_name,
//         priority: sample.priority,
//         testsRequired,
//         completedTests,
//         pendingTests,
//         totalTests: testsRequired.length,
//         completedCount: completedTests.length
//       }
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// /*
// =========================================
// UPDATE COMPLETED TESTS
// =========================================
// */
// exports.updateCompletedTests = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { completedTests } = req.body;

//     if (!Array.isArray(completedTests)) {
//       return res.status(400).json({
//         success: false,
//         message: 'completedTests must be an array'
//       });
//     }

//     const result = await pool.query(
//       `
//       UPDATE test_requests
//       SET completed_tests = $1::jsonb
//       WHERE id = $2
//       RETURNING *
//       `,
//       [
//         JSON.stringify(completedTests),
//         id
//       ]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Test request not found'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Completed tests updated successfully',
//       data: result.rows[0]
//     });

//   } catch (error) {
//     console.error(
//       'Update completed tests error:',
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: 'Failed to update completed tests',
//       error: error.message
//     });
//   }
// };



const pool = require('../config/db');

/*
==================================================
HELPER: CHECK VALID ID
==================================================
*/

function isValidId(id) {
  return (
    id !== undefined &&
    id !== null &&
    String(id).trim() !== '' &&
    Number.isInteger(Number(id)) &&
    Number(id) > 0
  );
}

/*
==================================================
HELPER: CHECK LAB STAFF
==================================================
*/

function isLabStaff(req) {
  const role = req.user?.role || req.user?.Role;

  return String(role).toLowerCase() === 'labstaff';
}

/*
==================================================
HELPER: NORMALIZE JSON ARRAY
==================================================
*/

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value);

      return Array.isArray(parsedValue)
        ? parsedValue
        : [];
    } catch (error) {
      return [];
    }
  }

  return [];
}

/*
==================================================
GET TEST REQUIREMENTS BY SAMPLE ID
==================================================

GET /api/tracking/test/:sampleId
==================================================
*/

exports.getTestRequirementsBySample = async (req, res) => {
  try {
    const { sampleId } = req.params;

    if (!isValidId(sampleId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sample ID'
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        company_name,
        priority,
        tests_required,
        completed_tests
      FROM test_requests
      WHERE id = $1
      `,
      [Number(sampleId)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sample not found'
      });
    }

    const sample = result.rows[0];

    const testsRequired = normalizeArray(
      sample.tests_required
    );

    const completedTests = normalizeArray(
      sample.completed_tests
    );

    const pendingTests = testsRequired.filter(
      test => !completedTests.includes(test)
    );

    const totalTests = testsRequired.length;

    const completedCount = completedTests.length;

    const progress = totalTests > 0
      ? Math.round(
          (completedCount / totalTests) * 100
        )
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        id: sample.id,
        company_name: sample.company_name,
        priority: sample.priority,

        // Original database-style names
        tests_required: testsRequired,
        completed_tests: completedTests,

        // Frontend-friendly names
        testsRequired,
        completedTests,
        pendingTests,

        totalTests,
        completedCount,
        progress
      }
    });

  } catch (error) {
    console.error(
      'GET TEST REQUIREMENTS BY SAMPLE ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch test requirements',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
};

/*
==================================================
GET TRACKING DETAILS
==================================================

GET /api/tracking/:id
==================================================
*/

exports.getTrackingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tracking ID'
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        company_name,
        priority,
        tests_required,
        completed_tests
      FROM test_requests
      WHERE id = $1
      `,
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sample not found'
      });
    }

    const sample = result.rows[0];

    const testsRequired = normalizeArray(
      sample.tests_required
    );

    const completedTests = normalizeArray(
      sample.completed_tests
    );

    const pendingTests = testsRequired.filter(
      test => !completedTests.includes(test)
    );

    const totalTests = testsRequired.length;

    const completedCount = completedTests.length;

    const progress = totalTests > 0
      ? Math.round(
          (completedCount / totalTests) * 100
        )
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        id: sample.id,
        company_name: sample.company_name,
        priority: sample.priority,

        // Database-style fields
        tests_required: testsRequired,
        completed_tests: completedTests,

        // Frontend-style fields
        testsRequired,
        completedTests,
        pendingTests,

        totalTests,
        completedCount,
        progress
      }
    });

  } catch (error) {
    console.error(
      'GET TRACKING DETAILS ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tracking details',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
};

/*
==================================================
UPDATE COMPLETED TESTS
==================================================

PUT /api/tracking/:id/completed
==================================================
*/

exports.updateCompletedTests = async (req, res) => {
  try {
    const { id } = req.params;
    const { completedTests } = req.body || {};

    /*
    ----------------------------------------------
    CHECK LAB STAFF
    ----------------------------------------------
    */

    if (!isLabStaff(req)) {
      return res.status(403).json({
        success: false,
        message: 'Only LabStaff can update completed tests'
      });
    }

    /*
    ----------------------------------------------
    VALIDATE ID
    ----------------------------------------------
    */

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test request ID'
      });
    }

    /*
    ----------------------------------------------
    VALIDATE ARRAY
    ----------------------------------------------
    */

    if (!Array.isArray(completedTests)) {
      return res.status(400).json({
        success: false,
        message: 'completedTests must be an array'
      });
    }

    /*
    ----------------------------------------------
    CLEAN TEST NAMES
    ----------------------------------------------
    */

    const cleanedCompletedTests = [
      ...new Set(
        completedTests
          .filter(
            test =>
              typeof test === 'string' &&
              test.trim().length > 0
          )
          .map(test => test.trim())
      )
    ];

    /*
    ----------------------------------------------
    UPDATE DATABASE
    ----------------------------------------------
    */

    const result = await pool.query(
      `
      UPDATE test_requests
      SET completed_tests = $1::jsonb
      WHERE id = $2
      RETURNING
        id,
        company_name,
        priority,
        tests_required,
        completed_tests
      `,
      [
        JSON.stringify(cleanedCompletedTests),
        Number(id)
      ]
    );

    /*
    ----------------------------------------------
    CHECK RECORD
    ----------------------------------------------
    */

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test request not found'
      });
    }

    const updatedSample = result.rows[0];

    const testsRequired = normalizeArray(
      updatedSample.tests_required
    );

    const completedTestsFromDatabase = normalizeArray(
      updatedSample.completed_tests
    );

    const pendingTests = testsRequired.filter(
      test => !completedTestsFromDatabase.includes(test)
    );

    const totalTests = testsRequired.length;

    const completedCount =
      completedTestsFromDatabase.length;

    const progress = totalTests > 0
      ? Math.round(
          (completedCount / totalTests) * 100
        )
      : 0;

    /*
    ----------------------------------------------
    SUCCESS RESPONSE
    ----------------------------------------------
    */

    return res.status(200).json({
      success: true,
      message: 'Completed tests updated successfully',

      data: {
        id: updatedSample.id,
        company_name: updatedSample.company_name,
        priority: updatedSample.priority,

        testsRequired,
        completedTests: completedTestsFromDatabase,
        pendingTests,

        totalTests,
        completedCount,
        progress
      }
    });

  } catch (error) {
    console.error(
      'UPDATE COMPLETED TESTS ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update completed tests',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
};