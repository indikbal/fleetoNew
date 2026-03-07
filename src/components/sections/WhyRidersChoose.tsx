"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { colors, styles } from "@/config/theme";
import { stripHtml } from "@/lib/api";
import type { WhyFeature } from "@/lib/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

// Desktop ring dots — NW / NE / SE / SW at 45° on 300px circle
const ringDots: React.CSSProperties[] = [
  { top: "40px",  left: "40px"  },
  { top: "40px",  left: "250px" },
  { top: "250px", left: "250px" },
  { top: "250px", left: "40px"  },
];

function FeatureTitle({ feature }: { feature: WhyFeature }) {
  return (
    <>
      {feature.title_1}{" "}
      <span style={{ color: colors.primary }}>{feature.title_2}</span>
      {feature.title_3 && (
        <>
          <br />
          {feature.title_3}
        </>
      )}
    </>
  );
}

function CircleImage({ size, ringSize, image }: { size: number; ringSize: number; image: string }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed"
        style={{ borderColor: `${colors.primary}55` }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image src={image} alt="Fleeto scooter lineup" fill className="object-cover" />
      </div>
    </div>
  );
}

interface Props {
  title1: string;
  title2: string;
  description: string;
  image: string;
  features: WhyFeature[];
  ctaTitle: string;
  ctaNumber: string;
  ctaButtonUrl: string;
}

export default function WhyRidersChoose({
  title1,
  title2,
  description,
  image,
  features,
  ctaTitle,
  ctaNumber,
  ctaButtonUrl,
}: Props) {
  // split features: odd indices (0,2) → left, even (1,3) → right
  const leftFeatures = features.filter((_, i) => i % 2 === 0);
  const rightFeatures = features.filter((_, i) => i % 2 === 1);

  return (
    <>
      <section className="pt-16 md:pt-20 lg:pt-28 pb-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <motion.h2
            {...fadeUp(0)}
            className="text-center text-3xl sm:text-4xl md:text-5xl text-[#010101] mb-4"
            style={styles.headingFont}
          >
            {title1}{" "}
            <span style={{ color: colors.primary }}>{title2}</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.1)}
            className="text-center text-gray-500 text-sm max-w-lg mx-auto mb-12 md:mb-16 leading-relaxed"
          >
            {stripHtml(description)}
          </motion.p>

          {/* ── Mobile / Tablet layout (< lg) ── */}
          <div className="lg:hidden flex flex-col items-center gap-10">
            <motion.div {...fadeUp(0.1)}>
              <CircleImage size={200} ringSize={230} image={image} />
            </motion.div>
            <div className="grid grid-cols-2 gap-6 w-full">
              {features.map((f, i) => (
                <motion.div key={i} {...fadeUp(0.1 + i * 0.08)}>
                  <h3
                    className="leading-snug text-[#010101] mb-2"
                    style={{ ...styles.headingFont, fontSize: "clamp(14px, 3vw, 20px)" }}
                  >
                    <FeatureTitle feature={f} />
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{stripHtml(f.details)}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Desktop layout (lg+) ── */}
          <div className="hidden lg:flex items-center gap-10">

            {/* Left features */}
            <div className="flex-1 flex flex-col gap-14">
              {leftFeatures.map((f, i) => (
                <motion.div key={i} {...fadeUp(0.15 + i * 0.1)} className="text-right">
                  <h3
                    className="leading-snug text-[#010101] mb-2"
                    style={{ ...styles.headingFont, fontSize: "25px" }}
                  >
                    <FeatureTitle feature={f} />
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{stripHtml(f.details)}</p>
                </motion.div>
              ))}
            </div>

            {/* Center circle — 300px on desktop */}
            <motion.div
              {...fadeUp(0.1)}
              className="flex-shrink-0 relative"
              style={{ width: "300px", height: "300px" }}
            >
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed"
                style={{ borderColor: `${colors.primary}55` }}
              />
              {ringDots.map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-full z-10"
                  style={{ backgroundColor: colors.primary, ...pos }}
                />
              ))}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
                style={{ width: "262px", height: "262px" }}
              >
                <Image src={image} alt="Fleeto scooter lineup" fill className="object-cover" />
              </div>
            </motion.div>

            {/* Right features */}
            <div className="flex-1 flex flex-col gap-14">
              {rightFeatures.map((f, i) => (
                <motion.div key={i} {...fadeUp(0.2 + i * 0.1)} className="text-left">
                  <h3
                    className="leading-snug text-[#010101] mb-2"
                    style={{ ...styles.headingFont, fontSize: "25px" }}
                  >
                    <FeatureTitle feature={f} />
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{stripHtml(f.details)}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <div className="pb-16 md:pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp(0.15)}
          className="max-w-3xl mx-auto relative overflow-hidden rounded-2xl"
          style={{ background: "linear-gradient(60deg, #2D0000 0%, #7A1010 100%)" }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{ width: "280px", height: "80px", background: `${colors.primary}50`, filter: "blur(40px)" }}
          />

          {/* Mobile: stacked */}
          <div className="relative sm:hidden flex flex-col items-center gap-4 px-6 py-8 text-center">
            <div>
              <p className="text-white/50 text-xs mb-1 tracking-wide">{ctaTitle}</p>
              <p className="text-white font-bold text-2xl tracking-wide" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                {ctaNumber}
              </p>
            </div>
            <a href={ctaButtonUrl || "#contact"} className="glass-btn inline-flex items-center gap-2 px-5 py-3 text-white text-sm font-semibold rounded-full">
              Book Your Test Ride <ArrowUpRight size={15} />
            </a>
          </div>

          {/* sm+: horizontal */}
          <div className="relative hidden sm:flex items-center px-8 md:px-12 py-8 gap-4">
            <div className="flex-1">
              <p className="text-white/50 text-sm mb-1.5 tracking-wide">{ctaTitle}</p>
              <p className="text-white font-bold text-xl md:text-3xl tracking-wide" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                {ctaNumber}
              </p>
            </div>
            <div className="flex flex-col items-center self-stretch justify-center flex-shrink-0">
              <div className="flex-1 w-px bg-white/15" />
              <div className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center my-2 flex-shrink-0">
                <span className="text-white/60 text-[10px] font-semibold">OR</span>
              </div>
              <div className="flex-1 w-px bg-white/15" />
            </div>
            <div className="flex-1 flex justify-end">
              <a href={ctaButtonUrl || "#contact"} className="glass-btn inline-flex items-center gap-2 px-5 py-3 text-white text-sm font-semibold rounded-full flex-shrink-0">
                Book Your Test Ride <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
