const router = require("express").Router();
const User = require("../../models/users/User");
const Post = require("../../models/posts/Post");
const { verifyToken } = require("../../middleware/verifyToken");
const bcrypt = require("bcryptjs");

// Get user profile (protected - only their own)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // Check if user is requesting their own profile
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You can only view your own profile" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's posts
    const posts = await Post.find({ userId: user._id });

    res.status(200).json({ user, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put("/:id", verifyToken, async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    // Only allow specific fields to be updated
    const allowedUpdates = ["username", "email", "password", "profilePic"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // If no valid updates provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Check if username or email is being changed
    if (updates.username || updates.email) {
      // Check if new username already exists
      if (updates.username) {
        const existingUsername = await User.findOne({
          username: updates.username,
        });
        if (
          existingUsername &&
          existingUsername._id.toString() !== req.params.id
        ) {
          return res.status(400).json({ message: "Username already taken" });
        }
      }

      // Check if new email already exists
      if (updates.email) {
        const existingEmail = await User.findOne({ email: updates.email });
        if (existingEmail && existingEmail._id.toString() !== req.params.id) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
