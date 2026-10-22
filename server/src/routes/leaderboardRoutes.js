import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getLeaderboard);

export default router;