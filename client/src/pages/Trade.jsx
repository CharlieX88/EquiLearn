import { useEffect, useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Brain,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import api from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { cn } from "../utils/cn";

const sectors = [
  "All", "IT", "Banking", "FMCG", "Pharma", "Energy", 
  "Auto", "Telecom", "Metals", "Infrastructure", "Consumer",
];

export default function Trade() {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [orderType, setOrderType] = useState("BUY");
  const [quantity, setQuantity] = useState(1);
  const [placing, setPlacing] = useState(false);

  // State for Chart & AI
  const [chartData, setChartData] = useState([]);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Fetch Data (Silent update support)
  const fetchData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [stocksRes, portfolioRes] = await Promise.all([
        api.get("/trades/stocks"),
        api.get("/trades/portfolio"),
      ]);
      
      const newStocks = stocksRes.data.stocks || [];
      setStocks(newStocks);
      setPortfolio(portfolioRes.data.portfolio);

      // Update selected stock's price dynamically
      if (selectedStock) {
        const updatedStock = newStocks.find(s => s.symbol === selectedStock.symbol);
        if (updatedStock) setSelectedStock(updatedStock);
      } else if (newStocks.length > 0) {
        setSelectedStock(newStocks[0]);
      }
    } catch (error) {
      if (!isSilent) toast.error("Failed to load trading data");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  // 5 Second Polling Setup
  useEffect(() => {
    fetchData(); // First load
    const interval = setInterval(() => fetchData(true), 5000);
    return () => clearInterval(interval);
  }, [selectedStock?.symbol]); // Re-run if selected stock changes

  // Update Chart Data when Price changes
  useEffect(() => {
    if (selectedStock) {
      setChartData(prev => {
        const timeStr = new Date().toLocaleTimeString('en-US', { 
          hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
        const newData = [...prev, { time: timeStr, price: selectedStock.currentPrice }];
        return newData.slice(-20); // Keep only last 20 data points
      });
    }
  }, [selectedStock?.currentPrice, selectedStock?.symbol]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      const matchesSearch =
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase());
      const matchesSector = sector === "All" || s.sector === sector;
      return matchesSearch && matchesSector;
    });
  }, [stocks, search, sector]);

  const holding = useMemo(() => {
    if (!selectedStock || !portfolio) return null;
    return portfolio.holdings.find((h) => h.symbol === selectedStock.symbol);
  }, [selectedStock, portfolio]);

  const orderTotal = selectedStock ? selectedStock.currentPrice * quantity : 0;

  const handlePlaceOrder = async () => {
    if (!selectedStock) return;
    if (quantity <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    try {
      setPlacing(true);
      const endpoint = orderType === "BUY" ? "/trades/buy" : "/trades/sell";
      const { data } = await api.post(endpoint, {
        symbol: selectedStock.symbol,
        quantity: Number(quantity),
      });

      toast.success(data.message);
      setPortfolio(data.portfolio);
      setQuantity(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  // 👇 AI Stock Guide Logic (With Portfolio Context)
  const handleAskAi = async () => {
    if (!selectedStock) return;
    setLoadingAi(true);
    setAiAdvice(null);
    try {
      const portfolioContext = holding 
        ? `The user already owns ${holding.quantity} shares at an average price of ₹${holding.avgPrice}.` 
        : `The user does not own any shares of this stock yet.`;
      
      const cashContext = portfolio ? `The user has ₹${portfolio.cash} in virtual cash available.` : "";

      const prompt = `
      Act as my financial mentor. I am analyzing ${selectedStock.symbol} (${selectedStock.name}).
      
      Market Data:
      - Current Price: ₹${selectedStock.currentPrice}
      - Day High: ₹${selectedStock.dayHigh}
      - Day Low: ₹${selectedStock.dayLow}
      - Previous Close: ₹${selectedStock.previousClose}
      
      My Portfolio Context:
      - ${portfolioContext}
      - ${cashContext}
      
      Please analyze this data. Explain the momentum. What are the risks? 
      DO NOT tell me to buy or sell. Instead, ask me 2 questions to test my trading psychology before I take a trade. Mention where a logical stop-loss might go based on today's low.
      `;
      
      const { data } = await api.post("/ai/chat", { message: prompt });
      setAiAdvice(data.reply);
    } catch (error) {
      toast.error("AI is busy right now.");
    } finally {
      setLoadingAi(false);
    }
  };

  const change = selectedStock ? selectedStock.currentPrice - selectedStock.previousClose : 0;
  const changePercent = selectedStock ? ((change / selectedStock.previousClose) * 100).toFixed(2) : 0;
  const isUp = change >= 0;

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
            Virtual Trading Terminal 
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
          </h1>
          <p className="text-dark-100 text-sm">
            Practice with ₹10,00,000 virtual cash. Real-time simulated market.
          </p>
        </div>
      </div>

      {/* Portfolio strip */}
      {portfolio && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-xs text-dark-100 mb-1">Available Cash</p>
            <p className="text-lg font-bold font-mono">
              ₹{portfolio.cash.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-xs text-dark-100 mb-1">Holdings Value</p>
            <p className="text-lg font-bold font-mono">
              ₹{portfolio.holdingsValue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-xs text-dark-100 mb-1">Total Value</p>
            <p className="text-lg font-bold font-mono">
              ₹{portfolio.totalValue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-xs text-dark-100 mb-1">Total P&L</p>
            <p className={cn("text-lg font-bold font-mono", portfolio.totalPnL >= 0 ? "text-success" : "text-danger")}>
              {portfolio.totalPnL >= 0 ? "+" : ""}₹{portfolio.totalPnL.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* LEFT: Stock list */}
        <div className="lg:col-span-4 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col max-h-[700px]">
          <div className="p-4 border-b border-white/5">
            <Input
              placeholder="Search stocks..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all",
                    sector === s
                      ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                      : "text-dark-100 border border-white/5 hover:border-white/10"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredStocks.length === 0 && (
              <p className="text-center text-dark-100 text-sm py-10">No stocks found</p>
            )}
            {filteredStocks.map((stock) => {
              const stockChange = stock.currentPrice - stock.previousClose;
              const stockChangePct = ((stockChange / stock.previousClose) * 100).toFixed(2);
              const stockUp = stockChange >= 0;
              const isSelected = selectedStock?.symbol === stock.symbol;
              const stockHolding = portfolio?.holdings.find((h) => h.symbol === stock.symbol);

              return (
                <button
                  key={stock._id}
                  onClick={() => {
                    setSelectedStock(stock);
                    setChartData([]); // Reset chart when changing stock
                    setAiAdvice(null);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-white/5 transition-all",
                    isSelected ? "bg-primary-500/10 border-l-2 border-l-primary-500" : "hover:bg-white/[0.03]"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{stock.symbol}</p>
                        {stockHolding && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 font-mono">
                            {stockHolding.quantity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-dark-100 truncate">{stock.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono">₹{stock.currentPrice.toLocaleString("en-IN")}</p>
                      <p className={cn("text-xs font-mono", stockUp ? "text-success" : "text-danger")}>
                        {stockUp ? "+" : ""}{stockChangePct}%
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER: Chart / Stock info */}
        <div className="lg:col-span-5 rounded-2xl border border-white/5 bg-white/[0.02] p-6 flex flex-col">
          {selectedStock ? (
            <>
              {/* Stock header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
                    <p className="text-sm text-dark-100">{selectedStock.name}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300">
                    {selectedStock.sector}
                  </span>
                </div>

                <div className="flex items-end gap-4">
                  <p className="text-4xl font-bold font-mono">
                    ₹{selectedStock.currentPrice.toLocaleString("en-IN")}
                  </p>
                  <div className={cn("flex items-center gap-1 pb-1.5 text-sm font-mono", isUp ? "text-success" : "text-danger")}>
                    {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {isUp ? "+" : ""}{change.toFixed(2)} ({changePercent}%)
                  </div>
                </div>
              </div>

              {/* Day stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-white/[0.03]">
                  <p className="text-[10px] text-dark-100 uppercase tracking-wider mb-1">Day High</p>
                  <p className="text-sm font-mono">₹{selectedStock.dayHigh.toLocaleString("en-IN")}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03]">
                  <p className="text-[10px] text-dark-100 uppercase tracking-wider mb-1">Day Low</p>
                  <p className="text-sm font-mono">₹{selectedStock.dayLow.toLocaleString("en-IN")}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03]">
                  <p className="text-[10px] text-dark-100 uppercase tracking-wider mb-1">Prev Close</p>
                  <p className="text-sm font-mono">₹{selectedStock.previousClose.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* 👇 REAL-TIME CHART */}
              <div className="flex-1 flex flex-col min-h-[200px] mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-dark-100 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Live Price Action
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`₹${value}`, 'Price']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke={isUp ? "#10b981" : "#ef4444"} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 👇 AI ADVISOR */}
              <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary-400" />
                    <p className="text-sm font-semibold text-primary-300">AI Stock Guide</p>
                  </div>
                  <button 
                    onClick={handleAskAi} 
                    disabled={loadingAi}
                    className="text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                  >
                    {loadingAi ? <RefreshCw className="w-3 h-3 animate-spin"/> : "Analyze Data"}
                  </button>
                </div>
                
                {aiAdvice ? (
                  <div className="text-xs text-dark-100 leading-relaxed mt-2 bg-dark-900/50 p-3 rounded-lg border border-white/5 overflow-hidden">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        h1: ({ children }) => <h3 className="text-sm font-bold text-white mb-1">{children}</h3>,
                        h2: ({ children }) => <h3 className="text-sm font-bold text-white mb-1">{children}</h3>,
                        h3: ({ children }) => <h4 className="text-xs font-bold text-white mb-1">{children}</h4>,
                      }}
                    >
                      {aiAdvice}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-xs text-dark-100 italic mt-1">
                    Click "Analyze Data" to understand what this price action means.
                  </p>
                )}
              </div>

              {/* Your holding info */}
              {holding && (
                <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5">
                  <p className="text-xs text-primary-300 font-semibold mb-2">YOUR HOLDING</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] text-dark-100 mb-0.5">Quantity</p>
                      <p className="font-mono">{holding.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-100 mb-0.5">Avg Price</p>
                      <p className="font-mono">₹{holding.avgPrice.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-100 mb-0.5">P&L</p>
                      <p className={cn("font-mono", holding.pnl >= 0 ? "text-success" : "text-danger")}>
                        {holding.pnl >= 0 ? "+" : ""}₹{holding.pnl.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-dark-100">
              Select a stock to view details
            </div>
          )}
        </div>

        {/* RIGHT: Order panel */}
        <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex flex-col">
          <h3 className="font-semibold mb-4">Place Order</h3>

          <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-white/5 mb-5">
            <button
              onClick={() => setOrderType("BUY")}
              className={cn(
                "py-2 rounded-md text-sm font-medium transition-all",
                orderType === "BUY" ? "bg-success text-white shadow" : "text-dark-100 hover:text-white"
              )}
            >
              BUY
            </button>
            <button
              onClick={() => setOrderType("SELL")}
              className={cn(
                "py-2 rounded-md text-sm font-medium transition-all",
                orderType === "SELL" ? "bg-danger text-white shadow" : "text-dark-100 hover:text-white"
              )}
            >
              SELL
            </button>
          </div>

          <label className="block text-xs text-dark-100 mb-2">Quantity</label>
          <div className="flex items-center gap-2 mb-5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-dark-50 text-lg font-bold transition-colors">
              −
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="flex-1 h-10 text-center rounded-lg bg-white/5 border border-white/10 text-dark-50 font-mono focus:outline-none focus:border-primary-500/50"
            />
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-dark-50 text-lg font-bold transition-colors">
              +
            </button>
          </div>

          <div className="space-y-2.5 p-4 rounded-xl bg-white/[0.03] mb-5">
            <div className="flex justify-between text-xs">
              <span className="text-dark-100">Price</span>
              <span className="font-mono">₹{selectedStock?.currentPrice.toLocaleString("en-IN") || 0}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-dark-100">Quantity</span>
              <span className="font-mono">{quantity}</span>
            </div>
            <div className="border-t border-white/5 pt-2.5 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span className="font-mono">₹{orderTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {portfolio && (
            <p className="text-xs text-dark-100 mb-4 text-center">
              {orderType === "BUY"
                ? `Available: ₹${portfolio.cash.toLocaleString("en-IN")}`
                : `You own: ${holding?.quantity || 0} share(s)`}
            </p>
          )}

          <Button
            variant={orderType === "BUY" ? "primary" : "danger"}
            size="lg"
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={placing || !selectedStock}
          >
            {placing ? "Placing..." : `${orderType === "BUY" ? "Buy" : "Sell"} ${quantity} ${selectedStock?.symbol || ""}`}
          </Button>

          <p className="text-[10px] text-dark-100 text-center mt-4 leading-relaxed">
            ⚠️ Educational only. Virtual trades — no real money involved.
          </p>
        </div>
      </div>
    </div>
  );
}