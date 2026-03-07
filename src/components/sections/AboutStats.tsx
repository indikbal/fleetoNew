"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { colors, fonts, styles } from "@/config/theme";
import { parseStatNumber } from "@/lib/api";
import type { AboutStat } from "@/lib/api";

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const steps = 60;
    const duration = 1800;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  const display =
    count >= 1000
      ? `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K`
      : count.toString();

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

interface Props {
  sectionLabel: string;
  sectionTitle: string;
  stats: AboutStat[];
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function AboutStats({ sectionLabel, sectionTitle, stats }: Props) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">

      {/* Background image */}
      <Image
        src="/images/cta-scooty-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,0,0,0.97) 0%, rgba(50,4,4,0.90) 50%, rgba(10,0,0,0.95) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <motion.p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: colors.primaryLight, fontFamily: fonts.body }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {sectionLabel}
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl text-white"
            style={styles.headingFont}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {sectionTitle}
          </motion.h2>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ image_svg, number, title }, i) => {
            const { value, suffix } = parseStatNumber(number);
            return (
              <motion.div
                key={title}
                className="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${colors.primary}30` }}
                  dangerouslySetInnerHTML={{ __html: image_svg }}
                />

                <p
                  className="text-white text-4xl md:text-5xl mb-2"
                  style={styles.headingFont}
                >
                  <Counter target={value} suffix={suffix} />
                </p>

                <p
                  className="text-white/50 text-sm"
                  style={{ fontFamily: fonts.body }}
                >
                  {title}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
