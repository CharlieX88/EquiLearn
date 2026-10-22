import { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Coins,
  Flame,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import api from "../services/api";
import { cn } from "../utils/cn";
import useAuthStore from "../store/authStore";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

const rankMedals = {
  1: { icon: Crown, color: "text-yellow-400", bg: "from-yellow-500/20" },
  2: { icon: Medal, color: "text-gray-300", bg: "from-gray-400/20" },
  3: { icon: Medal, color: "text-amber-600", bg: "from-amber-600/20" },
};

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get("/leaderboard");
      setData(res);
    } catch (error) {
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
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

  const { leaderboard, currentUserEntry, currentUserRank } = data;
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Leaderboard 🏆</h1>
        <p className="text-dark-100 text-sm">
          Top learners ranked by coins earned.
        </p>
      </div>

      {/* Your rank card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-600/10 to-transparent p-5 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-600/30">
            {getInitials(currentUser?.name)}
          </div>
          <div>
            <p className="text-xs text-dark-100 mb-0.5">Your Rank</p>
            <p className="text-sm font-semibold">{currentUser?.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-mono text-primary-400">
            #{currentUserRank}
          </p>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-3 items-end">
          {/* 2nd place */}
          {topThree[1] && (
            <PodiumCard user={topThree[1]} place={2} delay={0.1} />
          )}
          {/* 1st place */}
          {topThree[0] && (
            <PodiumCard user={topThree[0]} place={1} delay={0} big />
          )}
          {/* 3rd place */}
          {topThree[2] && (
            <PodiumCard user={topThree[2]} place={3} delay={0.2} />
          )}
        </div>
      )}

      {/* Rest of the list */}
      {rest.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <p className="text-xs text-dark-100 uppercase tracking-wider font-medium">
              Rankings
            </p>
          </div>
          {rest.map((user, i) => (
            <LeaderboardRow
              key={user.userId}
              user={user}
              isCurrentUser={user.userId === currentUser?._id}
              delay={i * 0.03}
            />
          ))}
        </div>
      )}

      {/* Current user (if not in top list) */}
      {currentUserEntry && (
        <div className="rounded-2xl border border-primary-500/20 bg-primary-500/[0.03] overflow-hidden">
          <div className="px-5 py-3 border-b border-primary-500/10">
            <p className="text-xs text-primary-300 uppercase tracking-wider font-medium">
              Your Position
            </p>
          </div>
          <LeaderboardRow user={currentUserEntry} isCurrentUser highlight />
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-dark-100 text-center">
        Rankings update in real-time as you earn coins by completing lessons,
        trading, and maintaining streaks.
      </p>
    </div>
  );
}

// -------- SUB-COMPONENTS --------

function PodiumCard({ user, place, delay = 0, big = false }) {
  const medal = rankMedals[place];
  const Icon = medal.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "relative rounded-2xl border bg-gradient-to-br to-transparent p-4 text-center",
        big
          ? "border-yellow-500/30 from-yellow-500/10 pb-6"
          : place === 2
          ? "border-gray-400/20 from-gray-400/5 mt-6"
          : "border-amber-600/20 from-amber-600/5 mt-10"
      )}
    >
      {/* Crown for #1 */}
      {big && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-xl shadow-yellow-500/40">
            <Crown className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      {/* Rank icon */}
      <div className={cn("flex justify-center mb-2", big && "mt-4")}>
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            place === 1
              ? "bg-yellow-500/20"
              : place === 2
              ? "bg-gray-400/20"
              : "bg-amber-600/20"
          )}
        >
          <Icon className={cn("w-5 h-5", medal.color)} />
        </div>
      </div>

      {/* Avatar */}
      <div
        className={cn(
          "mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow-lg mb-2",
          big ? "w-16 h-16 text-lg" : "w-12 h-12 text-sm"
        )}
      >
        {getInitials(user.name)}
      </div>

      {/* Name */}
      <p className={cn("font-semibold truncate", big ? "text-base" : "text-sm")}>
        {user.name}
      </p>

      {/* Coins */}
      <div className="flex items-center justify-center gap-1 mt-1.5">
        <Coins className="w-3.5 h-3.5 text-coin" />
        <span className={cn("font-mono font-bold text-coin", big ? "text-lg" : "text-sm")}>
          {user.coins}
        </span>
      </div>

      {/* Extra stats */}
      <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-dark-100">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {user.lessonsCompleted}
        </span>
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-400" />
          {user.streak}
        </span>
      </div>
    </motion.div>
  );
}

function LeaderboardRow({ user, isCurrentUser, highlight = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        "flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0 transition-colors",
        isCurrentUser
          ? "bg-primary-500/10"
          : "hover:bg-white/[0.02]"
      )}
    >
      {/* Rank */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-sm",
          user.rank <= 3
            ? "bg-primary-500/20 text-primary-300"
            : "bg-white/5 text-dark-100"
        )}
      >
        {user.rank}
      </div>

      {/* Avatar */}
      <div
        className={cn(
          "w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white shrink-0"
        )}
      >
        {getInitials(user.name)}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user.name}
          {isCurrentUser && (
            <span className="ml-2 text-[10px] text-primary-400 font-semibold">
              YOU
            </span>
          )}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-dark-100 mt-0.5">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {user.lessonsCompleted} lessons
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {user.totalTrades} trades
          </span>
        </div>
      </div>

      {/* Streak */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10">
        <Flame className="w-3.5 h-3.5 text-orange-400" />
        <span className="text-xs font-mono font-semibold text-orange-400">
          {user.streak}
        </span>
      </div>

      {/* Coins */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coin/10 border border-coin/20">
        <Coins className="w-3.5 h-3.5 text-coin" />
        <span className="text-sm font-mono font-bold text-coin">
          {user.coins}
        </span>
      </div>
    </motion.div>
  );
}