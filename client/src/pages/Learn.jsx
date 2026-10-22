import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Coins,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Compass,
  Briefcase,
  Shield,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import api from "../services/api";
import { cn } from "../utils/cn";

// ---------- Module metadata ----------
const MODULE_META = {
  Foundations: {
    icon: BookOpen,
    color: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "The basics every investor must know before starting.",
  },
  "Investing Basics": {
    icon: Compass,
    color: "from-blue-500 to-cyan-500",
    textColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: "Learn how to actually put your money to work.",
  },
  "Trading Fundamentals": {
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
    textColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description: "Understand how markets move day-to-day.",
  },
  "Fundamental Analysis": {
    icon: Briefcase,
    color: "from-purple-500 to-pink-500",
    textColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    description: "Learn to read financials and value companies.",
  },
  "Risk & Mindset": {
    icon: Shield,
    color: "from-rose-500 to-red-500",
    textColor: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    description: "The most important module — protect your capital.",
  },
};

const MODULE_ORDER = [
  "Foundations",
  "Investing Basics",
  "Trading Fundamentals",
  "Fundamental Analysis",
  "Risk & Mindset",
];

const levelColors = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  advanced: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function Learn() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState("Foundations");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/lessons");
      setLessons(data.lessons || []);
    } catch (error) {
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Group lessons by module ----------
  const modules = useMemo(() => {
    return MODULE_ORDER.map((modName) => {
      const moduleLessons = lessons.filter((l) => l.module === modName);
      const completed = moduleLessons.filter((l) => l.progress?.completed).length;
      const total = moduleLessons.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        name: modName,
        lessons: moduleLessons,
        completed,
        total,
        percent,
        ...MODULE_META[modName],
      };
    }).filter((m) => m.total > 0);
  }, [lessons]);

  // ---------- Overall stats ----------
  const totalLessons = lessons.length;
  const totalCompleted = lessons.filter((l) => l.progress?.completed).length;
  const overallPercent =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ---------- HEADER ---------- */
      }
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Learn Stock Market 📚
          </h1>
          <p className="text-dark-100 text-sm">
            {totalLessons} lessons across 5 modules — from zero to confident
            investor.
          </p>
        </div>

        {/* Overall progress ring */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="url(#grad)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${
                  2 * Math.PI * 24 * (1 - overallPercent / 100)
                }`}
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {overallPercent}%
            </div>
          </div>
          <div>
            <p className="text-xs text-dark-100">Overall Progress</p>
            <p className="text-sm font-semibold">
              {totalCompleted} / {totalLessons} completed
            </p>
          </div>
        </div>
      </div>

      {/* ---------- INFO BANNER ---------- */}
      <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 flex items-start gap-3">
        <GraduationCap className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary-300 mb-0.5">
            Complete the modules in order
          </p>
          <p className="text-xs text-dark-100 leading-relaxed">
            Start from Foundations and move upward. Each lesson includes real
            examples, quiz, and external links to Zerodha Varsity, SEBI, and
            AMFI for deeper study.
          </p>
        </div>
      </div>

      {/* ---------- LOADING ---------- */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* ---------- MODULES ---------- */}
      {!loading && (
        <div className="space-y-4">
          {modules.map((mod, modIndex) => {
            const ModIcon = mod.icon;
            const isExpanded = expandedModule === mod.name;
            const isComplete = mod.percent === 100;

            return (
              <motion.div
                key={mod.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: modIndex * 0.05 }}
                className={cn(
                  "rounded-2xl border overflow-hidden transition-all duration-300",
                  mod.borderColor,
                  isExpanded
                    ? "bg-white/[0.03]"
                    : "bg-white/[0.02] hover:bg-white/[0.025]"
                )}
              >
                {/* Module header */}
                <button
                  onClick={() =>
                    setExpandedModule(isExpanded ? null : mod.name)
                  }
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0",
                      mod.color
                    )}
                  >
                    <ModIcon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold">{mod.name}</h2>
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                          mod.bgColor,
                          mod.textColor
                        )}
                      >
                        Module {modIndex + 1}
                      </span>
                      {isComplete && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/10 text-success">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dark-100 mt-1 truncate">
                      {mod.description}
                    </p>
                  </div>

                  {/* Progress pill */}
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-dark-100">
                        {mod.completed} / {mod.total}
                      </p>
                      <p
                        className={cn(
                          "text-sm font-mono font-bold",
                          isComplete ? "text-success" : mod.textColor
                        )}
                      >
                        {mod.percent}%
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-dark-100 transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {/* Progress bar */}
                <div className="h-1 bg-white/5">
                  <div
                    className={cn("h-full bg-gradient-to-r transition-all duration-500", mod.color)}
                    style={{ width: `${mod.percent}%` }}
                  />
                </div>

                {/* Lessons list */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-2">
                        {mod.lessons.map((lesson, idx) => (
                          <LessonRow
                            key={lesson._id}
                            lesson={lesson}
                            index={idx + 1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ---------- COMPLETION CTA ---------- */}
      {!loading && overallPercent === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-success/30 bg-gradient-to-br from-success/10 to-transparent p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
            <Trophy className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-success mb-2">
            Congratulations! 🎉
          </h3>
          <p className="text-sm text-dark-100 max-w-md mx-auto">
            You've completed all 21 lessons. Now apply your knowledge in the
            virtual trading terminal.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ---------- SUB-COMPONENT: Lesson Row ----------
function LessonRow({ lesson, index }) {
  const completed = lesson.progress?.completed;

  return (
    <Link
      to={`/learn/${lesson.slug}`}
      className={cn(
        "group flex items-center gap-4 p-3 rounded-xl border transition-all",
        completed
          ? "border-success/20 bg-success/[0.03] hover:bg-success/[0.06]"
          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
      )}
    >
      {/* Number / Completed */}
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-mono font-bold shrink-0",
          completed
            ? "bg-success/20 text-success"
            : "bg-white/5 text-dark-100"
        )}
      >
        {completed ? <CheckCircle2 className="w-4 h-4" /> : index}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold truncate transition-colors",
            completed
              ? "text-success group-hover:text-success"
              : "group-hover:text-primary-300"
          )}
        >
          {lesson.title}
        </p>
        <div className="flex items-center gap-3 text-xs text-dark-100 mt-0.5">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lesson.duration} min
          </span>
          <span className="flex items-center gap-1">
            <Coins className="w-3 h-3 text-coin" />
            <span className="font-mono">{lesson.coinReward}</span>
          </span>
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border",
              levelColors[lesson.level]
            )}
          >
            {lesson.level}
          </span>
        </div>
      </div>

      <ArrowRight className="w-4 h-4 text-dark-100 group-hover:text-primary-400 group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}