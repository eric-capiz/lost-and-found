const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
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
  viewed: {
    type: Boolean,
    default: false,
    index: true, // Add index for faster queries
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Auto-delete notifications older than 3 days
notificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 259200,
  }
);

// Compound index for faster queries of unviewed notifications
notificationSchema.index({ userId: 1, viewed: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
