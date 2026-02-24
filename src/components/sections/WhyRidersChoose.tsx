"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { colors, styles } from "@/config/theme";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const leftFeatures = [
  {
    title: (
      <>
        ZERO <span style={{ color: colors.primary }}>EMISSIONS</span>
        <br />ZERO NOISE
      </>
    ),
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    title: (
      <>
        ULTRA <span style={{ color: colors.primary }}>FAST</span> CHARGING
        <br />CONVENIENCE
      </>
    ),
    desc: "Lorem Ipsum is simply dummy text of the printing and",
  },
];

const rightFeatures = [
  {
    title: (
      <>
        SMART TECHNOLOGY &
        <br /><span style={{ color: colors.primary }}>AI DASHBOARD</span>
      </>
    ),
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    title: (
      <>
        THE MOST <span style={{ color: colors.primary }}>ECONOMICAL</span>
        <br />WAY TO RIDE
      </>
    ),
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];

// Desktop ring dots — NW / NE / SE / SW at 45° on 300px circle
const ringDots: React.CSSProperties[] = [
  { top: "40px",  left: "40px"  },
  { top: "40px",  left: "250px" },
  { top: "250px", left: "250px" },
  { top: "250px", left: "40px"  },
];

// ─── Circle image (reused on both layouts) ────────────────────────────────────
function CircleImage({ size, ringSize }: { size: number; ringSize: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed"
        style={{ borderColor: `${colors.primary}55` }}
      />
      {/* Image */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image src="/images/why-img.png" alt="Fleeto scooter lineup" fill className="object-cover" />
      </div>
    </div>
  );
}

export default function WhyRidersChoose() {
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
            Why Riders Choose{" "}
            <span style={{ color: colors.primary }}>FLEETO</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.1)}
            className="text-center text-gray-500 text-sm max-w-lg mx-auto mb-12 md:mb-16 leading-relaxed"
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s,
          </motion.p>

          {/* ── Mobile / Tablet layout (< lg) ── */}
          <div className="lg:hidden flex flex-col items-center gap-10">

            {/* Circle — smaller on mobile */}
            <motion.div {...fadeUp(0.1)}>
              <CircleImage size={200} ringSize={230} />
            </motion.div>

            {/* Features — 2×2 grid */}
            <div className="grid grid-cols-2 gap-6 w-full">
              {[...leftFeatures, ...rightFeatures].map((f, i) => (
                <motion.div key={i} {...fadeUp(0.1 + i * 0.08)}>
                  <h3
                    className="leading-snug text-[#010101] mb-2"
                    style={{ ...styles.headingFont, fontSize: "clamp(14px, 3vw, 20px)" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
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
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
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
                <Image src="/images/why-img.png" alt="Fleeto scooter lineup" fill className="object-cover" />
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
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
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
              <p className="text-white/50 text-xs mb-1 tracking-wide">Call us or Book Your Ride Instantly</p>
              <p className="text-white font-bold text-2xl tracking-wide" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                +91 97658 6545
              </p>
            </div>
            <a href="#contact" className="glass-btn inline-flex items-center gap-2 px-5 py-3 text-white text-sm font-semibold rounded-full">
              Book Your Test Ride <ArrowUpRight size={15} />
            </a>
          </div>

          {/* sm+: horizontal */}
          <div className="relative hidden sm:flex items-center px-8 md:px-12 py-8 gap-4">
            <div className="flex-1">
              <p className="text-white/50 text-sm mb-1.5 tracking-wide">Call us or Book Your Ride Instantly</p>
              <p className="text-white font-bold text-xl md:text-3xl tracking-wide" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                +91 97658 6545
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
              <a href="#contact" className="glass-btn inline-flex items-center gap-2 px-5 py-3 text-white text-sm font-semibold rounded-full flex-shrink-0">
                Book Your Test Ride <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
