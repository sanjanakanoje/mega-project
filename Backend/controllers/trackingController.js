const pool = require("../config/db");

/*
=========================================
GET TRACKING DETAILS
=========================================
*/

exports.getTrackingDetails = async (req, res) => {
  try {

    const { id } = req.params;

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
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sample not found"
      });
    }

    const sample = result.rows[0];

    // Parse tests_required safely
    let testsRequired = [];

    try {
      if (typeof sample.tests_required === "string") {
        testsRequired = JSON.parse(sample.tests_required);
      } else {
        testsRequired = sample.tests_required || [];
      }
    } catch (err) {
      testsRequired = [];
    }

    // Parse completed_tests safely
    let completedTests = [];

    try {
      if (typeof sample.completed_tests === "string") {
        completedTests = JSON.parse(sample.completed_tests);
      } else {
        completedTests = sample.completed_tests || [];
      }
    } catch (err) {
      completedTests = [];
    }

    const pendingTests = testsRequired.filter(
      test => !completedTests.includes(test)
    );

    res.status(200).json({
      success: true,
      data: {
        id: sample.id,
        company_name: sample.company_name,
        priority: sample.priority,
        testsRequired,
        completedTests,
        pendingTests,
        totalTests: testsRequired.length,
        completedCount: completedTests.length
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/*
=========================================
UPDATE COMPLETED TESTS
=========================================
*/

exports.updateCompletedTests = async (req, res) => {
  try {

    const { id } = req.params;
    const { completedTests } = req.body;

    const result = await pool.query(
      `
      UPDATE test_requests
      SET completed_tests = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        JSON.stringify(completedTests),
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sample not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Completed tests updated successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};