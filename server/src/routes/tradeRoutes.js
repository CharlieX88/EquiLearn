import express from "express";
import {
  getStocks,
  getStockBySymbol,
  buy,
  sell,
  getPortfolio,
  getTradeHistory,
} from "../controllers/tradeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.use(protect);

// Stock data
router.get("/stocks", getStocks);
router.get("/stocks/:symbol", getStockBySymbol);

// Trading actions
router.post("/buy", buy);
router.post("/sell", sell);

// Portfolio + history
router.get("/portfolio", getPortfolio);
router.get("/history", getTradeHistory);

export default router;