import express from "express";
import { getRewards, dailyCheckIn } from "../controllers/rewardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getRewards);
router.post("/daily-check", dailyCheckIn);

export default router;