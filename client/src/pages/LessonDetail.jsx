import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Coins,
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkles,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Code2,
  ExternalLink,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import api from "../services/api";
import Button from "../components/ui/Button";
import { cn } from "../utils/cn";

const levelColors = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  advanced: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

function ContentBlock({ block }) {
  const { type, text, items } = block;

  switch (type) {
    case "heading":
      return (
        <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-dark-50">
          {text}
        </h2>
      );
    case "paragraph":
      return <p className="text-dark-100 leading-relaxed mb-5">{text}</p>;
    case "tip":
      return (
        <div className="my-6 p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
          <p className="text-sm text-dark-100 leading-relaxed">{text}</p>
        </div>
      );
    case "warning":
      return (
        <div className="my-6 p-4 rounded-xl border border-warning/20 bg-warning/5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-dark-100 leading-relaxed">{text}</p>
        </div>
      );
    case "code":
      return (
        <div className="my-6 p-4 rounded-xl border border-white/10 bg-dark-950 font-mono text-sm flex items-start gap-3">
          <Code2 className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
          <code className="text-primary-300">{text}</code>
        </div>
      );
    case "list":
      return (
        <ul className="space-y-2.5 my-5">
          {items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-dark-100">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function LessonDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLesson();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/lessons/${slug}`);
      setLesson(data.lesson);
      setProgress(data.progress);
      setAnswers(new Array(data.lesson.quiz.length).fill(-1));
      if (data.progress?.completed) {
        setSubmitted(true);
        setResult({
          passed: true,
          quizScore: data.progress.quizScore,
          quizTotal: data.progress.quizTotal,
          alreadyDone: true,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lesson not found");
      navigate("/learn");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex, optIndex) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === -1)) {
      toast.error("Please answer all questions first");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await api.post(`/lessons/${slug}/complete`, {
        answers,
      });
      setResult(data);
      setSubmitted(true);
      if (data.passed) {
        toast.success(data.message);
        if (data.coinsAwarded > 0) {
          setTimeout(() => {
            toast.success(`+${data.coinsAwarded} coins earned! 🪙`, {
              duration: 4000,
            });
          }, 800);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(lesson.quiz.length).fill(-1));
    setSubmitted(false);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 w-32 rounded bg-white/5 animate-pulse" />
        <div className="h-12 rounded bg-white/5 animate-pulse" />
        <div className="h-32 rounded bg-white/5 animate-pulse" />
        <div className="h-64 rounded bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!lesson) return null;

  const allAnswered = !answers.some((a) => a === -1);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        to="/learn"
        className="inline-flex items-center gap-2 text-sm text-dark-100 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to lessons
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary-500/10 border border-primary-500/20 text-primary-300">
            {lesson.module}
          </span>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border",
              levelColors[lesson.level]
            )}
          >
            {lesson.level}
          </span>
          {progress?.completed && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-success/10 border border-success/20 text-success">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {lesson.title}
        </h1>

        <p className="text-dark-100 leading-relaxed mb-5">
          {lesson.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-dark-100">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {lesson.duration} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-coin" />
            <span className="font-mono">{lesson.coinReward}</span> coins
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-primary-400" />
            <span className="font-mono">{lesson.xpReward}</span> XP
          </span>
        </div>
      </div>

      {/* Content */}
      <article className="mb-10">
        {lesson.content.map((block, i) => (
          <ContentBlock key={i} block={block} />
        ))}
      </article>

      {/* ---------- KEY TAKEAWAYS ---------- */}
      {lesson.keyTakeaways?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 p-6 rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-600/10 to-transparent"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-primary-400" />
            </div>
            <h3 className="font-bold">Key Takeaways</h3>
          </div>
          <ul className="space-y-2.5">
            {lesson.keyTakeaways.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-dark-100 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ---------- QUIZ ---------- */}
      {lesson.quiz.length > 0 && (
        <section className="border-t border-white/5 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Quick Quiz</h2>
              <p className="text-xs text-dark-100">
                {lesson.quiz.length} question
                {lesson.quiz.length > 1 ? "s" : ""} • Pass to complete lesson
              </p>
            </div>
          </div>

          <div className="space-y-6 mt-8">
            {lesson.quiz.map((q, qIndex) => {
              const selected = answers[qIndex];

              return (
                <div
                  key={qIndex}
                  className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                  <p className="font-medium mb-4">
                    <span className="text-primary-400 font-mono mr-2">
                      Q{qIndex + 1}.
                    </span>
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selected === optIndex;
                      const showCorrect =
                        submitted && optIndex === q.correctIndex;
                      const showWrong =
                        submitted && isSelected && optIndex !== q.correctIndex;

                      return (
                        <button
                          key={optIndex}
                          onClick={() =>
                            handleSelectAnswer(qIndex, optIndex)
                          }
                          disabled={submitted}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all duration-200",
                            !submitted &&
                              (isSelected
                                ? "border-primary-500/50 bg-primary-500/10 text-white"
                                : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] text-dark-100"),
                            showCorrect &&
                              "border-success/50 bg-success/10 text-success",
                            showWrong &&
                              "border-danger/50 bg-danger/10 text-danger",
                            submitted &&
                              !showCorrect &&
                              !showWrong &&
                              "border-white/5 bg-white/[0.02] text-dark-100 opacity-60"
                          )}
                        >
                          <span
                            className={cn(
                              "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0",
                              isSelected && !submitted
                                ? "border-primary-400 bg-primary-500/20 text-primary-300"
                                : "border-white/10",
                              showCorrect &&
                                "border-success bg-success/20 text-success",
                              showWrong &&
                                "border-danger bg-danger/20 text-danger"
                            )}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {showCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                          )}
                          {showWrong && (
                            <XCircle className="w-4 h-4 text-danger shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && q.explanation && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-xl bg-primary-500/5 border border-primary-500/20"
                    >
                      <p className="text-xs text-primary-300 font-semibold mb-1">
                        💡 Explanation
                      </p>
                      <p className="text-xs text-dark-100 leading-relaxed">
                        {q.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Result banner */}
          {submitted && result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-8 p-6 rounded-2xl border text-center",
                result.passed
                  ? "border-success/30 bg-success/5"
                  : "border-danger/30 bg-danger/5"
              )}
            >
              {result.passed ? (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 mb-3">
                    <Trophy className="w-7 h-7 text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-success mb-1">
                    Lesson Complete! 🎉
                  </h3>
                  <p className="text-sm text-dark-100 mb-2">
                    You scored {result.quizScore}/{result.quizTotal}
                  </p>
                  {result.coinsAwarded > 0 && (
                    <p className="text-sm font-mono text-coin">
                      +{result.coinsAwarded} coins added to your wallet
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-danger/10 mb-3">
                    <XCircle className="w-7 h-7 text-danger" />
                  </div>
                  <h3 className="text-xl font-bold text-danger mb-1">
                    Not quite there
                  </h3>
                  <p className="text-sm text-dark-100 mb-4">
                    You scored {result.quizScore}/{result.quizTotal}. Review the
                    lesson and try again.
                  </p>
                  <Button variant="secondary" size="md" onClick={handleRetry}>
                    Try Again
                  </Button>
                </>
              )}
            </motion.div>
          )}

          {/* Submit button */}
          {!submitted && (
            <div className="mt-8 flex justify-end">
              <Button
                variant="gradient"
                size="lg"
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
              >
                {submitting ? "Submitting..." : "Submit Answers"}
              </Button>
            </div>
          )}
        </section>
      )}

      {/* ---------- EXTERNAL RESOURCES ---------- */}
      {lesson.externalResources?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 border-t border-white/5 pt-8"
        >
          <div className="mb-5">
            <h3 className="font-bold mb-1">Want to learn more?</h3>
            <p className="text-xs text-dark-100">
              Hand-picked resources from trusted sources.
            </p>
          </div>

          <div className="space-y-2">
            {lesson.externalResources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-primary-500/30 hover:bg-primary-500/5 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-4 h-4 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary-300 transition-colors truncate">
                    {res.title}
                  </p>
                  {res.source && (
                    <p className="text-xs text-dark-100 truncate">
                      {res.source}
                    </p>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-dark-100 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* ---------- NEXT CTA ---------- */}
      {submitted && result?.passed && (
        <div className="mt-10 flex justify-center">
          <Link to="/learn">
            <Button variant="secondary" size="lg">
              <BookOpen className="w-4 h-4" />
              Explore More Lessons
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}