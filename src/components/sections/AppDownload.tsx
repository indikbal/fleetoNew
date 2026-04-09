"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { colors, styles } from "@/config/theme";
import { Smartphone } from "lucide-react";

const APP_URL =
  "https://play.google.com/store/apps/details?id=co.fleeto.consumerapp";

const screenshots = [
  { src: "/images/app1.webp", alt: "Fleeto App - Dashboard" },
  { src: "/images/app2.webp", alt: "Fleeto App - Ride Statistics" },
  { src: "/images/app3.webp", alt: "Fleeto App - More Features" },
];

export default function AppDownload() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        className="absolute inset-0"
        style={{ background: colors.aboutBg }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/[0.03]" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/[0.03]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top — Text content */}
        <div className="text-center mb-14">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6"
          >
            <Smartphone className="w-4 h-4 text-white/80" />
            <span className="text-white/80 text-sm font-medium">
              Available on Google Play
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] mb-4"
            style={styles.headingFont}
          >
            YOUR SCOOTER,{" "}
            <span style={{ color: colors.primaryLight }}>IN YOUR POCKET</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-white/60 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Download the Fleeto Smart Vehicle App to track your ride, manage
            battery health, and stay connected with your scooter — all from your
            phone.
          </motion.p>

          {/* Google Play Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-white text-black px-7 py-4 rounded-xl hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3.61 1.814a1.63 1.63 0 00-.545 1.264v17.844c0 .482.207.914.545 1.264l.068.063L14.2 11.727v-.132L3.677 1.75l-.068.064z"
                  fill="#4285F4"
                />
                <path
                  d="M17.727 15.254l-3.528-3.527v-.132l3.528-3.528.08.046 4.18 2.374c1.193.678 1.193 1.786 0 2.465l-4.18 2.374-.08.046v-.118z"
                  fill="#FBBC04"
                />
                <path
                  d="M17.807 15.136L14.2 11.528 3.61 22.186c.393.415 1.043.466 1.79.052l12.407-7.102z"
                  fill="#EA4335"
                />
                <path
                  d="M17.807 7.92L5.4 .818C4.653.404 4.003.455 3.61.87L14.2 11.528l3.607-3.607z"
                  fill="#34A853"
                />
              </svg>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider opacity-60 leading-none">
                  Get it on
                </div>
                <div className="text-lg font-semibold leading-tight">
                  Google Play
                </div>
              </div>
            </a>
          </motion.div>
        </div>

        {/* Bottom — App Screenshots */}
        <div className="flex justify-center items-end gap-4 sm:gap-6 md:gap-8">
          {screenshots.map((shot, i) => {
            const isCenter = i === 1;
            return (
              <motion.div
                key={shot.src}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.1 }}
                className={`relative ${
                  isCenter
                    ? "w-[200px] sm:w-[240px] md:w-[260px] z-10"
                    : "w-[160px] sm:w-[200px] md:w-[220px] opacity-80 hidden sm:block"
                }`}
              >
                {/* Glow behind center phone */}
                {isCenter && (
                  <div
                    className="absolute -inset-6 blur-[60px] opacity-25 rounded-full"
                    style={{ background: colors.primary }}
                  />
                )}

                {/* Phone frame */}
                <div
                  className={`relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border ${
                    isCenter
                      ? "border-white/20 shadow-2xl"
                      : "border-white/10 shadow-xl"
                  }`}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={260}
                    height={563}
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
