import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  displayName: String,
  highscore: { type: Number, default: 0, index: true },
  role: {
    type: String,
    enum: ["user", "tester", "admin"],
    default: "user"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
