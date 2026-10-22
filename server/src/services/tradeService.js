import Stock from "../models/Stock.js";
import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";

// -------- Helper: get or create portfolio --------
export const getOrCreatePortfolio = async (userId) => {
  let portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) {
    portfolio = await Portfolio.create({
      userId,
      cash: 1000000,
      holdings: [],
      totalInvested: 0,
      realizedPnL: 0,
    });
  }
  return portfolio;
};

// -------- BUY --------
export const buyStock = async ({ userId, symbol, quantity }) => {
  const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
  if (!stock) {
    throw new Error("Stock not found");
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const portfolio = await getOrCreatePortfolio(userId);

  const price = stock.currentPrice;
  const total = price * qty;

  if (portfolio.cash < total) {
    throw new Error(
      `Insufficient virtual cash. Available: ₹${portfolio.cash.toLocaleString(
        "en-IN"
      )}`
    );
  }

  // Check if holding already exists
  const existingIndex = portfolio.holdings.findIndex(
    (h) => h.symbol === stock.symbol
  );

  if (existingIndex >= 0) {
    // Update existing holding — average price recalculate
    const h = portfolio.holdings[existingIndex];
    const newQty = h.quantity + qty;
    const newAvg = (h.avgPrice * h.quantity + price * qty) / newQty;
    portfolio.holdings[existingIndex].quantity = newQty;
    portfolio.holdings[existingIndex].avgPrice = Number(newAvg.toFixed(2));
  } else {
    portfolio.holdings.push({
      stockId: stock._id,
      symbol: stock.symbol,
      name: stock.name,
      quantity: qty,
      avgPrice: price,
    });
  }

  portfolio.cash -= total;
  portfolio.totalInvested += total;
  await portfolio.save();

  const trade = await Trade.create({
    userId,
    stockId: stock._id,
    symbol: stock.symbol,
    name: stock.name,
    type: "BUY",
    orderType: "MARKET",
    quantity: qty,
    price,
    total,
  });

  return { trade, portfolio };
};

// -------- SELL --------
export const sellStock = async ({ userId, symbol, quantity }) => {
  const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
  if (!stock) {
    throw new Error("Stock not found");
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const portfolio = await getOrCreatePortfolio(userId);

  const holdingIndex = portfolio.holdings.findIndex(
    (h) => h.symbol === stock.symbol
  );

  if (holdingIndex < 0) {
    throw new Error("You don't own this stock");
  }

  const holding = portfolio.holdings[holdingIndex];
  if (holding.quantity < qty) {
    throw new Error(
      `You only own ${holding.quantity} share(s) of ${stock.symbol}`
    );
  }

  const price = stock.currentPrice;
  const total = price * qty;
  const realizedPnL = (price - holding.avgPrice) * qty;

  // Update portfolio
  portfolio.cash += total;
  portfolio.realizedPnL += realizedPnL;

  if (holding.quantity === qty) {
    // Remove holding
    portfolio.holdings.splice(holdingIndex, 1);
  } else {
    portfolio.holdings[holdingIndex].quantity -= qty;
  }

  // Reduce total invested proportionally
  const soldCostBasis = holding.avgPrice * qty;
  portfolio.totalInvested = Math.max(0, portfolio.totalInvested - soldCostBasis);

  await portfolio.save();

  const trade = await Trade.create({
    userId,
    stockId: stock._id,
    symbol: stock.symbol,
    name: stock.name,
    type: "SELL",
    orderType: "MARKET",
    quantity: qty,
    price,
    total,
    realizedPnL: Number(realizedPnL.toFixed(2)),
  });

  return { trade, portfolio, realizedPnL };
};

// -------- Get enriched portfolio (with live P&L) --------
export const getEnrichedPortfolio = async (userId) => {
  const portfolio = await getOrCreatePortfolio(userId);

  const holdingsWithPnl = await Promise.all(
    portfolio.holdings.map(async (h) => {
      const stock = await Stock.findById(h.stockId);
      const currentPrice = stock?.currentPrice ?? h.avgPrice;
      const invested = h.avgPrice * h.quantity;
      const currentValue = currentPrice * h.quantity;
      const pnl = currentValue - invested;
      const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;

      return {
        stockId: h.stockId,
        symbol: h.symbol,
        name: h.name,
        quantity: h.quantity,
        avgPrice: h.avgPrice,
        currentPrice,
        invested: Number(invested.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        pnl: Number(pnl.toFixed(2)),
        pnlPercent: Number(pnlPercent.toFixed(2)),
      };
    })
  );

  const holdingsValue = holdingsWithPnl.reduce(
    (sum, h) => sum + h.currentValue,
    0
  );

  const totalValue = portfolio.cash + holdingsValue;
  const totalInvested = portfolio.totalInvested;
  const unrealizedPnL = holdingsValue - totalInvested;
  const totalPnL = unrealizedPnL + portfolio.realizedPnL;
  const totalPnLPercent =
    totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0;

  return {
    cash: Number(portfolio.cash.toFixed(2)),
    holdings: holdingsWithPnl,
    totalInvested: Number(totalInvested.toFixed(2)),
    holdingsValue: Number(holdingsValue.toFixed(2)),
    totalValue: Number(totalValue.toFixed(2)),
    unrealizedPnL: Number(unrealizedPnL.toFixed(2)),
    realizedPnL: Number(portfolio.realizedPnL.toFixed(2)),
    totalPnL: Number(totalPnL.toFixed(2)),
    totalPnLPercent: Number(totalPnLPercent.toFixed(2)),
  };
};