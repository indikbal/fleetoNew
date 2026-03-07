"use client";

import { motion } from "framer-motion";
import { colors, fonts, styles } from "@/config/theme";
import type { AboutFeatureItem } from "@/lib/api";

interface Props {
  sectionLabel: string;
  sectionTitle: string;
  features: AboutFeatureItem[];
}

export default function AboutFeatures({ sectionLabel, sectionTitle, features }: Props) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <motion.p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: colors.primary, fontFamily: fonts.body }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {sectionLabel}
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl"
            style={{ ...styles.headingFont, color: colors.black }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {sectionTitle}
          </motion.h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ image_svg, title, details }, i) => (
            <motion.div
              key={title}
              className="group p-7 rounded-2xl border transition-all duration-300 cursor-default"
              style={{
                backgroundColor: "#FAFAFA",
                borderColor: "rgba(0,0,0,0.06)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -6,
                boxShadow: "0 12px 40px rgba(171,35,35,0.10)",
                borderColor: `${colors.primary}40`,
              }}
            >
              {/* Icon circle */}
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: colors.primary }}
                dangerouslySetInnerHTML={{ __html: image_svg }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.25 }}
              />

              <h3
                className="font-bold mb-3 text-base leading-snug"
                style={{ fontFamily: fonts.body, color: colors.black }}
              >
                {title}
              </h3>

              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: fonts.body }}
              >
                {details.trim()}
              </p>

              {/* Bottom accent bar — appears on hover */}
              <motion.div
                className="h-0.5 rounded-full mt-6"
                style={{ backgroundColor: colors.primary }}
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
