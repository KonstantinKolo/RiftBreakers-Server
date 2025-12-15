import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import scoreRoutes from "./routes/score.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", scoreRoutes);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(()=> app.listen(PORT, ()=> console.log(`Listening ${PORT}`)))
  .catch(err => console.error("Mongo error:", err));