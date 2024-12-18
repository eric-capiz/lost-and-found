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

    // Create passwords
    const adminPassword = await bcrypt.hash("admin", 10);
    const regularPassword = await bcrypt.hash("demo", 10);

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      email: "admin@admin.com",
      password: adminPassword,
      isAdmin: true,
      postCount: 0,
      resolvedCount: 0,
      unresolvedCount: 0,
    });

    // Create regular users
    const usernames = [
      "breezy",
      "user1",
      "user2",
      "user3",
      "user4",
      "user5",
      "user6",
      "user7",
      "user8",
      "user9",
    ];
    const regularUsers = await Promise.all(
      usernames.map((username, index) =>
        User.create({
          username,
          email: `${username}@test.com`,
          password: regularPassword,
          postCount: 0,
          resolvedCount: 0,
          unresolvedCount: 0,
        })
      )
    );

    // Create 2 posts per user (1 resolved, 1 unresolved)
    for (const user of regularUsers) {
      const itemTypes = ["lost", "found"];

      // Create resolved post
      const resolvedPost = await Post.create({
        userId: user._id,
        username: user.username,
        title: `${user.username}'s ${itemTypes[0]} Item (Resolved)`,
        description: `Test description for ${itemTypes[0]} item`,
        category: "Electronics",
        city: "New York",
        state: "NY",
        itemType: itemTypes[0],
        status: "resolved",
        comments: [],
        commentCount: 0,
        tags: ["Test", "Seed", "Data"],
      });

      // Create unresolved post
      const unresolvedPost = await Post.create({
        userId: user._id,
        username: user.username,
        title: `${user.username}'s ${itemTypes[1]} Item (Unresolved)`,
        description: `Test description for ${itemTypes[1]} item`,
        category: "Electronics",
        city: "New York",
        state: "NY",
        itemType: itemTypes[1],
        status: "unresolved",
        comments: [],
        commentCount: 0,
        tags: ["Test", "Seed", "Data"],
      });

      // Update user's post counts
      await User.findByIdAndUpdate(user._id, {
        $inc: {
          postCount: 2,
          resolvedCount: 1,
          unresolvedCount: 1,
        },
      });

      // Create 5 comments per post from random users
      const posts = [resolvedPost, unresolvedPost];
      for (const post of posts) {
        for (let i = 0; i < 5; i++) {
          // Pick a random commenter (excluding post owner)
          const availableCommenters = regularUsers.filter(
            (u) => u._id.toString() !== user._id.toString()
          );
          const randomCommenter =
            availableCommenters[
              Math.floor(Math.random() * availableCommenters.length)
            ];

          // Create comment
          const comment = await Comment.create({
            postId: post._id,
            userId: randomCommenter._id,
            username: randomCommenter.username,
            text: `Comment ${i + 1} by ${randomCommenter.username} on ${
              post.title
            }`,
          });

          // Update post
          await Post.findByIdAndUpdate(post._id, {
            $push: {
              comments: {
                commenterId: randomCommenter._id,
                commenterUsername: randomCommenter.username,
                content: `Comment ${i + 1} by ${randomCommenter.username} on ${
                  post.title
                }`,
              },
            },
            $inc: { commentCount: 1 },
          });

          // Create notification for post owner
          await Notification.create({
            userId: post.userId,
            postId: post._id,
            commentId: comment._id,
            message: `${randomCommenter.username} commented on your post: ${post.title}`,
          });

          // Increment notification count for post owner
          await User.findByIdAndUpdate(post.userId, {
            $inc: { notificationCount: 1 },
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
