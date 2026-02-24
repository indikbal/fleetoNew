"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { colors, fonts } from "@/config/theme";

// ─── Finance logos marquee ────────────────────────────────────────────────────
const baseLogos = [
  "/images/f1.jpg",
  "/images/f2.jpg",
  "/images/f3.jpg",
  "/images/f4.jpg",
  "/images/f5.jpg",
  "/images/f6.jpg",
];
const logos = [...baseLogos, ...baseLogos];

const LOGO_W      = 130;
const LOGO_GAP    = 24;
const TRACK_WIDTH = logos.length * (LOGO_W + LOGO_GAP);
const HALF        = TRACK_WIDTH / 2;

// ─── Feature list ─────────────────────────────────────────────────────────────
const features = [
  "Zero down payment",
  "Interest rates as low as 3.99%",
  "Simplified approval process",
  "Tenure as long as 5 years",
];

// ─── Section ──────────────────────────────────────────────────────────────────
export default function FinanceYourWay() {
  return (
    <section
      className="relative overflow-hidden pb-16 md:pb-20"
      style={{ backgroundColor: "#FFF5F5" }}
    >
      {/* ── "Finance Your Way" — sunrise animation ── */}
      <motion.div
        className="absolute top-0 inset-x-0 pointer-events-none select-none"
        style={{ zIndex: 0 }}
        initial={{ y: "8vw", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 1200 160"
          width="100%"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="financeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor="#FFF5F5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <text
            x="600"
            y="145"
            textAnchor="middle"
            fill="none"
            stroke="url(#financeGrad)"
            strokeWidth="1"
            fontSize="120"
            style={{ fontFamily: fonts.display }}
          >
            Finance Your Way
          </text>
        </svg>
      </motion.div>

      {/* ── White card — pushed down so title peeks above ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "11%" }}
      >
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">

          {/* ── Top row: left content + right EMI card ── */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch mb-8">

            {/* Left */}
            <div className="flex-1">
              {/* Brand */}
              <div className="mb-4">
                <Image
                  src="/images/flexipay.png"
                  alt="FlexiPay"
                  width={140}
                  height={40}
                  className="object-contain"
                />
              </div>

              <h3
                className="text-lg font-semibold text-gray-800 mb-6"
                style={{ fontFamily: fonts.body }}
              >
                Take your Rizta home with easy loans
              </h3>

              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="text-gray-500 text-sm flex items-center gap-2"
                    style={{ fontFamily: fonts.body }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors.primary }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: EMI card */}
            <div
              className="rounded-2xl p-7 flex flex-col justify-between w-full lg:w-96 flex-shrink-0"
              style={{ backgroundColor: colors.primary }}
            >
              <div>
                <p
                  className="text-white/75 text-sm mb-2"
                  style={{ fontFamily: fonts.body }}
                >
                  EMIs as low as
                </p>
                <p
                  className="text-white font-bold mb-6 leading-tight"
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "clamp(26px, 3vw, 36px)",
                  }}
                >
                  ₹ 2235 / month
                </p>
              </div>
              <a
                href="#contact"
                className="glass-btn self-start inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold"
              >
                Learn More
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-8" />

          {/* ── Finance partner logos — continuous marquee ── */}
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center"
              style={{ width: `${TRACK_WIDTH}px` }}
              animate={{ x: [0, -HALF] }}
              transition={{
                x: {
                  duration: 18,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                },
              }}
            >
              {logos.map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: `${LOGO_W}px`,
                    height: "56px",
                    marginRight: `${LOGO_GAP}px`,
                  }}
                >
                  <Image
                    src={src}
                    alt={`Finance partner ${(i % baseLogos.length) + 1}`}
                    width={LOGO_W}
                    height={56}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
