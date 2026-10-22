import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";
import Trade from "../models/Trade.js";
import Portfolio from "../models/Portfolio.js";

// -------- Helper: badge definitions --------
const computeBadges = ({ lessonsCompleted, totalTrades, portfolioValue, streakLongest, coins }) => {
  return [
    {
      id: "first_steps",
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      unlocked: lessonsCompleted >= 1,
      progress: Math.min(lessonsCompleted, 1),
      total: 1,
    },
    {
      id: "scholar",
      name: "Scholar",
      description: "Complete 5 lessons",
      icon: "📚",
      unlocked: lessonsCompleted >= 5,
      progress: Math.min(lessonsCompleted, 5),
      total: 5,
    },
    {
      id: "first_trade",
      name: "First Trade",
      description: "Place your first trade",
      icon: "📈",
      unlocked: totalTrades >= 1,
      progress: Math.min(totalTrades, 1),
      total: 1,
    },
    {
      id: "active_trader",
      name: "Active Trader",
      description: "Place 10 trades",
      icon: "💹",
      unlocked: totalTrades >= 10,
      progress: Math.min(totalTrades, 10),
      total: 10,
    },
    {
      id: "wealthy",
      name: "Wealthy",
      description: "Reach ₹11,00,000 portfolio value",
      icon: "💰",
      unlocked: portfolioValue >= 1100000,
      progress: Math.min(Math.round(portfolioValue), 1100000),
      total: 1100000,
    },
    {
      id: "streak_3",
      name: "Consistent",
      description: "Maintain a 3-day streak",
      icon: "🔥",
      unlocked: streakLongest >= 3,
      progress: Math.min(streakLongest, 3),
      total: 3,
    },
    {
      id: "streak_7",
      name: "On Fire",
      description: "Maintain a 7-day streak",
      icon: "⚡",
      unlocked: streakLongest >= 7,
      progress: Math.min(streakLongest, 7),
      total: 7,
    },
    {
      id: "coin_collector",
      name: "Coin Collector",
      description: "Earn 500 coins",
      icon: "🪙",
      unlocked: coins >= 500,
      progress: Math.min(coins, 500),
      total: 500,
    },
  ];
};

// @desc    Get user's rewards + badges + stats
// @route   GET /api/v1/rewards
// @access  Private
export const getRewards = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const [lessonsCompleted, totalTrades, portfolio] = await Promise.all([
      UserProgress.countDocuments({ userId: req.user._id, completed: true }),
      Trade.countDocuments({ userId: req.user._id }),
      Portfolio.findOne({ userId: req.user._id }),
    ]);

    const portfolioValue = portfolio?.cash || 0;

    const badges = computeBadges({
      lessonsCompleted,
      totalTrades,
      portfolioValue,
      streakLongest: user.streak?.longest || 0,
      coins: user.coins,
    });

    res.status(200).json({
      success: true,
      coins: user.coins,
      streak: {
        current: user.streak?.current || 0,
        longest: user.streak?.longest || 0,
        lastActiveDate: user.streak?.lastActiveDate || null,
      },
      stats: {
        lessonsCompleted,
        totalTrades,
        portfolioValue,
      },
      badges,
      badgesUnlocked: badges.filter((b) => b.unlocked).length,
      badgesTotal: badges.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Daily check-in — updates streak + awards coins
// @route   POST /api/v1/rewards/daily-check
// @access  Private
export const dailyCheckIn = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const lastActive = user.streak?.lastActiveDate
      ? new Date(user.streak.lastActiveDate)
      : null;

    const lastActiveDay = lastActive
      ? new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate())
      : null;

    // Already checked in today?
    if (lastActiveDay && lastActiveDay.getTime() === today.getTime()) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today. Come back tomorrow!",
      });
    }

    // Calculate new streak
    let newStreak = 1;
    if (lastActiveDay) {
      const diffDays = Math.floor(
        (today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        // Continuous
        newStreak = (user.streak?.current || 0) + 1;
      } else {
        // Broken streak
        newStreak = 1;
      }
    }

    const longest = Math.max(user.streak?.longest || 0, newStreak);

    // Streak-based coin reward: base 10, +5 per streak day (max 50)
    const coinsAwarded = Math.min(10 + (newStreak - 1) * 5, 50);

    user.streak = {
      current: newStreak,
      longest,
      lastActiveDate: now,
    };
    user.coins += coinsAwarded;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Checked in! +${coinsAwarded} coins earned 🎉`,
      coinsAwarded,
      streak: {
        current: newStreak,
        longest,
        lastActiveDate: now,
      },
      totalCoins: user.coins,
    });
  } catch (error) {
    next(error);
  }
};