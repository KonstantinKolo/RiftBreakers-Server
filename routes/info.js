import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get logged-in player's info
router.get("/info", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id username displayName highscore"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      userId: user._id,
      username: user.username,
      displayName: user.displayName,
      highscore: user.highscore ?? 0
    });
  } catch (err) {
    console.error("INFO ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;