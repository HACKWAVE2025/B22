import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // ⬅️ Required to call Python API
import { User } from "./models/User.js";
import { verifyJWT } from "./middleware/verifyJWT.js";

dotenv.config();
const app = express();

// 🧩 Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8081"], // ✅ allow both
    credentials: true,
  })
);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// 🏠 Root route
app.get("/", (req, res) => {
  res.send("🚀 Mediviz Backend is running...");
});

// 🔹 REGISTER API
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// 🔹 LOGIN API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// 🔹 PROTECTED ROUTE EXAMPLE
app.get("/api/dashboard", verifyJWT, (req, res) => {
  res.json({
    message: `Welcome ${req.user.email}! You are logged in as ${req.user.role}.`,
  });
});

app.post("/api/check-symptoms", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ error: "Symptoms are required" });

    const flaskResponse = await fetch("http://127.0.0.1:5001/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });

    const data = await flaskResponse.json();
    if (!flaskResponse.ok) {
      return res.status(500).json({ error: data.error || "Model prediction failed" });
    }

    res.json({
      message: "Prediction successful",
      result: data,
    });
  } catch (err) {
    console.error("❌ Symptom analysis error:", err);
    res.status(500).json({ error: "Server error connecting to model" });
  }
});


// 🔹 (Optional) GET All Users — for testing only
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "_id fullName email role");
    res.json(users);
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running successfully on http://localhost:${PORT}`)
);
