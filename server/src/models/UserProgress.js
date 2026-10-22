import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
      default: 0,
    },
    quizTotal: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Ek user ek lesson ko ek hi baar complete kar sakta hai
userProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

export default UserProgress;