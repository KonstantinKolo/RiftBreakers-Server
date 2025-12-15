import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { rateLimiter } from "../middleware/rateLimit.js";
import { validateRegister, validateLogin } from "../middleware/validators.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", rateLimiter, validateRegister, async (req, res) => {
  const { username, password, displayName } = req.body;
  try {
    if (await User.findOne({ username })) return res.status(400).json({ error: "Username taken" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, displayName });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user._id, username: user.username, displayName: user.displayName });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", rateLimiter, validateLogin, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user._id, username: user.username, displayName: user.displayName });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
