"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { colors, styles } from "@/config/theme";

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Can I use an electric scooter if I live in an apartment?",
    a: "Yes. You just need a 5 amp socket at your parking slot. You can conveniently charge your Fleeto EV with the portable charger at all apartments with a basic electricity connection in the parking area.",
  },
  {
    q: "Do I need a Drivers' License, Helmet and Registration to use an electric scooter?",
    a: "For electric scooters exceeding 25 km/h or 250W motor output, a valid driving license, registration, and helmet are mandatory as per government regulations.",
  },
  {
    q: "Why do Electric Scooters have riding modes?",
    a: "Riding modes let you balance speed and battery range. Eco mode extends range, while Sport mode unlocks full performance — giving you control depending on your journey.",
  },
  {
    q: "What is the cost of charging an electric scooter?",
    a: "Charging a Fleeto scooter costs roughly ₹8–₹15 for a full charge depending on your electricity tariff, compared to ₹100–₹200 for a petrol equivalent.",
  },
  {
    q: "Do I ever need to replace an electric scooter's battery?",
    a: "Fleeto lithium-ion batteries are designed to last 1,000+ charge cycles. Under normal use, replacement is rarely needed within 5–7 years of ownership.",
  },
  {
    q: "Can electric scooters be used in the rain?",
    a: "Yes. Fleeto scooters carry an IP67 rating, making them safe to ride in rain. Avoid riding through deep waterlogged areas as with any vehicle.",
  },
  {
    q: "What is the price of electric scooter?",
    a: "Fleeto scooters start from ₹57,106 onwards. Prices vary by model and configuration. Check our Collection section for full pricing details.",
  },
  {
    q: "Which electric scooter is best in India with price?",
    a: "Fleeto's Aayan-SMART offers the best value — 150 km range, smart features, and starting price of ₹57,106, making it one of the most competitive EVs in its segment.",
  },
];

// ─── Glass accordion card style ───────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(16px) saturate(1.4)",
  WebkitBackdropFilter: "blur(16px) saturate(1.4)",
  border: "1px solid rgba(255, 255, 255, 0.85)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 10px rgba(0,0,0,0.06)",
  borderRadius: "12px",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, ease: "easeOut" as const, delay },
});

// ─── Section ──────────────────────────────────────────────────────────────────
export default function EverythingYouNeed() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: "#E9E9E9" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.h2
          {...fadeUp(0)}
          className="text-center text-4xl md:text-5xl leading-tight text-[#010101] mb-14"
          style={styles.headingFont}
        >
          Everything You Need To Know
          <br />
          About{" "}
          <span style={{ color: colors.primary }}>FLEETO</span>
        </motion.h2>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div key={i} {...fadeUp(0.05 + i * 0.04)} style={cardStyle}>

                {/* Question row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span
                    className="text-sm md:text-base text-[#1a1a1a] leading-snug"
                    style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 500 }}
                  >
                    {faq.q}
                  </span>

                  <span
                    className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-200"
                    style={{
                      color: isOpen ? colors.primary : "#555",
                    }}
                  >
                    {isOpen
                      ? <Minus size={17} strokeWidth={2.5} />
                      : <Plus  size={17} strokeWidth={2.5} />
                    }
                  </span>
                </button>

                {/* Answer — animated expand */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-6 pb-5 text-sm text-gray-500 leading-relaxed"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
