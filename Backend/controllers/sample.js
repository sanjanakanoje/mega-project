exports.addSample = async (req, res) => {
  try {
    const {
      userid,
      samplename,
      sampletype,
      quantity,
      barcode,
      priority
    } = req.body;

    await pool.query(
      `INSERT INTO samples
      (userid,samplename,sampletype,quantity,barcode,priority)
      VALUES($1,$2,$3,$4,$5,$6)`,
      [
        userid,
        samplename,
        sampletype,
        quantity,
        barcode,
        priority || 'Normal'
      ]
    );

    res.status(201).json({
      success: true,
      message: "Sample Added Successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getAllSamples = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM samples ORDER BY sampleid DESC`
    );

    res.status(200).json({
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


exports.getSampleById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      `SELECT * FROM samples WHERE sampleid=$1`,
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


exports.updateSampleStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    await pool.query(
      `UPDATE samples
       SET status=$1
       WHERE sampleid=$2`,
      [status, id]
    );

    res.status(200).json({
      success: true,
      message: "Sample Status Updated"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};