const pool = require('../config/db');

// exports.addSample = async (req, res) => {
//   try {
//     const {
//       userid,
//       samplename,
//       sampletype,
//       quantity,
//       barcode,
//       priority,
//       predictedcompletiontime
//     } = req.body;

//     const result = await pool.query(
//       `INSERT INTO samples
//       (userid, samplename, sampletype, quantity, barcode, priority, status, predictedcompletiontime, datereceived)
//       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
//       RETURNING *`,
//       [
//         userid,
//         samplename,
//         sampletype,
//         quantity,
//         barcode,
//         priority,
//         'Pending',
//         predictedcompletiontime
//       ]
//     );

//     console.log("Inserted Row:", result.rows[0]);

//     res.status(201).json({
//       success: true,
//       message: "Sample Added Successfully",
//       data: result.rows[0]
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

exports.addSample = async (req, res) => {
  try {
    const {
      userid,
      sampletype,
      barcode,
      predictedcompletiontime
    } = req.body;

    console.log("BODY:", req.body); // debug

    const result = await pool.query(
      `INSERT INTO samples
      (userid, sampletype, barcode, status, predictedcompletiontime, datereceived)
      VALUES ($1,$2,$3,$4,$5,NOW())
      RETURNING *`,
      [
        userid,
        sampletype,
        barcode,
        'Pending',
        predictedcompletiontime
      ]
    );

    res.status(201).json({
      success: true,
      message: "Sample Added Successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getAllSamples = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM samples ORDER BY sampleid DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSampleById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      'SELECT * FROM samples WHERE sampleid=$1',
      [id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};