const router = require("express").Router();
const User = require("../../models/users/User");
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

// Get total counts
router.get("/counts", verifyTokenAndAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    // const postCount = await Post.countDocuments();

    res.status(200).json({
      users: userCount,
      // posts: postCount
    });
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
