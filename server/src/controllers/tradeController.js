import Stock from "../models/Stock.js";
import Trade from "../models/Trade.js";
import {
  buyStock,
  sellStock,
  getEnrichedPortfolio,
} from "../services/tradeService.js";

// @desc    Get all active stocks
// @route   GET /api/v1/trades/stocks
// @access  Private
export const getStocks = async (req, res, next) => {
  try {
    const { sector, search } = req.query;

    const filter = { isActive: true };
    if (sector) filter.sector = sector;
    if (search) {
      filter.$or = [
        { symbol: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const stocks = await Stock.find(filter).sort({ symbol: 1 });

    res.status(200).json({
      success: true,
      count: stocks.length,
      stocks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single stock by symbol
// @route   GET /api/v1/trades/stocks/:symbol
// @access  Private
export const getStockBySymbol = async (req, res, next) => {
  try {
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase(),
      isActive: true,
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    res.status(200).json({
      success: true,
      stock,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buy stock
// @route   POST /api/v1/trades/buy
// @access  Private
export const buy = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Symbol and quantity are required",
      });
    }

    const result = await buyStock({
      userId: req.user._id,
      symbol,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: `Bought ${quantity} share(s) of ${result.trade.symbol} at ₹${result.trade.price}`,
      trade: result.trade,
      portfolio: await getEnrichedPortfolio(req.user._id),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Sell stock
// @route   POST /api/v1/trades/sell
// @access  Private
export const sell = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Symbol and quantity are required",
      });
    }

    const result = await sellStock({
      userId: req.user._id,
      symbol,
      quantity,
    });

    const pnlText =
      result.realizedPnL >= 0
        ? `Profit: ₹${result.realizedPnL.toFixed(2)}`
        : `Loss: ₹${Math.abs(result.realizedPnL).toFixed(2)}`;

    res.status(200).json({
      success: true,
      message: `Sold ${quantity} share(s) of ${result.trade.symbol}. ${pnlText}`,
      trade: result.trade,
      realizedPnL: result.realizedPnL,
      portfolio: await getEnrichedPortfolio(req.user._id),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get portfolio (with live P&L)
// @route   GET /api/v1/trades/portfolio
// @access  Private
export const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await getEnrichedPortfolio(req.user._id);
    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's trade history
// @route   GET /api/v1/trades/history
// @access  Private
export const getTradeHistory = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const trades = await Trade.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: trades.length,
      trades,
    });
  } catch (error) {
    next(error);
  }
};