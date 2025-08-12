const express = require("express");
const router = express.Router();
const User = require("../models/user");

// After Firebase verifies OTP, call this API
router.post("/check-user", async (req, res) => {
  try {
    const { phone } = req.body;
    let user = await User.findOne({ phone });

    if (user) {
      res.json({ exists: true, user });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new user after first-time OTP verification
router.post("/register", async (req, res) => {
  try {
    const { phone, name, address } = req.body;
    const user = new User({ phone, name, address });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
