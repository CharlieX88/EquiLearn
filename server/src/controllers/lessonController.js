import Lesson from "../models/Lesson.js";
import UserProgress from "../models/UserProgress.js";
import User from "../models/User.js";

// @desc    Get all lessons (with user progress)
// @route   GET /api/v1/lessons
// @access  Private
export const getLessons = async (req, res, next) => {
  try {
    const { level } = req.query;

    const filter = { isPublished: true };
    if (level && ["beginner", "intermediate", "advanced"].includes(level)) {
      filter.level = level;
    }

    const lessons = await Lesson.find(filter)
      .select("-content -quiz")
      .sort({ level: 1, order: 1 });

    // User ki progress laao
    const progressList = await UserProgress.find({ userId: req.user._id });
    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.lessonId.toString()] = {
        completed: p.completed,
        quizScore: p.quizScore,
        quizTotal: p.quizTotal,
      };
    });

    const lessonsWithProgress = lessons.map((l) => ({
      ...l.toObject(),
      progress: progressMap[l._id.toString()] || {
        completed: false,
        quizScore: 0,
        quizTotal: 0,
      },
    }));

    res.status(200).json({
      success: true,
      count: lessonsWithProgress.length,
      lessons: lessonsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lesson by slug
// @route   GET /api/v1/lessons/:slug
// @access  Private
export const getLessonBySlug = async (req, res, next) => {
  try {
    const lesson = await Lesson.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const progress = await UserProgress.findOne({
      userId: req.user._id,
      lessonId: lesson._id,
    });

    res.status(200).json({
      success: true,
      lesson,
      progress: progress || {
        completed: false,
        quizScore: 0,
        quizTotal: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete lesson + submit quiz
// @route   POST /api/v1/lessons/:slug/complete
// @access  Private
export const completeLesson = async (req, res, next) => {
  try {
    const { answers } = req.body; // array of selected indices

    const lesson = await Lesson.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Quiz check karo
    let quizScore = 0;
    const quizTotal = lesson.quiz.length;

    if (Array.isArray(answers) && quizTotal > 0) {
      lesson.quiz.forEach((q, i) => {
        if (answers[i] === q.correctIndex) quizScore++;
      });
    }

    const passed = quizTotal === 0 || quizScore >= Math.ceil(quizTotal / 2);

    // Progress update (upsert)
    let progress = await UserProgress.findOne({
      userId: req.user._id,
      lessonId: lesson._id,
    });

    const alreadyCompleted = progress?.completed;

    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user._id,
        lessonId: lesson._id,
        completed: passed,
        quizScore,
        quizTotal,
        completedAt: passed ? new Date() : null,
      });
    } else {
      progress.quizScore = Math.max(progress.quizScore, quizScore);
      progress.quizTotal = quizTotal;
      if (passed && !progress.completed) {
        progress.completed = true;
        progress.completedAt = new Date();
      }
      await progress.save();
    }

    // Pehli baar complete kiya toh rewards do
    let coinsAwarded = 0;
    let xpAwarded = 0;

    if (passed && !alreadyCompleted) {
      coinsAwarded = lesson.coinReward;
      xpAwarded = lesson.xpReward;

      await User.findByIdAndUpdate(req.user._id, {
        $inc: { coins: coinsAwarded },
      });
    }

    res.status(200).json({
      success: true,
      passed,
      quizScore,
      quizTotal,
      coinsAwarded,
      xpAwarded,
      message: passed
        ? alreadyCompleted
          ? "Lesson already completed. Good revision!"
          : `Lesson complete! +${coinsAwarded} coins 🎉`
        : "Quiz mein thoda aur improve karo. Try again!",
    });
  } catch (error) {
    next(error);
  }
};