"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { colors, styles } from "@/config/theme";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

export default function RideSmarter() {
  return (
    <section className="relative overflow-hidden min-h-[420px] md:min-h-[500px] flex items-center">

      {/* Background image */}
      <Image
        src="/images/cta-scooty-bg.jpg"
        alt="Fleeto Electric Scooters on the road"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay — solid red left → transparent right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #8A1414 0%, #AB2323cc 30%, #AB232355 55%, transparent 75%)",
        }}
      />

      {/* Content — left column */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="max-w-[480px]">

          {/* Heading */}
          <motion.h2
            {...fadeUp(0)}
            className="text-4xl md:text-5xl leading-tight text-white mb-5"
            style={styles.headingFont}
          >
            Ride Smarter with{" "}
            <span style={{ color: colors.primaryLight }}>Fleeto</span>
            <br />
            Electric Scooters
          </motion.h2>

          {/* Description */}
          <motion.p
            {...fadeUp(0.15)}
            className="text-white/80 text-sm leading-relaxed mb-8 max-w-[360px]"
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy text
            ever since the 1500s,
          </motion.p>

          {/* Glass CTA button */}
          <motion.div {...fadeUp(0.28)}>
            <a
              href="#contact"
              className="glass-btn inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full"
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
