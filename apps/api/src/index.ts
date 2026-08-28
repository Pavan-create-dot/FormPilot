import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import customAnswersRoutes from "./routes/customAnswers";
import fieldsRoutes from "./routes/fields";
import historyRoutes from "./routes/history";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  "mongodb://localhost:27017/jobease";

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/custom-answers", customAnswersRoutes);
app.use("/api/fields", fieldsRoutes);
app.use("/api/history", historyRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "JobEase API", timestamp: new Date() });
});

// Database Connection Helper
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB successfully.");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

// Ensure DB is connected on every API request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Start Server locally if not running on Vercel
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`JobEase API running on http://localhost:${PORT}`);
    });
  });
}

export default app;
