import express from "express";
import {
  getLessons,
  getLessonBySlug,
  completeLesson,
} from "../controllers/lessonController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLessons);
router.get("/:slug", protect, getLessonBySlug);
router.post("/:slug/complete", protect, completeLesson);

export default router;