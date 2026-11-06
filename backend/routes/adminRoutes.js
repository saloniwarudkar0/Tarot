
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Admin login configuration is missing."
      });
    }

    const isEmailCorrect =
      email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();

    const isPasswordCorrect = await bcrypt.compare(
      password,
      ADMIN_PASSWORD_HASH
    );

    if (!isEmailCorrect || !isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      { role: "admin", email: ADMIN_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token
    });

  } catch (error) {
    console.error("Admin Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login."
    });
  }
});

// Verify Admin Token
router.get("/verify", authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin token verified successfully.",
    admin: {
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

module.exports = router;
