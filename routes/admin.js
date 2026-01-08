import express from "express";
import auth from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import User from "../models/User.js";

const router = express.Router();

router.get(
  "/users",
  auth,
  requireRole("admin"),
  async (req, res) => {
    try {
      // Parse pagination query params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Total users count
      const total = await User.countDocuments();

      // Fetch users with pagination
      const users = await User.find({})
        .select("_id username displayName highscore role")
        .sort({ highscore: -1 })
        .skip(skip)
        .limit(limit);

      res.json({
        total,
        page,
        limit,
        data: users
      });
    } catch (err) {
      console.error("ADMIN USERS ERROR:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);
// get a single user by username
router.get(
  "/user/:username",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username }).select(
        "username displayName highscore role createdAt"
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (err) {
      console.error("ADMIN SINGLE USER ERROR:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Promote / demote user role (admin only)
router.post(
  "/set-role",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const { username, role } = req.body;

    if (!["user", "tester", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      ok: true,
      username: user.username,
      role: user.role
    });
  }
);

export default router;
