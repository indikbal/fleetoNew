"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { colors, fonts, styles } from "@/config/theme";

export default function AlwaysInSync() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Starts very small, expands to 100% of max-w-7xl container
  const videoWidth  = useTransform(scrollYProgress, [0, 0.5], ["30%", "100%"]);
  const videoRadius = useTransform(scrollYProgress, [0, 0.5], [16, 12]);

  return (
    <section ref={sectionRef} className="bg-white pt-16 pb-0 overflow-hidden">

      {/* ── Heading ── */}
      <div className="max-w-2xl mx-auto px-4 text-center mb-10">
        <h2
          className="text-4xl md:text-5xl mb-5"
          style={{ ...styles.headingFont, color: colors.black }}
        >
          Always in sync
        </h2>
        <p
          className="text-gray-500 text-base leading-relaxed"
          style={{ fontFamily: fonts.body }}
        >
          Stay connected to your Fleeto with the Fleeto app. Track your rides, view
          detailed stats, locate your scooter, or lock it remotely using your phone.
          Smart ownership that stays with you.
        </p>
      </div>

      {/* ── Scroll-expanding video — constrained to max-w-7xl ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <motion.div
          style={{
            width: videoWidth,
            borderRadius: videoRadius,
            overflow: "hidden",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full block"
            style={{ aspectRatio: "16/9", objectFit: "cover" }}
          >
            <source
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>
      </div>

    </section>
  );
}
