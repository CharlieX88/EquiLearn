import { ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import Stats from "../components/sections/Stats";
import FAQ from "../components/sections/FAQ";
import CTA from "../components/sections/CTA";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Landing() {
  return (
    <div className="min-h-screen bg-dark-900 overflow-x-hidden">
      <Navbar />

      {/* ---------- HERO SECTION ---------- */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.03]" />

        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-sm text-primary-300">
                  <Sparkles className="w-4 h-4" />
                  AI-powered learning for Indian investors
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              >
                Seekho Stock Market.
                <br />
                <span className="text-gradient">Bina Ek Rupaya Khoye.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-dark-100 leading-relaxed mb-8 max-w-xl"
              >
                Practice trading with virtual coins, learn from AI-powered
                lessons in Hinglish, and build confidence before investing real
                money.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-4"
              >
                <Link to={ROUTES.SIGNUP}>
                  <Button variant="gradient" size="lg">
                    Start Learning Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary" size="lg">
                    I have an account
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex items-center gap-6 mt-10 text-sm text-dark-100"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  No real money
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary-400" />
                  AI Mentor
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6 shadow-2xl shadow-primary-600/10 animate-float">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-dark-100 mb-1">
                      Portfolio Value
                    </p>
                    <p className="text-2xl font-bold font-mono">₹10,45,230</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    +4.52%
                  </span>
                </div>

                <div className="flex items-end gap-2 h-32 mb-6">
                  {[40, 55, 35, 70, 60, 85, 75, 90, 65, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary-600/40 to-primary-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    { name: "RELIANCE", price: "₹2,456", change: "+2.1%", up: true },
                    { name: "TCS", price: "₹3,890", change: "-1.2%", up: false },
                    { name: "INFY", price: "₹1,567", change: "+0.8%", up: true },
                  ].map((stock) => (
                    <div
                      key={stock.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-300">
                          {stock.name[0]}
                        </div>
                        <span className="text-sm font-medium">
                          {stock.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">{stock.price}</p>
                        <p
                          className={`text-xs ${
                            stock.up ? "text-success" : "text-danger"
                          }`}
                        >
                          {stock.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-coin to-yellow-600 flex items-center justify-center font-bold text-yellow-950 shadow-lg shadow-coin/30 animate-float">
                ₹100
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ---------- OTHER SECTIONS ---------- */}
      <Features />
      <HowItWorks />
      <Stats />
      <FAQ />
      <CTA />

      <Footer />
    </div>
  );
}

export default Landing;