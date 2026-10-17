// const pool = require('../config/db');


// /* =========================================
//    CREATE TEST REQUEST
// ========================================= */

// exports.createTestRequest = async (req, res) => {
//   try {

//     const {
//       customerId,
//       companyName,
//       submittedBy,
//       merchantName,
//       brandLabelName,
//       vendorCode,
//       email,
//       phoneNo,

//       sampleDescription,
//       styleNo,
//       season,
//       fiberContent,
//       fabricWeight,
//       countNo,
//       color,
//       construction,
//       endUse,

//       washInstruction,
//       washCode,
//       priority,

//       finishTypes,
//       divisions,
//       packageTypes,
//       testsRequired
//     } = req.body;

//     const result = await pool.query(
//       `
//       INSERT INTO test_requests
//       (
//         customer_id,
//         company_name,
//         submitted_by,
//         merchant_name,
//         brand_label_name,
//         vendor_code,
//         email,
//         phone_no,

//         sample_description,
//         style_no,
//         season,
//         fiber_content,
//         fabric_weight,
//         count_no,
//         color,
//         construction,
//         end_use,

//         wash_instruction,
//         wash_code,
//         priority,

//         finish_type,
//         division,
//         package_type,
//         tests_required
//       )

//       VALUES
//       (
//         $1,$2,$3,$4,$5,$6,$7,
//         $8,$9,$10,$11,$12,$13,$14,$15,$16,
//         $17,$18,$19,
//         $20,$21,$22,$23,$24
//       )

//       RETURNING *
//       `,
//       [
//         customerId,
//         companyName,
//         submittedBy,
//         merchantName,
//         brandLabelName,
//         vendorCode,
//         email,
//         phoneNo,

//         sampleDescription,
//         styleNo,
//         season,
//         fiberContent,
//         fabricWeight,
//         countNo,
//         color,
//         construction,
//         endUse,

//         washInstruction,
//         washCode,
//         priority,

//         JSON.stringify(finishTypes || []),
//         JSON.stringify(divisions || []),
//         JSON.stringify(packageTypes || []),
//         JSON.stringify(testsRequired || [])
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: "Test Request Created",
//       data: result.rows[0]
//     });

//   } 
//   catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };







// exports.getAllTests = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     let result;

//     if (userId) {
//       result = await pool.query(
//         `
//         SELECT *
//         FROM test_requests
//         WHERE customer_id = $1
//         ORDER BY id DESC
//         `,
//         [userId]
//       );
//     } else {
//       // 🔥 fallback (for testing)
//       result = await pool.query(
//         `
//         SELECT *
//         FROM test_requests
//         ORDER BY id DESC
//         `
//       );
//     }

//     res.status(200).json(result.rows);

//   } catch (error) {
//     console.error('Get All Tests Error:', error);
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };




// /* =========================================
//    DELETE TEST REQUEST
// ========================================= */

// exports.deleteTest = async (req, res) => {
//   try {

//     const { id } = req.params;

//     await pool.query(
//       `DELETE FROM test_requests WHERE customer_id = $1`,
//       [id]
//     );

//     res.status(200).json({
//       success: true,
//       message: "Deleted Successfully"
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };


// // GET SINGLE TEST
// exports.getSingleTest = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `SELECT * FROM test_requests WHERE id = $1`,
//       [id]
//     );

//     res.json({
//       success: true,
//       data: result.rows[0]
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// // UPDATE COMPLETED TESTS
// exports.updateCompletedTests = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { completedTests } = req.body;

//     const result = await pool.query(
//       `UPDATE test_requests 
//        SET completed_tests = $1
//        WHERE id = $2
//        RETURNING *`,
//       [completedTests, id]
//     );

//     res.json({
//       success: true,
//       data: result.rows[0]
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };
// controllers/tests.js

const pool = require('../config/db');


// =====================================================
// HELPER: GET LOGGED-IN USER ID
// =====================================================

function getLoggedInUserId(req) {
  const user = req.user || {};

  return (
    user.id ??
    user.userId ??
    user.UserID ??
    user.userid ??
    user.user_id ??
    null
  );
}


// =====================================================
// HELPER: GET USER ROLE
// =====================================================

