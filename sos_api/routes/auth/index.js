const express = require("express");
const router = express.Router();
require("dotenv").config();
const { User } = require("../../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// Secret key for JWT
const JWT_SECRET = "erewrewrwr4445";

// Login route
// router.post("/login", async (req, res) => {
//   const { email, password,device_token } = req.body;

//   try {
//     // Ensure data is received correctly
//     console.log("Incoming login request:", { email, password });

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }

//     // Check if user exists
//     const user = await User.findOne({ where: { email } });
//     console.log("User found:", user);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Ensure password comparison works
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("Password match status:", isMatch);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//         device_token:user.device_token
//       },
//       expiresIn: "1h",
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password, fcm_token } = req.body;

  try {
    console.log("Incoming login request:", { email, password, fcm_token });

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    console.log("User found:", user ? user.email : "Not found");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Plain-text password comparison
    const isMatch = password === user.password;
    console.log("Password match status:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Save fcm_token if provided
    if (fcm_token) {
      user.fcm_token = fcm_token;
      await user.save();
      console.log("FCM token saved.");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        unique_id: user.unique_id,
        email: user.email,
        role: user.role,
        fcm_token: user.fcm_token,
        name: user.name,
        city: user.city,
        state: user.state,
        elevators: user.elevators,
        phone: user.phone,
      },
      expiresIn: "1h",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Logout route (blacklists the token)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({ message: "Logout successful" });
});

const { Op } = require("sequelize");
router.post("/allUsers", async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;

    // Start building the WHERE clause
    const whereClause = {
      role: "user",
    };

    if (userId) {
      whereClause.unique_id = userId;
    }

    if (startDate && endDate) {
      whereClause.timestamp = {
        [Op.between]: [
          new Date(startDate),
          new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        ],
      };
    }

    const users = await User.findAll({
      where: whereClause,
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch a single user by ID (protected route)
router.get("/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch the user with the given ID from the database
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transform the user data into the desired structure
    const transformedUser = {
      id: user.id,
      name: user.name, // Add fields as needed
      email: user.email,
      role: user.role,
      // Add more fields as required
    };

    // Return the transformed data
    res.json({ user: transformedUser });
  } catch (error) {
    console.error("Error fetching user:", error); // Log error details
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Update user (protected route)
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    role,
    status,
    state,
    city,
    zip,
    phone,
    elevators,
  } = req.body;

  console.log("Incoming update:", req.body);

  try {
    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields that are provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;
    if (state !== undefined) user.state = state;
    if (city !== undefined) user.city = city;
    if (zip !== undefined) user.zip = zip;
    if (phone !== undefined) user.phone = phone;
    if (elevators !== undefined) user.elevators = elevators;

    // Save the updated user
    await user.save();

    // Send response with updated user details (excluding password)
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        state: user.state,
        city: user.city,
        zip: user.zip,
        phone: user.phone,
        elevators: user.elevators,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Delete a user by ID (protected route)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error); // Log error details
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Add a new user (protected route)
router.post("/users", async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    city,
    state,
    zip,
    status,
    elevators,
    timestamp,
    unique_id,
  } = req.body;

  console.log(req.body,"user@@@@@@@@@@@@@@@")
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user (password saved as-is)
    const newUser = await User.create({
      name,
      email,
      password, // plain-text password
      role,
      phone,
      city,
      state,
      zip,
      status,
      elevators,
      timestamp,
      unique_id,
    });

    // Send response with the created user details
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Read all users (protected route)
router.get("/splashScreenInfo", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    // Transform the data into the desired structure
    const transformedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      token: "",
      // Add more fields as required
    }));

    // Return the transformed data
    res.json({ users: transformedUsers });
  } catch (error) {
    console.error("Error fetching users:", error); // Log error details
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const _otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"SOS Elevator" <manishmerndeveloper@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      html: `<div style="font-family:Arial,sans-serif;">
        <h2>Hello ${user.name},</h2>
        <p>Your OTP code is:</p>
        <h1>${_otp}</h1>
        <p>This OTP is valid for 1 minute only.</p>
      </div>`,
    });

    if (info.messageId) {
      user.otp_code = _otp;
      user.otp_created_at = new Date(); // ✅ JavaScript Date is valid now
      await user.save({ fields: ["otp_code", "otp_created_at"] });

      return res.json({ success: true, message: "OTP sent successfully" });
    } else {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/submit-otp", async (req, res) => {
  const { otp, password } = req.body;

  if (!otp || !password) {
    return res.status(400).json({ message: "OTP and password are required" });
  }

  try {
    const user = await User.findOne({ where: { otp_code: otp } });

    if (!user || !user.otp_created_at) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ OTP expiry check: 1 minute (60,000 ms)
    const now = new Date();
    const createdAt = new Date(user.otp_created_at);
    const timeDiff = now - createdAt;

    if (timeDiff > 60 * 1000) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Save plain-text password directly
    user.password = password;
    user.otp_code = null;
    user.otp_created_at = null;

    await user.save({ fields: ["password", "otp_code", "otp_created_at"] });

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
