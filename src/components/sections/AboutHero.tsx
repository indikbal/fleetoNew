"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ThumbsUp, Package } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

const pills = [
  {
    icon: ThumbsUp,
    label: "Satisfied Customer",
    desc: "Our satisfied customers love the smooth ride, great mileage, and stylish design.",
  },
  {
    icon: Package,
    label: "Standard Product",
    desc: "Our standard product ensures reliable performance, quality materials, and durability every time.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

export default function AboutHero() {
  return (
    <section
      className="relative overflow-hidden pt-20 md:pt-24 pb-16 md:pb-24"
      style={{ backgroundColor: "#FFF5F5" }}
    >
      {/* ── SVG sunrise title ── */}
      <motion.div
        className="absolute inset-x-0 pointer-events-none select-none"
        style={{ zIndex: 0, top: "5rem" }}
        initial={{ y: "8vw", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 1200 160"
          width="100%"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="aboutHeroGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor="#FFF5F5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <text
            x="600" y="145"
            textAnchor="middle"
            fill="none"
            stroke="url(#aboutHeroGrad)"
            strokeWidth="1"
            fontSize="120"
            style={{ fontFamily: fonts.display }}
          >
            About Us
          </text>
        </svg>
      </motion.div>

      {/* ── White card ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "12%" }}
      >
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: content ── */}
            <div>
              <motion.p
                {...fadeUp(0.1)}
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: colors.primary, fontFamily: fonts.body }}
              >
                About Us
              </motion.p>

              <motion.h2
                {...fadeUp(0.2)}
                className="text-4xl md:text-5xl leading-tight mb-5"
                style={{ ...styles.headingFont, color: colors.black }}
              >
                Premium Quality<br />Delivered
              </motion.h2>

              <motion.p
                {...fadeUp(0.3)}
                className="text-gray-500 text-sm leading-relaxed mb-8"
                style={{ fontFamily: fonts.body }}
              >
                At Fleeto, we are committed to redefining urban mobility with
                eco-friendly, stylish, and affordable electric scooters that deliver
                performance, convenience, and sustainability for the modern Indian
                commuter.
              </motion.p>

              {/* Feature pills */}
              <div className="flex flex-col gap-4 mb-8">
                {pills.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    {...fadeUp(0.35 + i * 0.1)}
                    className="flex gap-4 items-start p-4 rounded-2xl"
                    style={{ backgroundColor: "#FFF5F5" }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Icon size={17} color="white" />
                    </div>
                    <div>
                      <p
                        className="font-semibold text-sm mb-1"
                        style={{ fontFamily: fonts.body, color: colors.black }}
                      >
                        {label}
                      </p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: fonts.body }}>
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.a
                {...fadeUp(0.55)}
                href="/book-test-ride"
                className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full btn-red-inner-shadow transition-colors"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                Book Test Ride
                <ArrowUpRight size={15} />
              </motion.a>
            </div>

            {/* ── Right: image ── */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Experience badge */}
              <motion.div
                className="absolute top-4 left-4 z-10 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                8+ Years Experience
              </motion.div>

              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src="/images/abt-scootys.png"
                  alt="Fleeto electric scooters"
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Floating stat badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 px-5 py-4 rounded-2xl text-center"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: "0 8px 30px rgba(171,35,35,0.35)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <p
                  className="text-white text-2xl font-bold leading-none"
                  style={{ fontFamily: fonts.display }}
                >
                  10K+
                </p>
                <p
                  className="text-white/75 text-xs mt-1"
                  style={{ fontFamily: fonts.body }}
                >
                  Happy Customers
                </p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
