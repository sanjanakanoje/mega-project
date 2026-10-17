const pool = require('../config/db');


// =====================================================
// HELPER: GET LOGGED-IN USER ID
// =====================================================

const getLoggedInUserId = (req) => {
  return req.user?.id || req.user?.userId || req.user?.UserID || null;
};


// =====================================================
// ADD NEW REPORT / UPDATE EXISTING REPORT
// =====================================================

exports.addReport = async (req, res) => {
  try {
    const {
      id,
      sample_id,
      test_name,
      test_method,
      test_date,
      result,
      observation,
      remarks,
      notes
    } = req.body || {};

    const userId = getLoggedInUserId(req);

    console.log('ADD REPORT BODY:', req.body);
    console.log('LOGGED-IN USER:', req.user);

    // =================================================
    // AUTHENTICATION VALIDATION
    // =================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication information is missing'
      });
    }

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      sample_id === undefined ||
      sample_id === null ||
      sample_id === '' ||
      Number.isNaN(Number(sample_id))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Sample ID is required'
      });
    }

    if (!test_name || !String(test_name).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Test name is required'
      });
    }

    if (!test_method || !String(test_method).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Test method / standard is required'
      });
    }

    const sampleId = Number(sample_id);
    const testName = String(test_name).trim();
    const testMethod = String(test_method).trim();

    // =================================================
    // CHECK SAMPLE / TEST REQUEST ID
    // =================================================
    /*
      Existing project uses test_reports.sample_id.

      If your sample_id is actually coming from
      test_requests.id, this check validates it there.

      No database structure change is required.
    */

    const requestCheck = await pool.query(
      `
      SELECT id
      FROM test_requests
      WHERE id = $1
      `,
      [sampleId]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Sample/Test Request ID ${sampleId} does not exist`
      });
    }

    // =================================================
    // UPDATE EXISTING REPORT
    // =================================================

    if (id !== undefined && id !== null && id !== '') {
      const reportId = Number(id);

      if (!Number.isInteger(reportId) || reportId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid report ID is required'
        });
      }

      const updateResult = await pool.query(
        `
        UPDATE test_reports
        SET
          sample_id = $1,
          test_name = $2,
          test_method = $3,
          test_date = $4,
          result = $5,
          observation = $6,
          remarks = $7,
          notes = $8,
          created_by = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
        `,
        [
          sampleId,
          testName,
          testMethod,
          test_date || null,
          result || '',
          observation || '',
          remarks || '',
          notes || '',
          userId,
          reportId
        ]
      );

      if (updateResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Report updated successfully',
        report: updateResult.rows[0]
      });
    }

    // =================================================
    // INSERT NEW REPORT
    // =================================================

    const insertResult = await pool.query(
      `
      INSERT INTO test_reports
      (
        sample_id,
        test_name,
        test_method,
        test_date,
        result,
        observation,
        remarks,
        notes,
        created_by
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
      RETURNING *
      `,
      [
        sampleId,
        testName,
        testMethod,
        test_date || null,
        result || '',
        observation || '',
        remarks || '',
        notes || '',
        userId
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'New report saved successfully',
      report: insertResult.rows[0]
    });

  } catch (error) {
    console.error('ADD / UPDATE REPORT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to save report',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
};


// =====================================================
// GET ALL REPORTS FOR SAME SAMPLE + TEST
// =====================================================

exports.getReportsByTest = async (req, res) => {
  try {
    const { sampleId, testName } = req.params;

    const decodedTestName = decodeURIComponent(testName || '').trim();

    if (!sampleId || !decodedTestName) {
      return res.status(400).json({
        success: false,
        message: 'Sample ID and test name are required'
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM test_reports
      WHERE sample_id = $1
        AND LOWER(TRIM(test_name)) = LOWER(TRIM($2))
      ORDER BY created_at ASC
      `,
      [
        Number(sampleId),
        decodedTestName
      ]
    );

    return res.status(200).json({
      success: true,
      reports: result.rows
    });

  } catch (error) {
    console.error('GET REPORTS BY TEST ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to get reports',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
};


// =====================================================
// GET SINGLE REPORT BY ID
// =====================================================

exports.getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM test_reports
      WHERE id = $1
      `,
      [Number(reportId)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    return res.status(200).json({
      success: true,
      report: result.rows[0]
    });

  } catch (error) {
    console.error('GET REPORT BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to get report',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
};


// =====================================================
// OLD GET SINGLE REPORT
// =====================================================

exports.getReport = async (req, res) => {
  try {
    const {
      sampleId,
      testName
    } = req.params;

    const decodedTestName = decodeURIComponent(testName || '').trim();

    const result = await pool.query(
      `
      SELECT *
      FROM test_reports
      WHERE sample_id = $1
        AND LOWER(TRIM(test_name)) = LOWER(TRIM($2))
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [
        Number(sampleId),
        decodedTestName
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    return res.status(200).json({
      success: true,
      report: result.rows[0]
    });

  } catch (error) {
    console.error('GET REPORT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to get report',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
};


// =====================================================
// GET ALL REPORTS FOR SAMPLE
// =====================================================
// =====================================================
// GET ALL REPORTS FOR SAMPLE
// =====================================================

exports.getReportsBySample = async (req, res) => {
  try {
    const { sampleId } = req.params;

    console.log('GET REPORTS BY SAMPLE ID:', sampleId);

    // Validate sample ID
    if (
      sampleId === undefined ||
      sampleId === null ||
      sampleId === '' ||
      !Number.isInteger(Number(sampleId)) ||
      Number(sampleId) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid sample ID is required'
      });
    }

    const numericSampleId = Number(sampleId);

    const result = await pool.query(
      `
      SELECT
        id,
        sample_id,
        test_name,
        test_method,
        test_date,
        result,
        observation,
        remarks,
        notes,
        created_by,
        created_at,
        updated_at
      FROM test_reports
      WHERE sample_id = $1
      ORDER BY created_at DESC
      `,
      [numericSampleId]
    );

    console.log(
      'REPORTS FOUND:',
      result.rows.length
    );

    console.log(
      'REPORT DATA:',
      result.rows
    );

    return res.status(200).json({
      success: true,
      reports: result.rows
    });

  } catch (error) {
    console.error(
      'GET SAMPLE REPORTS ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to get reports',
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined
    });
  }
};