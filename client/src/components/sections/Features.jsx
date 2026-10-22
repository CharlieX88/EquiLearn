import { motion } from "framer-motion";
import {
  LineChart,
  Bot,
  Trophy,
  IndianRupee,
  BookOpen,
  Wallet,
} from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";

const features = [
  {
    icon: LineChart,
    title: "Virtual Trading Playground",
    description:
      "Practice with ₹10 lakh virtual money. Buy, sell, track portfolio — zero risk, zero real money.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bot,
    title: "AI Mentor in Hinglish",
    description:
      "Ask anything — 'P/E ratio kya hai?' Get simple answers instantly. No jargon, no confusion.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description:
      "Earn coins, build streaks, unlock badges. Learning stock market feels like playing a game.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: IndianRupee,
    title: "Real Indian Stocks",
    description:
      "Practice with actual NSE/BSE stocks — RELIANCE, TCS, INFY, and 50+ more popular ones.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BookOpen,
    title: "Bite-sized Lessons",
    description:
      "5-minute lessons designed for busy students. Learn concepts, test with quizzes, move ahead.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: Wallet,
    title: "Expense & Tax Basics",
    description:
      "Coming soon: track expenses, understand taxes, learn ITR basics. Complete finance toolkit.",
    color: "from-rose-500 to-red-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need to become a{" "}
              <span className="text-gradient">confident investor</span>
            </>
          }
          subtitle="From your first trade to advanced concepts — we've built the complete learning toolkit for Indian stock market beginners."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="relative text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="relative text-sm text-dark-100 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}