function getUserRole(req) {
  const user = req.user || {};

  return (
    user.role ??
    user.Role ??
    user.ROLE ??
    user.user_role ??
    ''
  );
}


// =====================================================
// HELPER: CHECK LAB STAFF
// =====================================================

function isLabStaff(req) {
  const role = getUserRole(req);

  return (
    role === 'LabStaff' ||
    role === 'labstaff' ||
    role === 'LABSTAFF'
  );
}


// =====================================================
// HELPER: VALIDATE ID
// =====================================================

function isValidId(id) {
  const numericId = Number(id);

  return (
    Number.isInteger(numericId) &&
    numericId > 0
  );
}


// =====================================================
// CREATE TEST REQUEST
// POST /api/tests/create
// =====================================================

async function createTestRequest(req, res) {
  try {
    const customerId = getLoggedInUserId(req);

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }

    const {
      companyName,
      submittedBy,
      merchantName,
      brandLabelName,
      vendorCode,
      email,
      phoneNo,

      sampleDescription,
      styleNo,
      season,
      fiberContent,
      fabricWeight,
      countNo,
      color,
      construction,
      endUse,

      washInstruction,
      washCode,
      priority,

      finishTypes,
      divisions,
      packageTypes,
      testsRequired
    } = req.body || {};

    const safeFinishTypes =
      Array.isArray(finishTypes)
        ? finishTypes
        : [];

    const safeDivisions =
      Array.isArray(divisions)
        ? divisions
        : [];

    const safePackageTypes =
      Array.isArray(packageTypes)
        ? packageTypes
        : [];

    const safeTestsRequired =
      Array.isArray(testsRequired)
        ? testsRequired
        : [];

    const result = await pool.query(
      `
      INSERT INTO test_requests
      (
        customer_id,
        company_name,
        submitted_by,
        merchant_name,
        brand_label_name,
        vendor_code,
        email,
        phone_no,

        sample_description,
        style_no,
        season,
        fiber_content,
        fabric_weight,
        count_no,
        color,
        construction,
        end_use,

        wash_instruction,
        wash_code,
        priority,

        finish_type,
        division,
        package_type,
        tests_required,
        completed_tests
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20,
        $21::jsonb,
        $22::jsonb,
        $23::jsonb,
        $24::jsonb,
        $25::jsonb
      )
      RETURNING *
      `,
      [
        customerId,

        companyName || null,
        submittedBy || null,
        merchantName || null,
        brandLabelName || null,
        vendorCode || null,
        email || null,
        phoneNo || null,

        sampleDescription || null,
        styleNo || null,
        season || null,
        fiberContent || null,
        fabricWeight || null,
        countNo || null,
        color || null,
        construction || null,
        endUse || null,

        washInstruction || null,
        washCode || null,
        priority || null,

        JSON.stringify(safeFinishTypes),
        JSON.stringify(safeDivisions),
        JSON.stringify(safePackageTypes),
        JSON.stringify(safeTestsRequired),
        JSON.stringify([])
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Test Request Created Successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error(
      'CREATE TEST REQUEST ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to create test request',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
}


// =====================================================
// GET ALL TEST REQUESTS
// Customer: Own requests
// LabStaff: All requests
// GET /api/tests
// =====================================================

async function getAllTests(req, res) {
  try {
    const loggedInUserId =
      getLoggedInUserId(req);

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }

    let result;

    if (isLabStaff(req)) {
      result = await pool.query(
        `
        SELECT *
        FROM test_requests
        ORDER BY id DESC
        `
      );
    } else {
      result = await pool.query(
        `
        SELECT *
        FROM test_requests
        WHERE customer_id = $1
        ORDER BY id DESC
        `,
        [
          loggedInUserId
        ]
      );
    }

    return res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error(
      'GET ALL TESTS ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to load test requests',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
}


// =====================================================
// GET SINGLE TEST REQUEST
// Customer: Own request only
// LabStaff: Any request
// GET /api/tests/:id
// =====================================================

async function getSingleTest(req, res) {
  try {
    const {
      id
    } = req.params;

    const loggedInUserId =
      getLoggedInUserId(req);

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test request ID'
      });
    }

    let result;

    if (isLabStaff(req)) {
      result = await pool.query(
        `
        SELECT
          id,
          customer_id,
          company_name,
          submitted_by,
          merchant_name,
          brand_label_name,
          vendor_code,
          email,
          phone_no,
          sample_description,
          style_no,
          season,
          fiber_content,
          fabric_weight,
          count_no,
          color,
          construction,
          end_use,
          wash_instruction,
          wash_code,
          priority,
          finish_type,
          division,
          package_type,
          tests_required,
          completed_tests,
          sample_id,
          created_at
        FROM test_requests
        WHERE id = $1
        `,
        [
          Number(id)
        ]
      );
    } else {
      result = await pool.query(
        `
        SELECT
          id,
          customer_id,
          company_name,
          submitted_by,
          merchant_name,
          brand_label_name,
          vendor_code,
          email,
          phone_no,
          sample_description,
          style_no,
          season,
          fiber_content,
          fabric_weight,
          count_no,
          color,
          construction,
          end_use,
          wash_instruction,
          wash_code,
          priority,
          finish_type,
          division,
          package_type,
          tests_required,
          completed_tests,
          sample_id,
          created_at
        FROM test_requests
        WHERE id = $1
        AND customer_id = $2
        `,
        [
          Number(id),
          loggedInUserId
        ]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test Request Not Found'
      });
    }

    const row = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        ...row,

        tests_required:
          Array.isArray(row.tests_required)
            ? row.tests_required
            : [],

        completed_tests:
          Array.isArray(row.completed_tests)
            ? row.completed_tests
            : []
      }
    });

  } catch (error) {
    console.error(
      'GET SINGLE TEST ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to load test request',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
}


// =====================================================
// UPDATE COMPLETED TESTS
// Only LabStaff
// PUT /api/tests/:id/completed
// =====================================================
// ==========================================
// UPDATE COMPLETED TESTS
// ==========================================

async function updateCompletedTests(req, res) {
  try {
    const { id } = req.params;
    const { completedTests } = req.body || {};

    // --------------------------------------
    // CHECK LAB STAFF ROLE
    // --------------------------------------

    if (!isLabStaff(req)) {
      return res.status(403).json({
        success: false,
        message: 'Only LabStaff can update completed tests'
      });
    }

    // --------------------------------------
    // VALIDATE TEST REQUEST ID
    // --------------------------------------

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test request ID'
      });
    }

    // --------------------------------------
    // VALIDATE COMPLETED TESTS ARRAY
    // --------------------------------------

    if (!Array.isArray(completedTests)) {
      return res.status(400).json({
        success: false,
        message: 'completedTests must be an array'
      });
    }

    // --------------------------------------
    // CLEAN AND VALIDATE TEST NAMES
    // --------------------------------------

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

    // --------------------------------------
    // UPDATE DATABASE
    // --------------------------------------

    const result = await pool.query(
      `
      UPDATE test_requests
      SET completed_tests = $1::jsonb
      WHERE id = $2
      RETURNING
        id,
        company_name,
        tests_required,
        completed_tests,
        created_at
      `,
      [
        JSON.stringify(cleanedCompletedTests),
        Number(id)
      ]
    );

    // --------------------------------------
    // CHECK RECORD FOUND
    // --------------------------------------

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test request not found'
      });
    }

    // --------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------

    return res.status(200).json({
      success: true,
      message: 'Completed tests updated successfully',
      data: result.rows[0]
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
}

// =====================================================
// DELETE TEST REQUEST
// Customer: Own request only
// LabStaff: Any request
// DELETE /api/tests/:id
// =====================================================

async function deleteTest(req, res) {
  try {
    const {
      id
    } = req.params;

    const loggedInUserId =
      getLoggedInUserId(req);

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test request ID'
      });
    }

    let result;

    if (isLabStaff(req)) {
      result = await pool.query(
        `
        DELETE FROM test_requests
        WHERE id = $1
        RETURNING *
        `,
        [
          Number(id)
        ]
      );
    } else {
      result = await pool.query(
        `
        DELETE FROM test_requests
        WHERE id = $1
        AND customer_id = $2
        RETURNING *
        `,
        [
          Number(id),
          loggedInUserId
        ]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Record Not Found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Deleted Successfully'
    });

  } catch (error) {
    console.error(
      'DELETE TEST ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to delete test request',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createTestRequest,
  getAllTests,
  getSingleTest,
  updateCompletedTests,
  deleteTest
};