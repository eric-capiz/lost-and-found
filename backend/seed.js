const mongoose = require("mongoose");
const User = require("./models/users/User");
const Post = require("./models/posts/Post");
const Comment = require("./models/comments/Comment");
const Notification = require("./models/notifications/Notifications");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Notification.deleteMany({});

    // Create users
    const adminPassword = await bcrypt.hash("admin123", 10);
    const regularPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        username: "admin",
        email: "admin@admin.com",
        password: adminPassword,
        isAdmin: true,
        profilePic: "",
      },
      {
        username: "testAdmin",
        email: "admin2@test.com",
        password: regularPassword,
        isAdmin: true,
      },
      { username: "user1", email: "user1@test.com", password: regularPassword },
      { username: "user2", email: "user2@test.com", password: regularPassword },
      { username: "user3", email: "user3@test.com", password: regularPassword },
    ]);

    // Get regular users
    const regularUsers = users.filter((user) => !user.isAdmin);
    const [postOwner, commenter1, commenter2] = regularUsers;

    // Create one post by user1
    const post = await Post.create({
      userId: postOwner._id,
      username: postOwner.username,
      title: `${postOwner.username}'s Lost Item`,
      description: "Test description for lost item",
      category: "Electronics",
      city: "New York",
      state: "NY",
      itemType: "lost",
      status: "unresolved",
      comments: [],
      commentCount: 0,
      tags: ["Test", "Seed", "Data"],
    });

    // Create 3 comments from other regular users
    const commenters = [commenter1, commenter2, commenter1]; // user2, user3, user2 again

    for (let i = 0; i < 3; i++) {
      const commenter = commenters[i];

      // Create comment
      const comment = await Comment.create({
        postId: post._id,
        userId: commenter._id,
        username: commenter.username,
        text: `test comment by ${commenter.username}`,
      });

      // Update post
      await Post.findByIdAndUpdate(post._id, {
        $push: {
          comments: {
            commenterId: commenter._id,
            commenterUsername: commenter.username,
            content: `text comment by ${commenter.username}`,
          },
        },
        $inc: { commentCount: 1 },
      });

      // Create notification for post owner
      await Notification.create({
        userId: post.userId,
        postId: post._id,
        commentId: comment._id,
        message: `${commenter.username} left a comment on your post: ${post.title}`,
      });

      // Increment notification count for post owner
      await User.findByIdAndUpdate(post.userId, {
        $inc: { notificationCount: 1 },
      });
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
