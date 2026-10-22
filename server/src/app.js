import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

const app = express();

// -------- Security & Parsers --------
app.use(helmet());

// 🔥 PERMANENT CORS FIX 🔥
// Development mein har localhost port allow karega, production mein sirf CLIENT_URL
const corsOptions = {
  origin: env.NODE_ENV === "development" ? true : env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------- Logging --------
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// -------- Health Check --------
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// -------- Routes --------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/trades", tradeRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/rewards", rewardRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);

// -------- Error Handling --------
app.use(notFound);
app.use(errorHandler);

export default app;