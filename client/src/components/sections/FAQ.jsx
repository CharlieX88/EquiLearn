import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { cn } from "../../utils/cn";

const faqs = [
  {
    question: "Is this real trading?",
    answer:
      "No. This is a 100% virtual trading platform. You practice with virtual coins — no real money is ever involved. Once you're confident, you can use what you've learned to invest in real markets through SEBI-registered brokers.",
  },
  {
    question: "Do I need money to start?",
    answer:
      "Absolutely not. Sign up is free forever. You get ₹10,00,000 virtual cash and 100 coins as a welcome bonus. Nothing to pay, nothing to risk.",
  },
  {
    question: "Will the AI give me stock tips?",
    answer:
      "Never. Our AI Mentor is strictly for education — it explains concepts, answers questions, and analyses your virtual trades. It will never recommend buy/sell actions on any stock. We take this very seriously to stay compliant with SEBI regulations.",
  },
  {
    question: "Can I withdraw virtual coins as real money?",
    answer:
      "No. Virtual coins are only used within the platform to unlock lessons, badges, and advanced simulations. They have no real-world monetary value.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. We use industry-standard encryption for passwords, JWT-based authentication, and follow DPDP Act guidelines. We never sell your data to third parties.",
  },
  {
    question: "Is this app SEBI registered?",
    answer:
      "This is an educational platform, not a broker. We don't provide investment advice, tips, or brokerage services. For real investing, always go through SEBI-registered intermediaries.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions? <span className="text-gradient">We've got answers.</span>
            </>
          }
          subtitle="Everything you need to know before getting started."
        />

        <div className="max-w-3xl mx-auto mt-16 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn(
                  "rounded-xl border transition-all duration-300",
                  isOpen
                    ? "border-primary-500/30 bg-primary-500/[0.03]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-medium text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-dark-100 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180 text-primary-400"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-dark-100 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}