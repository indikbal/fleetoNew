"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { colors, fonts } from "@/config/theme";

const stats = [
  { value: "3-4 Hours", label: "Charging Time" },
  { value: "100 Kms",   label: "Upto Range" },
  { value: "60 Volts",  label: "Battery Capacity" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

export default function ProductBanner() {
  return (
    <section className="relative w-full h-[70vh] md:h-screen min-h-[400px] md:min-h-[560px] max-h-[900px] flex flex-col">

      {/* Background image */}
      <Image
        src="/images/product_banner.jpg"
        alt="Fleeto Electric Scooter"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay: bottom red → top transparent */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(240,76,76,0.36) 0%, transparent 60%)",
        }}
      />

      {/* Bottom content — centered */}
      <div className="relative mt-auto w-full">
        <div className="flex flex-col items-center pb-10 md:pb-16 px-4">

          {/* Stats */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex items-end justify-center gap-10 sm:gap-16 md:gap-24 mb-8 md:mb-10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span
                  className="text-white leading-none"
                  style={{
                    fontFamily: fonts.body,
                    fontWeight: 500,
                    fontSize: "clamp(26px, 4.5vw, 40px)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-white/60 mt-1.5"
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "clamp(11px, 1.4vw, 16px)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons — equal width */}
          <motion.div {...fadeUp(0.22)} className="flex items-center gap-3 sm:gap-4">
            {/* Glass pill */}
            <a
              href="#pricing"
              className="glass-btn inline-flex items-center justify-center px-6 py-3 text-white text-sm font-semibold w-44 sm:w-52"
            >
              Pricing
            </a>

            {/* Solid red pill */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full transition-colors btn-red-inner-shadow w-44 sm:w-52"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              Book Your Test Ride
              <ArrowUpRight size={15} />
            </a>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
