import { motion } from "framer-motion";
import Container from "../ui/Container";

const stats = [
  { value: "10,000+", label: "Active Learners" },
  { value: "50+", label: "Bite-sized Lessons" },
  { value: "₹0", label: "Real Money Lost" },
  { value: "4.8★", label: "User Rating" },
];

export default function Stats() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-primary-600/10 to-transparent p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-gradient mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-dark-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}