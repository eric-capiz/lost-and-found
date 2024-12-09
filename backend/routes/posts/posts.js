const router = require("express").Router();
const Post = require("../../models/posts/Post");
const User = require("../../models/users/User");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middleware/verifyToken");

// Create a post
router.post("/", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      city: req.body.city,
      state: req.body.state,
      itemType: req.body.itemType,
      image: req.body.image,
      tags: req.body.tags,
      status: req.body.status,
    });

    const savedPost = await newPost.save();
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { postCount: 1 } },
      { new: true }
    );
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
router.get("/", verifyToken, async (req, res) => {
  try {
    let posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

    // If not admin and not viewing own profile, filter out resolved posts
    if (!req.user?.isAdmin) {
      posts = posts.filter((post) => post.status === "unresolved");
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's posts
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own posts" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(post.userId, { $inc: { postCount: -1 } });
    res.status(200).json({ message: "Post has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
