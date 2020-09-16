const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require(".././Models/User");

// @route    POST api/users
// @desc    Register User
//@access   Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),

    check("email", "Please enter a valid email").isEmail(),

    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // see if user exists
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg", // rating
        d: "mm", // if the gravater is not associated with email
      });
      user = new User({
        // create the instance of user //create new user
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password using bcrypt
      //Generate a salt(String of random characters
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt); //Combine the salt with the user entered password
      await user.save();
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
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
