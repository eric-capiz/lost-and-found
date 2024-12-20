const mongoose = require("mongoose");
const User = require("./models/users/User");
const Post = require("./models/posts/Post");
const Comment = require("./models/comments/Comment");
const Notification = require("./models/notifications/Notifications");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Categories array
const categories = ["electronics", "jewelry", "clothing", "pets", "other"];

const seedDatabase = async () => {
  try {
    // First connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB successfully");

    console.log("Starting database seeding...");

    // Clear existing data
    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("Existing data cleared");

    // Create admin user
    console.log("Creating admin user...");
    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin", 10),
      isAdmin: true,
      city: "New York",
      state: "NY",
      profilePic: {
        url: `https://picsum.photos/200/200?random=${Math.random()}`,
        publicId: `admin_avatar_${Math.random()}`,
      },
    });

    // Create regular users (1-6)
    console.log("Creating regular users...");
    const users = await User.create([
      {
        username: "user1",
        email: "user1@example.com",
        password: bcrypt.hashSync("password123", 10),
        city: "Los Angeles",
        state: "CA",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: bcrypt.hashSync("password123", 10),
        city: "Chicago",
        state: "IL",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      },
      {
        username: "user3",
        email: "user3@example.com",
        password: bcrypt.hashSync("password123", 10),
        city: "Houston",
        state: "TX",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      },
      {
        username: "user4",
        email: "user4@example.com",
        password: bcrypt.hashSync("password123", 10),
        city: "Phoenix",
        state: "AZ",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      },
      {
        username: "user5",
        email: "user5@example.com",
        password: bcrypt.hashSync("password123", 10),
        city: "Philadelphia",
        state: "PA",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      },
      {
        username: "breezy",
        email: "breezy@example.com",
        password: bcrypt.hashSync("password123", 10),
        city: "Miami",
        state: "FL",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      },
    ]);

    // Create 5 posts for breezy only
    console.log("Creating posts for breezy...");
    const breezyUser = users[5]; // breezy is the last user in the array
    const posts = [];

    for (let i = 0; i < 5; i++) {
      const post = await Post.create({
        userId: breezyUser._id,
        username: breezyUser.username,
        title: `${categories[i].toUpperCase()}`,
        description: `This is a test post ${i + 1} description`,
        category: categories[i],
        itemType: ["lost", "found"][i % 2],
        status: ["unresolved", "resolved"][i % 2],
        city: breezyUser.city,
        state: breezyUser.state,
        tags: ["test", `tag${i + 1}`],
        images: [
          {
            url: `https://picsum.photos/400/300?random=${Math.random()}`,
            publicId: `seed_image_${Math.random()}`,
          },
        ],
        commentCount: 0,
      });
      posts.push(post);
    }

    // Update breezy's post counts
    await User.findByIdAndUpdate(breezyUser._id, {
      postCount: 5,
      resolvedCount: Math.ceil(5 / 2),
      unresolvedCount: Math.floor(5 / 2),
    });

    // Create comments and notifications
    console.log("Creating comments and notifications...");
    for (const post of posts) {
      for (let i = 0; i < 5; i++) {
        const commenter = users[i]; // users[0] through users[4] (excluding breezy)

        // Create comment
        const comment = await Comment.create({
          postId: post._id,
          userId: commenter._id,
          username: commenter.username,
          userProfilePic: commenter.profilePic,
          text: `Comment ${i + 1} on post ${post.title} from ${
            commenter.username
          }`,
        });

        // Create notification
        await Notification.create({
          userId: post.userId,
          postId: post._id,
          commentId: comment._id,
          message: `${commenter.username} commented on your post: ${post.title}`,
        });

        // Update post's comment count
        await Post.findByIdAndUpdate(post._id, {
          $inc: { commentCount: 1 },
        });
      }
    }

    // Update breezy's notification count
    await User.findByIdAndUpdate(breezyUser._id, {
      $inc: { notificationCount: 25 }, // 5 comments * 5 posts
    });

    console.log("Database seeded successfully");

    // Log final counts
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();
    const notificationCount = await Notification.countDocuments();

    console.log(`Final counts:
    Users: ${userCount} (should be 7)
    Posts: ${postCount} (should be 5)
    Comments: ${commentCount} (should be 25)
    Notifications: ${notificationCount} (should be 25)`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
    process.exit(0);
  }
};

// Execute the seed function
console.log("Starting seed script...");
seedDatabase();
