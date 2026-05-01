// Backend/controllers/tracking.controller.js

const pool = require('../config/db');


// =====================================================
// 1. Scan Barcode & Auto Update Tracking Status
// =====================================================
exports.scanBarcode = async (req, res) => {

  try {

    const { barcode, updatedby } = req.body;

    // Find sample by barcode
    const sampleResult = await pool.query(
      `
      SELECT *
      FROM samples
      WHERE barcode = $1
      `,
      [barcode]
    );

    if (sampleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sample not found'
      });
    }

    const sample = sampleResult.rows[0];

    let nextStage = '';

    // Current status -> Next status
    switch (sample.status) {

      case 'Pending':
        nextStage = 'Received';
        break;

      case 'Received':
        nextStage = 'Testing Started';
        break;

      case 'Testing Started':
        nextStage = 'Chemical Test Completed';
        break;

      case 'Chemical Test Completed':
        nextStage = 'Quality Check';
        break;

      case 'Quality Check':
        nextStage = 'Report Generated';
        break;

      case 'Report Generated':
        nextStage = 'Delivered';
        break;

      default:
        nextStage = 'Completed';
        break;
    }

    // Update sample main status
    await pool.query(
      `
      UPDATE samples
      SET status = $1
      WHERE sampleid = $2
      `,
      [nextStage, sample.sampleid]
    );

    // Insert tracking history
    await pool.query(
      `
      INSERT INTO tracking
      (sampleid, stagename, timestamp, updatedby)
      VALUES ($1, $2, NOW(), $3)
      `,
      [sample.sampleid, nextStage, updatedby]
    );

    res.json({
      success: true,
      message: 'Tracking Updated Successfully',
      barcode: barcode,
      currentStatus: nextStage
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================================
// 2. Get Full Tracking History by Barcode
// =====================================================
exports.getHistory = async (req, res) => {

  try {

    const barcode = req.params.barcode;

    const result = await pool.query(
      `
      SELECT 
        t.trackingid,
        t.stagename,
        t.timestamp,
        u.name AS updatedby
      FROM tracking t

      JOIN samples s
      ON s.sampleid = t.sampleid

      LEFT JOIN users u
      ON u.userid = t.updatedby

      WHERE s.barcode = $1

      ORDER BY t.timestamp ASC
      `,
      [barcode]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};