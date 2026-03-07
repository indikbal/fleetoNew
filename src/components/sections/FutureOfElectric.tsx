"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { colors, styles } from "@/config/theme";
import { stripHtml } from "@/lib/api";
import type { FutureButton } from "@/lib/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

interface Props {
  title1: string;
  title2: string;
  title3: string;
  description: string;
  image: string;
  buttons: FutureButton[];
}

export default function FutureOfElectric({ title1, title2, title3, description, image, buttons }: Props) {
  return (
    <section
      id="about"
      className="relative overflow-hidden min-h-[480px]"
      style={{ background: colors.aboutBg }}
    >
      {/* ── Image — absolutely flush to the right edge, no container constraint ── */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.1 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%] hidden lg:block pointer-events-none"
      >
        <Image
          src={image}
          alt="Fleeto Electric Scooters"
          width={800}
          height={500}
          style={{ width: "100%", height: "auto" }}
          priority
        />
      </motion.div>

      {/* ── Left: text content — inside container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:w-1/2 py-16 lg:py-20 pr-0 lg:pr-10">

          {/* Heading */}
          <motion.h2
            {...fadeUp(0)}
            className="text-3xl sm:text-4xl md:text-5xl leading-tight text-white"
            style={styles.headingFont}
          >
            {title1}
            <span style={{ color: colors.aboutAccent }}>{title2}</span>
            <br />
            <span style={{ color: colors.aboutAccent }}>{title3}</span>
          </motion.h2>

          {/* Description with left accent border */}
          <motion.div {...fadeUp(0.15)} className="mt-6 flex gap-3">
            <div
              className="w-[3px] rounded-full flex-shrink-0 self-stretch"
              style={{ backgroundColor: colors.aboutAccent }}
            />
            <p className="text-white/75 text-sm leading-relaxed">
              {stripHtml(description)}
            </p>
          </motion.div>

          {/* 2×2 glass buttons */}
          <motion.div {...fadeUp(0.28)} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buttons.map((btn) => (
              <a
                key={btn.title}
                href={btn.url || "#"}
                className="glass-btn group flex items-center justify-between gap-2 px-4 sm:px-5 py-3 sm:py-3.5 text-white text-sm font-semibold"
              >
                <span>{btn.title}</span>
                <ArrowUpRight size={16} className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
