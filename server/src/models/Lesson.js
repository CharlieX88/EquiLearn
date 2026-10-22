import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      enum: [
        "Foundations",
        "Investing Basics",
        "Trading Fundamentals",
        "Fundamental Analysis",
        "Risk & Mindset",
      ],
      default: "Foundations",
    },
    moduleOrder: {
      type: Number,
      default: 1,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: {
      type: Number,
      default: 5,
    },
    xpReward: {
      type: Number,
      default: 10,
    },
    coinReward: {
      type: Number,
      default: 5,
    },
    order: {
      type: Number,
      default: 0,
    },
    content: [
      {
        type: {
          type: String,
          enum: [
            "heading",
            "paragraph",
            "tip",
            "warning",
            "code",
            "list",
          ],
          default: "paragraph",
        },
        text: { type: String, default: "" },
        items: [{ type: String }],
      },
    ],
    keyTakeaways: [{ type: String }],
    externalResources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        source: { type: String, default: "" },
      },
    ],
    quiz: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true },
        explanation: { type: String, default: "" },
      },
    ],
    tags: [{ type: String }],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

lessonSchema.index({ level: 1, order: 1 });
lessonSchema.index({ moduleOrder: 1, order: 1 });

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;