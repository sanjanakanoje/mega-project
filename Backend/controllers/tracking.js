const pool = require("../config/db");

/* =========================================
   GET TEST REQUIREMENTS BY SAMPLE ID
========================================= */

exports.getTestRequirementsBySample = async (req, res) => {
  try {
    const { sampleId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        id,
        company_name,
        tests_required
      FROM test_requests
      WHERE id = $1
      `,
      [sampleId]
    );

    // If no record found
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sample not found"
      });
    }

    const data = result.rows[0];

    /* =========================================
       SAFE JSON PARSING (IMPORTANT FIX)
    ========================================= */
    let tests = [];

    try {
      if (typeof data.tests_required === "string") {
        tests = JSON.parse(data.tests_required);
      } else {
        tests = data.tests_required || [];
      }
    } catch (err) {
      console.log("Invalid tests_required JSON:", data.tests_required);
      tests = [];
    }

    /* =========================================
       RESPONSE
    ========================================= */
    res.status(200).json({
      success: true,
      data: {
        id: data.id,
        company_name: data.company_name,
        tests_required: tests
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};