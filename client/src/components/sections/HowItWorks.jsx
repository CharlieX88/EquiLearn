import { motion } from "framer-motion";
import { UserPlus, BookOpenCheck, Rocket } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign up in 30 seconds",
    description:
      "No credit card, no KYC, no hidden charges. Just email and password. Free forever.",
  },
  {
    icon: BookOpenCheck,
    step: "02",
    title: "Learn & practice",
    description:
      "Complete bite-sized lessons, ask the AI Mentor doubts, then apply your knowledge in the virtual trading playground.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Invest with confidence",
    description:
      "When you feel ready — after mastering risk management and strategies — take the leap into real markets.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 relative bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"
    >
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From zero to <span className="text-gradient">investor</span> in 3
              simple steps
            </>
          }
          subtitle="We've removed every barrier between you and financial literacy."
        />

        <div className="relative mt-16">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative text-center"
                >
                  {/* Icon circle */}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl shadow-primary-600/30 mb-6">
                    <Icon className="w-7 h-7 text-white" />
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-dark-900 border border-primary-500/30 text-xs font-mono font-bold text-primary-300">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-dark-100 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}