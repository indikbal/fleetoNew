"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { colors, styles } from "@/config/theme";

// ─── Bento cards data ─────────────────────────────────────────────────────────
const cards = [
  {
    id: "battery",
    title: "Battery Safety and Management",
    image: "/images/cta-scooty-bg.jpg",
    wide: true,
  },
  {
    id: "smart",
    title: "Smart Features Integration",
    image: "/images/hero-scooty.png",
    wide: false,
  },
  {
    id: "aftersales",
    title: "Best After-Sales Support",
    image: "/images/cta-scooty-bg.jpg",
    wide: false,
  },
  {
    id: "manufacturing",
    title: "Sustainable Manufacturing",
    image: "/images/abt-scootys.png",
    wide: false,
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

// ─── Single card ──────────────────────────────────────────────────────────────
function BentoCard({
  card,
  delay = 0,
}: {
  card: (typeof cards)[0];
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ scale: 1.02, transition: { duration: 0.35, ease: "easeOut" as const } }}
      className="relative rounded-2xl overflow-hidden w-full h-full min-h-[200px] group cursor-pointer"
    >
      {/* Background image — zooms on hover */}
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Overlay — darkens slightly on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/30 transition-opacity duration-500 group-hover:opacity-80" />

      {/* Title — slides up on hover */}
      <div className="absolute bottom-4 left-4 right-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <h3
          className="text-white text-base md:text-lg leading-snug"
          style={{ fontFamily: styles.headingFont.fontFamily }}
        >
          {card.title}
        </h3>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function EffortlessRiding() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.h2
          {...fadeUp(0)}
          className="text-center text-4xl md:text-5xl leading-tight mb-12"
          style={styles.headingFont}
        >
          Effortless{" "}
          <span style={{ color: colors.primary }}>Riding</span>.
          <br />
          <span style={{ color: colors.primary }}>Worry-free</span>{" "}
          Ownership.
        </motion.h2>

        {/* Bento grid */}
        <div className="flex flex-col gap-4">

          {/* Row 1 — stacks on mobile, wide+narrow on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <div className="h-[220px] sm:h-[260px] md:h-[320px]">
              <BentoCard card={cards[0]} delay={0.1} />
            </div>
            <div className="h-[220px] sm:h-[260px] md:h-[320px]">
              <BentoCard card={cards[1]} delay={0.2} />
            </div>
          </div>

          {/* Row 2 — two equal (stays 2-col, just shorter on mobile) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[180px] sm:h-[220px] md:h-[300px]">
              <BentoCard card={cards[2]} delay={0.3} />
            </div>
            <div className="h-[180px] sm:h-[220px] md:h-[300px]">
              <BentoCard card={cards[3]} delay={0.4} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
