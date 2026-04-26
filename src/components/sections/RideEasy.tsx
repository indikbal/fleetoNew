"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { colors, fonts } from "@/config/theme";
import { stripHtml } from "@/lib/api";
import type { ExploreRideEasyItem } from "@/lib/api";

interface Props {
  title: string;
  mainImage: string;
  features: ExploreRideEasyItem[];
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

export default function RideEasy({ title, mainImage, features }: Props) {
  return (
    <section className="bg-white pt-8 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Title + main image overlap ── */}
        <div className="relative">

          {/* Sunrise watermark */}
          <motion.div
            className="absolute top-0 inset-x-0 pointer-events-none select-none flex justify-center"
            style={{ zIndex: 0 }}
            initial={{ y: "8vw", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <svg
              viewBox="0 0 1000 160"
              width="100%"
              aria-hidden="true"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="rideEasyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <text
                x="500"
                y="148"
                textAnchor="middle"
                fill="none"
                stroke="url(#rideEasyGrad)"
                strokeWidth="1"
                fontSize="120"
                style={{ fontFamily: fonts.display }}
              >
                {title}
              </text>
            </svg>
          </motion.div>

          {/* Main banner image */}
          <motion.div
            {...fadeUp(0.1)}
            className="relative z-10"
            style={{ paddingTop: "14%" }}
          >
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/7" }}>
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={`${title} — Fleeto Electric Scooter`}
                  fill
                  className="object-cover object-center"
                />
              )}
            </div>
          </motion.div>

        </div>

        {/* ── 3 feature cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp(0.1 + i * 0.08)}>
              <div className="relative w-full overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: "4/3" }}>
                {f.image && (
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    className="object-cover object-center"
                  />
                )}
              </div>
              <h3
                className="font-bold mb-1.5"
                style={{ fontFamily: fonts.body, fontSize: "16px", color: colors.black }}
              >
                {f.title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: fonts.body }}
              >
                {stripHtml(f.details)}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
