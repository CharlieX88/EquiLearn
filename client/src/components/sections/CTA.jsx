import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { ROUTES } from "../../constants";

export default function CTA() {
  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-primary-500/20 bg-gradient-to-br from-primary-600/20 via-primary-700/10 to-transparent p-10 sm:p-16 text-center"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              100% Free Forever
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 max-w-2xl mx-auto">
              Ready to start your{" "}
              <span className="text-gradient">investing journey?</span>
            </h2>

            <p className="text-base sm:text-lg text-dark-100 max-w-xl mx-auto mb-8">
              No real money. No risk. Just learning — with AI, games, and
              practice.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={ROUTES.SIGNUP}>
                <Button variant="gradient" size="lg">
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary" size="lg">
                  Already have an account?
                </Button>
              </Link>
            </div>

            <p className="text-xs text-dark-100 mt-6">
              🎁 Get ₹10,00,000 virtual cash + 100 coins on signup
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}