const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
      city: "New York",
      state: "NY",
    });

    // Create regular users (1-6)
    const users = await User.create([
      {
        username: "user1",
        email: "user1@example.com",
        password: hashedPassword,
        city: "Los Angeles",
        state: "CA",
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: hashedPassword,
        city: "Chicago",
        state: "IL",
      },
      {
        username: "user3",
        email: "user3@example.com",
        password: hashedPassword,
        city: "Houston",
        state: "TX",
      },
      {
        username: "user4",
        email: "user4@example.com",
        password: hashedPassword,
        city: "Phoenix",
        state: "AZ",
      },
      {
        username: "user5",
        email: "user5@example.com",
        password: hashedPassword,
        city: "Philadelphia",
        state: "PA",
      },
      {
        username: "breezy",
        email: "breezy@example.com",
        password: hashedPassword,
        city: "Miami",
        state: "FL",
      },
    ]);

    // Create 5 posts for breezy
    const breezyUser = users[5]; // breezy is the last user in the array
    const posts = [];

    for (let i = 0; i < 5; i++) {
      const post = await Post.create({
        userId: breezyUser._id,
        title: `Test Post ${i + 1}`,
        description: `This is a test post ${i + 1} description`,
        category: ["electronics", "jewelry", "clothing", "pets", "other"][i],
        itemType: ["lost", "found"][i % 2],
        status: ["unresolved", "resolved"][i % 2],
        city: breezyUser.city,
        state: breezyUser.state,
        tags: ["test", `tag${i + 1}`],
      });
      posts.push(post);
    }

    // Create one comment from each user (1-5) on each post
    for (const post of posts) {
      for (let i = 0; i < 5; i++) {
        await Comment.create({
          postId: post._id,
          userId: users[i]._id, // users[0] through users[4] (excluding breezy)
          text: `Comment ${i + 1} on post ${post.title} from ${
            users[i].username
          }`,
        });
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
};
