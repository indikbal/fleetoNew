"use client";

import { motion } from "framer-motion";
import { colors, fonts } from "@/config/theme";

interface Props {
  /** Text shown as the large SVG watermark */
  svgText: string;
}

export default function PageHeroBanner({ svgText }: Props) {
  const gradId = `pageHeroGrad_${svgText.replace(/\s+/g, "")}`;

  return (
    <section
      className="relative overflow-hidden pt-20 md:pt-24 pb-12 md:pb-16"
      style={{ backgroundColor: "#FFF5F5" }}
    >
      <motion.div
        className="relative pointer-events-none select-none"
        style={{ zIndex: 0 }}
        initial={{ y: "8vw", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 1200 160"
          width="100%"
          aria-hidden="true"
          style={{ overflow: "visible", display: "block" }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor="#FFF5F5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <text
            x="600" y="145"
            textAnchor="middle"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="1"
            fontSize="120"
            style={{ fontFamily: fonts.display }}
          >
            {svgText}
          </text>
        </svg>
      </motion.div>
    </section>
  );
}
