"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { colors, styles } from "@/config/theme";
import type { FAQ } from "@/lib/api";

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

const DEFAULT_FAQS: FAQ[] = [
  { title: "Can I use an electric scooter if I live in an apartment?", details: "Yes. You just need a 5 amp socket at your parking slot. You can conveniently charge your Fleeto EV with the portable charger at all apartments with a basic electricity connection in the parking area." },
  { title: "Do I need a Drivers' License, Helmet and Registration to use an electric scooter?", details: "For electric scooters exceeding 25 km/h or 250W motor output, a valid driving license, registration, and helmet are mandatory as per government regulations." },
  { title: "Why do Electric Scooters have riding modes?", details: "Riding modes let you balance speed and battery range. Eco mode extends range, while Sport mode unlocks full performance — giving you control depending on your journey." },
  { title: "What is the cost of charging an electric scooter?", details: "Charging a Fleeto scooter costs roughly ₹8–₹15 for a full charge depending on your electricity tariff, compared to ₹100–₹200 for a petrol equivalent." },
  { title: "Do I ever need to replace an electric scooter's battery?", details: "Fleeto lithium-ion batteries are designed to last 1,000+ charge cycles. Under normal use, replacement is rarely needed within 5–7 years of ownership." },
  { title: "Can electric scooters be used in the rain?", details: "Yes. Fleeto scooters carry an IP67 rating, making them safe to ride in rain. Avoid riding through deep waterlogged areas as with any vehicle." },
  { title: "What is the price of electric scooter?", details: "Fleeto scooters start from ₹57,106 onwards. Prices vary by model and configuration. Check our Collection section for full pricing details." },
  { title: "Which electric scooter is best in India with price? 1", details: "Fleeto's Aayan-SMART offers the best value — 150 km range, smart features, and starting price of ₹57,106, making it one of the most competitive EVs in its segment." },
];

interface Props {
  title1?: string;
  title2?: string;
  faqs?: FAQ[];
}

export default function EverythingYouNeed({
  title1 = "Everything You Need To Know",
  title2 = "FLEETO",
  faqs = DEFAULT_FAQS,
}: Props) {
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
          {title1}
          <br />
          About{" "}
          <span style={{ color: colors.primary }}>{title2}</span>
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
                    {faq.title}
                  </span>

                  <span
                    className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-200"
                    style={{ color: isOpen ? colors.primary : "#555" }}
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
                        {faq.details}
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
