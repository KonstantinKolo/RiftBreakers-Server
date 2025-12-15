import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Submit score (must be authenticated)
router.post("/score", auth, async (req, res) => {
  const userId = req.user.id;
  const { score } = req.body;
  if (typeof score !== "number" || score < 0) return res.status(400).json({ error: "Invalid score" });
  try {
    // Atomically set highscore = max(highscore, score)
    await User.updateOne({ _id: userId }, { $max: { highscore: score } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Global leaderboard with pagination
// GET /api/leaderboard?limit=50&page=1
router.get("/leaderboard", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const page = Math.max(Number(req.query.page) || 1, 1);
  try {
    const skip = (page - 1) * limit;
    const total = await User.countDocuments({ highscore: { $gt: 0 } });
    const rows = await User.find({ highscore: { $gt: 0 } }, { username: 1, displayName: 1, highscore: 1 })
      .sort({ highscore: -1, createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Add rank for returned page (not global rank calculation for each user)
    const startRank = skip + 1;
    const result = rows.map((r, i) => ({ rank: startRank + i, ...r }));
    res.json({ total, page, limit, data: result });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
