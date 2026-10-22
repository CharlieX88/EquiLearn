import express from "express";
import {
  chat,
  getChats,
  getChatById,
  deleteChat,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(protect);

router.post("/chat", aiLimiter, chat);
router.get("/chats", getChats);
router.get("/chats/:id", getChatById);
router.delete("/chats/:id", deleteChat);

export default router;