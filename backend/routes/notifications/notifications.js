const router = require("express").Router();
const Notification = require("../../models/notifications/Notifications");
const User = require("../../models/users/User");
const { verifyToken } = require("../../middleware/verifyToken");

// GET /api/notifications/user/:id
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate("postId", "title")
      .populate("commentId", "text")
      .populate("userId", "username");

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// PUT /api/notifications/user/:id/viewed
router.put("/user/:id/viewed", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      lastViewedNotifications: new Date(),
      notificationCount: 0,
    });

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notifications status" });
  }
});

// DELETE /api/notifications/:id
// DELETE /api/notifications/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Check if user owns the notification
    if (notification.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own notifications" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting notification" });
  }
});

module.exports = router;
