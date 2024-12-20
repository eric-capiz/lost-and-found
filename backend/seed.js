const mongoose = require("mongoose");
const User = require("./models/users/User");
const Post = require("./models/posts/Post");
const Comment = require("./models/comments/Comment");
const Notification = require("./models/notifications/Notifications");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Categories array
const categories = [
  "pets",
  "electronic",
  "jewelry",
  "accessory",
  "clothing",
  "documents",
  "keys",
  "bags",
];

// Helper function to get random number of images
const getRandomImages = (min, max) => {
  const numImages = Math.floor(Math.random() * (max - min + 1)) + min;
  return Array(numImages)
    .fill()
    .map(() => ({
      url: `https://picsum.photos/400/300?random=${Math.random()}`,
      publicId: `seed_image_${Math.random()}`,
    }));
};

// Helper function to get random category
const getRandomCategory = () => {
  return categories[Math.floor(Math.random() * categories.length)];
};

// Category-specific descriptions
const categoryDescriptions = {
  pets: [
    "My pet went missing near the campus grounds. It's a very friendly animal and responds to its name. Last seen wearing a collar with ID tags. Has distinctive markings and is microchipped. We've been searching the area extensively. This pet means the world to our family. Please contact us if you've seen it.",
    "Found this adorable pet wandering around without an owner. Seems well-cared for and very friendly. Currently being kept safe and warm. Would love to reunite with the owner as soon as possible. Please share any information you might have.",
  ],
  electronic: [
    "Lost my device on campus today. It has important work files and personal data. The device has a distinctive case and some identifying stickers. Battery was nearly full when lost. I've already tried tracking it but no success. Really need this back for my studies.",
    "Found this electronic device in the library study area. It's in good condition and seems to be someone's important work tool. Keeping it safe until we can find the owner. Please provide details to verify ownership.",
  ],
  jewelry: [
    "Lost a piece of jewelry with great sentimental value. It was a family heirloom passed down through generations. Has unique engravings and distinctive features. Lost somewhere between the parking lot and main building. Offering reward for its return.",
    "Found a beautiful piece of jewelry near the student center. It appears to be valuable and likely has sentimental worth to someone. Can be claimed with proper description of details and proof of ownership.",
  ],
  accessory: [
    "Missing my favorite accessory since yesterday's lecture. It has personal engravings and unique features. Last seen in the classroom or hallway. Really hoping someone picked it up for safekeeping. Please contact if found.",
    "Found this nice accessory in the cafeteria. Looks well-maintained and probably missed by its owner. Will hold onto it until the rightful owner claims it with proper description.",
  ],
  clothing: [
    "Lost my distinctive piece of clothing during today's events. It has specific brand labels and custom modifications. Very recognizable design and personal significance. Please return if found - no questions asked.",
    "Found this clothing item in the gym locker room. Brand new condition and seems valuable. Would like to return it to its rightful owner. Must describe specific details to claim.",
  ],
  documents: [
    "Lost some important documents containing crucial information. These papers are essential for my upcoming submission. Contains specific identifiable information. Would greatly appreciate their return as soon as possible.",
    "Found a folder of documents in the study hall. Contains what appears to be important paperwork. Keeping them safe until the owner can be located. Please describe contents to claim.",
  ],
  keys: [
    "Lost my keys somewhere on campus grounds. Has multiple keys and distinctive keychain attachments. Really need these back to access my apartment and car. Please contact if found - reward offered.",
    "Found a set of keys near the bike racks. Has several keys and unique keychain items. Currently being held safely. Contact with description to claim.",
  ],
  bags: [
    "Lost my bag containing personal items and daily essentials. It has distinctive markings and personal items inside. Contains items I need for classes. Would really appreciate its return.",
    "Found a bag/wallet in the student center. Contains various personal items. Being kept safe until owner can be found. Please provide specific details about contents to claim.",
  ],
};

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
    const regularPassword = await bcrypt.hash("password123", 10);

    // Create admin user with avatar
    const adminUser = await User.create({
      username: "admin",
      email: "admin@admin.com",
      password: adminPassword,
      isAdmin: true,
      postCount: 0,
      resolvedCount: 0,
      unresolvedCount: 0,
      profilePic: {
        url: `https://picsum.photos/200/200?random=${Math.random()}`,
        publicId: `admin_avatar_${Math.random()}`,
      },
    });

    // Create regular users with avatars
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
      usernames.map((username) =>
        User.create({
          username,
          email: `${username}@test.com`,
          password: regularPassword,
          postCount: 0,
          resolvedCount: 0,
          unresolvedCount: 0,
          profilePic: {
            url: `https://picsum.photos/200/200?random=${Math.random()}`,
            publicId: `user_avatar_${Math.random()}`,
          },
        })
      )
    );

    // Create posts with random categories and appropriate descriptions
    for (const user of regularUsers) {
      const itemTypes = ["lost", "found"];

      // Create resolved post
      const resolvedCategory = getRandomCategory();
      const resolvedPost = await Post.create({
        userId: user._id,
        username: user.username,
        title: `${itemTypes[0]} ${resolvedCategory}`,
        description: categoryDescriptions[resolvedCategory][0],
        category: resolvedCategory,
        city: "New York",
        state: "NY",
        itemType: itemTypes[0],
        status: "resolved",
        comments: [],
        commentCount: 0,
        tags: ["Test", "Seed", "Data"],
        images: getRandomImages(1, 3),
      });

      // Create unresolved post
      const unresolvedCategory = getRandomCategory();
      const unresolvedPost = await Post.create({
        userId: user._id,
        username: user.username,
        title: ` ${itemTypes[1]} ${unresolvedCategory}`,
        description: categoryDescriptions[unresolvedCategory][1],
        category: unresolvedCategory,
        city: "New York",
        state: "NY",
        itemType: itemTypes[1],
        status: "unresolved",
        comments: [],
        commentCount: 0,
        tags: ["Test", "Seed", "Data"],
        images: getRandomImages(1, 3),
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
