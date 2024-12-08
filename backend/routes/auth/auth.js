const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/users/User");
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../../middleware/verifyToken");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    // Validate required fields
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      profilePic: req.body.profilePic || "",
      city: req.body.city,
      state: req.body.state,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser._doc;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Check if username exists
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Login successful - exclude sensitive data
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new admin (protected route)
router.post("/create-admin", verifyTokenAndAdmin, async (req, res) => {
  try {
    // Validate required fields
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin user
    const newAdmin = new User({
      email,
      username,
      password: hashedPassword,
      profilePic: req.body.profilePic || "",
      city: req.body.city,
      state: req.body.state,
      isAdmin: true, // Explicitly set admin status
    });

    // Save the admin to the database
    const savedAdmin = await newAdmin.save();
    const { password: _, ...adminData } = savedAdmin._doc;
    res.status(201).json(adminData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout route
router.post("/logout", verifyToken, async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({
      message: "Successfully logged out",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
