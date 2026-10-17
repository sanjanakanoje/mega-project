// const pool = require("../config/db");

// /* =========================================
//    GET TEST REQUIREMENTS BY SAMPLE ID
// ========================================= */

// exports.getTestRequirementsBySample = async (req, res) => {
//   try {
//     const { sampleId } = req.params;

//     const result = await pool.query(
//       `
//       SELECT 
//         id,
//         company_name,
//         tests_required
//       FROM test_requests
//       WHERE id = $1
//       `,
//       [sampleId]
//     );

//     // If no record found
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Sample not found"
//       });
//     }

//     const data = result.rows[0];

//     /* =========================================
//        SAFE JSON PARSING (IMPORTANT FIX)
//     ========================================= */
//     let tests = [];

//     try {
//       if (typeof data.tests_required === "string") {
//         tests = JSON.parse(data.tests_required);
//       } else {
//         tests = data.tests_required || [];
//       }
//     } catch (err) {
//       console.log("Invalid tests_required JSON:", data.tests_required);
//       tests = [];
//     }

//     /* =========================================
//        RESPONSE
//     ========================================= */
//     res.status(200).json({
//       success: true,
//       data: {
//         id: data.id,
//         company_name: data.company_name,
//         tests_required: tests
//       }
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// const pool = require("../config/db");

// exports.getTestRequirementsBySample = async (req, res) => {
//   try {
//     const { sampleId } = req.params;

//     const result = await pool.query(
//       `
//       SELECT id, company_name, tests_required
//       FROM test_requests
//       WHERE id = $1
//       `,
//       [sampleId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Sample not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: result.rows[0]
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


const pool = require('../config/db');

/*
==================================================
HELPER: VALIDATE ID
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
HELPER: CHECK LAB STAFF ROLE
==================================================
*/

function isLabStaff(req) {
  const role = req.user?.role || req.user?.Role;

  return String(role).toLowerCase() === 'labstaff';
}

/*
==================================================
HELPER: CONVERT VALUE INTO ARRAY
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
HELPER: CREATE TRACKING DATA
==================================================
*/

function prepareTrackingData(sample) {
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

  return {
    id: sample.id,
    company_name: sample.company_name,
    priority: sample.priority || 'N/A',

    // Database-style names
    tests_required: testsRequired,
    completed_tests: completedTests,

    // Frontend-style names
    testsRequired,
    completedTests,
    pendingTests,

    totalTests,
    completedCount,
    progress
  };
}

/*
==================================================
GET TEST REQUIREMENTS BY SAMPLE ID
==================================================

GET /api/tracking/test/:sampleId
==================================================
*/

exports.getTestRequirementsBySample = async (
  req,
  res
) => {
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

    const trackingData = prepareTrackingData(
      result.rows[0]
    );

    return res.status(200).json({
      success: true,
      data: trackingData
    });

  } catch (error) {
    console.error(
      'GET TEST REQUIREMENTS ERROR:',
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

    const trackingData = prepareTrackingData(
      result.rows[0]
    );

    console.log(
      'TRACKING DATA:',
      trackingData
    );

    return res.status(200).json({
      success: true,
      data: trackingData
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test request not found'
      });
    }

    const trackingData = prepareTrackingData(
      result.rows[0]
    );

    console.log(
      'UPDATED TRACKING DATA:',
      trackingData
    );

    return res.status(200).json({
      success: true,
      message: 'Completed tests updated successfully',
      data: trackingData
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