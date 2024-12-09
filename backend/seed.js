const mongoose = require("mongoose");
const User = require("./models/users/User");
const Post = require("./models/posts/Post");
const Comment = require("./models/comments/Comment");
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

    // Create users
    const adminPassword = await bcrypt.hash("admin123", 10);
    const regularPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        username: "admin",
        email: "admin@admin.com",
        password: adminPassword,
        isAdmin: true,
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

    // Get regular users only (no admins)
    const regularUsers = users.filter((user) => !user.isAdmin);

    // Create posts for regular users only
    for (const user of regularUsers) {
      const posts = await Post.insertMany([
        {
          userId: user._id,
          username: user.username,
          title: `${user.username}'s Lost Item`,
          description: "Test description for lost item",
          category: "Electronics",
          city: "New York",
          state: "NY",
          itemType: "lost",
          status: "unresolved",
          comments: [],
          commentCount: 0,
          tags: ["Urgent", "LastSeen", "Electronics", "Phone", "HighValue"],
        },
        {
          userId: user._id,
          username: user.username,
          title: `${user.username}'s Found Item`,
          description: "Test description for found item",
          category: "Jewelry",
          city: "Los Angeles",
          state: "CA",
          itemType: "found",
          status: "unresolved",
          comments: [],
          commentCount: 0,
          tags: [
            "FoundToday",
            "TurnedIn",
            "Jewelry",
            "Unclaimed",
            "SafeKeeping",
          ],
        },
      ]);

      // Only regular users comment on each post
      for (const post of posts) {
        for (const commenter of regularUsers) {
          // Create comment in Comments collection
          const comment = await Comment.create({
            postId: post._id,
            userId: commenter._id,
            username: commenter.username,
            text: `Comment by ${commenter.username} on ${post.title}`,
          });

          // Update post with comment
          await Post.findByIdAndUpdate(post._id, {
            $push: {
              comments: {
                commenterId: commenter._id,
                commenterUsername: commenter.username,
                content: `Comment by ${commenter.username} on ${post.title}`,
              },
            },
            $inc: { commentCount: 1 },
          });
        }
      }
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
