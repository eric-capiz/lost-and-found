const router = require("express").Router();
const User = require("../../models/users/User");
const Post = require("../../models/posts/Post");
const Comment = require("../../models/comments/Comment");
const { verifyTokenAndAdmin } = require("../../middleware/verifyToken");

// Get all users
router.get("/users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET ADMIN STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      totalPosts: await Post.countDocuments(),
      resolvedPosts: await Post.countDocuments({ status: "resolved" }),
      unresolvedPosts: await Post.countDocuments({ status: "unresolved" }),
      totalComments: await Comment.countDocuments(),
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete admin
router.delete("/admins/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.isAdmin) {
      return res.status(400).json({ message: "User is not an admin" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Admin has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
