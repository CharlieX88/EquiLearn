import { useEffect, useState } from "react";
import {
  Coins,
  Flame,
  Trophy,
  Gift,
  BookOpen,
  TrendingUp,
  Wallet,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import api from "../services/api";
import Button from "../components/ui/Button";
import { cn } from "../utils/cn";

export default function Rewards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/rewards");
      setData(data);
    } catch (error) {
      toast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      const { data: res } = await api.post("/rewards/daily-check");
      toast.success(res.message);
      await fetchRewards();
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-in failed");
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();

  const lastActive = data.streak.lastActiveDate
    ? new Date(data.streak.lastActiveDate)
    : null;
  const lastActiveDate = lastActive
    ? new Date(
        lastActive.getFullYear(),
        lastActive.getMonth(),
        lastActive.getDate()
      ).getTime()
    : null;

  const checkedInToday = lastActiveDate === todayDate;

  // 7-day streak calendar (last 7 days)
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).getTime();
    const isActive = data.streak.current > 0 && lastActiveDate && dDate <= lastActiveDate;
    const daysAgo = Math.floor(
      (todayDate - dDate) / (1000 * 60 * 60 * 24)
    );
    const isWithinStreak = isActive && daysAgo < data.streak.current;
    return { date: d, isWithinStreak, isToday: dDate === todayDate };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Rewards & Streaks 🎁</h1>
        <p className="text-dark-100 text-sm">
          Earn coins, maintain streaks, unlock badges.
        </p>
      </div>

      {/* Top 3 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Coins */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl border border-coin/20 bg-gradient-to-br from-coin/10 to-transparent p-6 overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-coin/20 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-coin/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-coin" />
            </div>
            <Gift className="w-5 h-5 text-coin/50" />
          </div>
          <p className="relative text-xs text-dark-100 mb-1">Your Coins</p>
          <p className="relative text-3xl font-bold font-mono text-coin">
            {data.coins}
          </p>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6 overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="relative text-xs text-dark-100 mb-1">Current Streak</p>
          <p className="relative text-3xl font-bold font-mono text-orange-400">
            {data.streak.current} <span className="text-base">days</span>
          </p>
          <p className="relative text-xs text-dark-100 mt-1">
            Longest: {data.streak.longest} days
          </p>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 to-transparent p-6 overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-400" />
            </div>
          </div>
          <p className="relative text-xs text-dark-100 mb-1">Badges Unlocked</p>
          <p className="relative text-3xl font-bold font-mono text-primary-400">
            {data.badgesUnlocked} <span className="text-base">/ {data.badgesTotal}</span>
          </p>
        </motion.div>
      </div>

      {/* Daily check-in + streak calendar */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Check-in */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="font-semibold">Daily Check-in</h2>
              <p className="text-xs text-dark-100">
                Check in every day to grow your streak
              </p>
            </div>
          </div>

          {/* 7-day strip */}
          <div className="grid grid-cols-7 gap-1.5 mb-5">
            {days.map((d, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] text-dark-100 mb-1.5">
                  {d.date.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2)}
                </p>
                <div
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center border transition-all",
                    d.isWithinStreak
                      ? "bg-orange-500/20 border-orange-500/40"
                      : "bg-white/[0.02] border-white/5",
                    d.isToday && "ring-2 ring-primary-500/40"
                  )}
                >
                  {d.isWithinStreak ? (
                    <Flame className="w-4 h-4 text-orange-400" />
                  ) : (
                    <span className="text-[10px] text-dark-100 font-mono">
                      {d.date.getDate()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Check-in button */}
          {checkedInToday ? (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <p className="text-sm font-medium text-success">
                Already checked in today!
              </p>
            </div>
          ) : (
            <>
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={handleCheckIn}
                disabled={checkingIn}
              >
                {checkingIn ? (
                  "Checking in..."
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Check In Today
                  </>
                )}
              </Button>
              <p className="text-xs text-dark-100 text-center mt-3">
                Next streak: +{Math.min(10 + (data.streak.current) * 5, 50)} coins
              </p>
            </>
          )}
        </div>

        {/* Your stats */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="font-semibold mb-5">Your Stats</h2>
          <div className="space-y-3">
            {[
              {
                icon: BookOpen,
                label: "Lessons Completed",
                value: data.stats.lessonsCompleted,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: TrendingUp,
                label: "Total Trades",
                value: data.stats.totalTrades,
                color: "text-primary-400",
                bg: "bg-primary-500/10",
              },
              {
                icon: Wallet,
                label: "Portfolio Value",
                value: `₹${data.stats.portfolioValue.toLocaleString("en-IN")}`,
                color: "text-coin",
                bg: "bg-coin/10",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        s.bg
                      )}
                    >
                      <Icon className={cn("w-5 h-5", s.color)} />
                    </div>
                    <p className="text-sm text-dark-100">{s.label}</p>
                  </div>
                  <p className="text-lg font-bold font-mono">{s.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "relative p-5 rounded-2xl border text-center transition-all",
                badge.unlocked
                  ? "border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-transparent"
                  : "border-white/5 bg-white/[0.02] opacity-60"
              )}
            >
              {!badge.unlocked && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-3.5 h-3.5 text-dark-100" />
                </div>
              )}

              <div
                className={cn(
                  "text-4xl mb-3 transition-all",
                  !badge.unlocked && "grayscale opacity-50"
                )}
              >
                {badge.icon}
              </div>

              <h3
                className={cn(
                  "font-semibold text-sm mb-1",
                  badge.unlocked ? "text-white" : "text-dark-100"
                )}
              >
                {badge.name}
              </h3>
              <p className="text-[11px] text-dark-100 mb-3 leading-relaxed">
                {badge.description}
              </p>

              {/* Progress bar */}
              {badge.total > 1 && !badge.unlocked && (
                <div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-primary-500 transition-all"
                      style={{
                        width: `${Math.min(
                          (badge.progress / badge.total) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-dark-100 mt-1.5 font-mono">
                    {badge.progress} / {badge.total}
                  </p>
                </div>
              )}

              {badge.unlocked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  Unlocked
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}