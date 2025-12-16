import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get logged-in player's info + global rank
router.get("/info", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id username displayName highscore"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const highscore = user.highscore ?? 0;

    // Count users with a higher score
    const rank =
      highscore > 0
        ? (await User.countDocuments({ highscore: { $gt: highscore } })) + 1
        : null;

    res.json({
      userId: user._id,
      username: user.username,
      displayName: user.displayName,
      highscore,
      rank // null if no score yet
    });
  } catch (err) {
    console.error("INFO ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
