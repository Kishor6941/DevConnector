const express = require("express");
const router = express.Router();
const Post = require("../Models/Post");
const User = require("../Models/User");
const requireLogin = require("./Middleware/requireLogin");
const { body, validationResult } = require("express-validator");

// @route    POST api/posts
// @desc    post the text
//@access   Private
router.post(
  "/",
  [requireLogin, [body("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newpost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newpost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error");
    }
  }
);

// @route    GET api/posts
// @desc    Get all the posts
//@access   Private
router.get("/", requireLogin, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

// @route    GET api/posts/:id
// @desc    Get posts by id
//@access   Private
router.get("/:id", requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      console.error(error.message);
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server error");
  }
});

// @route    DELETE api/posts/:id
// @desc    Delete the post
//@access   Private
router.delete("/:id", requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // check user if this post own by that user or not
    if (post.user.toString() !== req.user.id) {
      // post.user is object which is conveted to string by using toString()
      return res.status(401).json({ msg: "user not authorized" });
    }
    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      console.error(error.message);
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(500).send("Server error");
  }
});

// @route    PUT api/posts/like/:id
// @desc    Like a post
//@access   Private

router.put("/like/:id", requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save(res.json(post.likes));
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

// @route    PUT api/posts/unlike/:id
// @desc    Like a post
//@access   Private

router.put("/unlike/:id", requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    // Get removeIndex
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});
module.exports = router;
