const express = require("express");
const router = express.Router();
const requireLogin = require("./Middleware/requireLogin");
const Profile = require("../Models/Profile");
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");

// @route    GET api/profile/me
// @desc    Get current Users Profile
//@access   Private
router.get("/me", requireLogin, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(500).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// create Profile
// @route    POST api/profile
// @desc    Create or Update user profile
//@access   Private
router.post(
  "/",
  [
    requireLogin,
    [
      body("status", "Status is required").not().isEmpty(),
      body("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkden,
    } = req.body;

    // Buid Profile Object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // create array of string using split and remove whitespace using trim
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    //Build social objecr
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkden) profileFields.social.linkden = linkden;
    if (instagram) profileFields.social.instagram = instagram;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create Profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error");
    }
  }
);

// create Profile
// @route    GET api/profile
// @desc    GET all profile
//@access   Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

// create Profile
// @route    GET api/profile/user/:user_id
// @desc    GET  profile by userid
//@access   Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.status(500).send("Server error");
  }
});

// create Profile
// @route    DELETE api/profile
// @desc    delete profile,user,posts
//@access   Prvate

router.delete("/", requireLogin, async (req, res) => {
  try {
    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
