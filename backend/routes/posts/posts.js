const router = require("express").Router();
const Post = require("../../models/posts/Post");
const User = require("../../models/users/User");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middleware/verifyToken");
const Comment = require("../../models/comments/Comment");
const Notification = require("../../models/notifications/Notifications");
const { deleteFromCloudinary } = require("../../utils/cloudinary");
const multer = require("multer");
const { uploadToCloudinary } = require("../../utils/cloudinary");

const upload = multer({ storage: multer.memoryStorage() }).array("images", 3); // Max 3 images

// Create a post
router.post("/", verifyToken, (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: "Error uploading files" });
    }

    try {
      // Handle image uploads
      const uploadedImages = [];
      if (req.files) {
        for (const file of req.files) {
          const result = await uploadToCloudinary(file, "posts");
          uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }

      // Process tags
      const tags = req.body.tags
        ? req.body.tags.split(",").map((tag) => tag.trim())
        : [];

      const newPost = new Post({
        userId: req.user.id,
        username: req.user.username,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        city: req.body.city,
        state: req.body.state,
        itemType: req.body.itemType,
        images: uploadedImages,
        tags: tags,
        status: "unresolved", // Default status
      });

      const savedPost = await newPost.save();

      // Update user counts (postCount and unresolvedCount)
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $inc: {
            postCount: 1,
            unresolvedCount: 1,
          },
        },
        { new: true }
      );

      res.status(201).json(savedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// Get all posts
router.get("/", verifyToken, async (req, res) => {
  try {
    let posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

    // If not admin and not viewing own profile, filter out resolved posts
    if (!req.user?.isAdmin) {
      posts = posts.filter((post) => post.status === "unresolved");
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's posts
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own posts" });
    }

    // Validate new images if provided
    if (req.body.images) {
      if (req.body.images.length > 3) {
        return res.status(400).json({ message: "Maximum 3 images allowed" });
      }

      // Delete old images from Cloudinary
      for (const image of post.images) {
        await deleteFromCloudinary(image.publicId);
      }
    }

    // If status is being updated, update the user's counts
    if (req.body.status && req.body.status !== post.status) {
      const update = {};
      if (req.body.status === "resolved") {
        update.$inc = { resolvedCount: 1, unresolvedCount: -1 };
      } else {
        update.$inc = { resolvedCount: -1, unresolvedCount: 1 };
      }
      await User.findByIdAndUpdate(post.userId, update);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check authorization
    if (post.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    // Update user counts based on post status
    const update = {
      $inc: {
        postCount: -1,
        [post.status === "resolved" ? "resolvedCount" : "unresolvedCount"]: -1,
      },
    };
    await User.findByIdAndUpdate(post.userId, update);

    // Delete all images from Cloudinary
    for (const image of post.images) {
      await deleteFromCloudinary(image.publicId);
    }

    // Delete all comments for this post
    await Comment.deleteMany({ postId: req.params.id });

    // Delete all notifications related to this post
    await Notification.deleteMany({ postId: req.params.id });

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
