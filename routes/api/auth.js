const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const requireLogin = require("./Middleware/requireLogin");
const jwt = require("jsonwebtoken");
const config = require("config");
const { body, validationResult } = require("express-validator");

// @route    GET api/auth
// @desc    Test route
//@access   Public
// Get user details using user.id
router.get("/", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Login API
// @route    POST api/auth
// @desc    Authenticate user and ger token
//@access   Public
router.post(
  "/",
  [
    body("email", "Please enter a valid email").isEmail(),

    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // see if user exists
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // match user and password
      //bcrypt has a method to check plain text and hash password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Return jsonwebtoken // Header --Payload --VERIFY SIGNATURE
      //jwt.sign(payload, secretOrPrivateKey, [options, callback])
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtsecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
