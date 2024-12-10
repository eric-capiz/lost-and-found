const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // For efficient querying of user's notifications
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // For efficient cleanup of old notifications
  },
});

// Auto-delete notifications older than 3 days
notificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 259200,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
