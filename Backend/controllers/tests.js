const pool = require('../config/db');


/* =========================================
   CREATE TEST REQUEST
========================================= */

exports.createTestRequest = async (req, res) => {
  try {

    const {
      customerId,
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
    } = req.body;

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
        tests_required
      )

      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,$14,$15,$16,
        $17,$18,$19,
        $20,$21,$22,$23,$24
      )

      RETURNING *
      `,
      [
        customerId,
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

        JSON.stringify(finishTypes || []),
        JSON.stringify(divisions || []),
        JSON.stringify(packageTypes || []),
        JSON.stringify(testsRequired || [])
      ]
    );

    res.status(201).json({
      success: true,
      message: "Test Request Created",
      data: result.rows[0]
    });

  } 
  catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* =========================================
   GET ALL TEST REQUESTS
========================================= */

// exports.getAllTests = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     const result = await pool.query(
//       `
//       SELECT
//         id,
//         company_name,
//         finish_type,
//         tests_required,
//         fiber_content,
//         fabric_weight,
//         created_at
//       FROM test_requests
//       WHERE customer_id = $1
//       ORDER BY id DESC
//       `,
//       [userId]
//     );

//     res.status(200).json(result.rows);

//   } 

//     catch (error) {
//       console.error('Create Test Request Error:', error);

//       res.status(500).json({
//         message: error.message
//       });
//     }


// };






exports.getAllTests = async (req, res) => {
  try {
    const userId = req.query.userId;

    const result = await pool.query(
      `
      SELECT
        id,
        company_name,
        fiber_content,
        fabric_weight,
        finish_type,
        tests_required,
        created_at
      FROM test_requests
      WHERE customer_id = $1
      ORDER BY id DESC
      `,
      [userId]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Get All Tests Error:', error);
    res.status(500).json({
      message: error.message
    });
  }
};



/* =========================================
   GET SINGLE TEST REQUEST
========================================= */

exports.getSingleTest = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM test_requests WHERE customer_id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* =========================================
   DELETE TEST REQUEST
========================================= */

exports.deleteTest = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `DELETE FROM test_requests WHERE customer_id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};