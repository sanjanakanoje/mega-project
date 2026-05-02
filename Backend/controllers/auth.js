const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,$4)`,
      [name, email, hashPassword, role || 'customer']
    );

    res.status(201).json({
      success: true,
      message: "User Registered Successfully"
    });

  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     message: error.message
  //   });
  // }
  }
  catch (err) {
  console.error("REGISTER ERROR FULL:", err);   // full object
  console.error("REGISTER ERROR MSG:", err.message);
  res.status(500).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email"
      });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password"
      });
    }

    const token = jwt.sign(
      {
        id: user.userid,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.userid,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};