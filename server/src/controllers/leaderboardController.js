import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";
import Trade from "../models/Trade.js";

// @desc    Get global leaderboard
// @route   GET /api/v1/leaderboard
// @access  Private
export const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    // Top users by coins
    const topUsers = await User.find({ isActive: true })
      .select("name avatar coins streak createdAt")
      .sort({ coins: -1, "streak.longest": -1, createdAt: 1 })
      .limit(Number(limit));

    // Enrich with lessons + trades count
    const leaderboard = await Promise.all(
      topUsers.map(async (u, i) => {
        const [lessons, trades] = await Promise.all([
          UserProgress.countDocuments({ userId: u._id, completed: true }),
          Trade.countDocuments({ userId: u._id }),
        ]);

        return {
          rank: i + 1,
          userId: u._id,
          name: u.name,
          avatar: u.avatar,
          coins: u.coins,
          streak: u.streak?.current || 0,
          lessonsCompleted: lessons,
          totalTrades: trades,
        };
      })
    );

    // Current user's rank
    const currentUser = await User.findById(req.user._id).select("coins");
    const higherRanked = await User.countDocuments({
      isActive: true,
      $or: [
        { coins: { $gt: currentUser.coins } },
        { coins: currentUser.coins, createdAt: { $lt: req.user.createdAt } },
      ],
    });

    const currentUserRank = higherRanked + 1;

    // Current user's full stats (even if not in top 20)
    const isInTop = leaderboard.some(
      (u) => u.userId.toString() === req.user._id.toString()
    );

    let currentUserEntry = null;
    if (!isInTop) {
      const [lessons, trades] = await Promise.all([
        UserProgress.countDocuments({
          userId: req.user._id,
          completed: true,
        }),
        Trade.countDocuments({ userId: req.user._id }),
      ]);
      currentUserEntry = {
        rank: currentUserRank,
        userId: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
        coins: currentUser.coins,
        streak: req.user.streak?.current || 0,
        lessonsCompleted: lessons,
        totalTrades: trades,
      };
    }

    res.status(200).json({
      success: true,
      leaderboard,
      currentUserRank,
      currentUserEntry,
    });
  } catch (error) {
    next(error);
  }
};