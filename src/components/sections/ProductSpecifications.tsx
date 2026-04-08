"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { colors, fonts } from "@/config/theme";
import { stripHtml } from "@/lib/api";

/* ── Types ────────────────────────────────────────────────────────────────── */
export interface PerformanceItem {
  image: string;
  title: string;
  details: string;
  main_section_image: string;
  main_section_title: string;
  main_section_details: string;
}

export interface DesignItem {
  image: string;
  title: string;
  details: string;
}

export interface TechnologyItem {
  image: string;
  title: string;
  details: string;
}

export interface ProductSpecificationsData {
  performance_section_title: string;
  performance_section_details: string;
  performance_section: PerformanceItem[];
  design_section_title: string;
  design_section_description: string;
  design_section: DesignItem[];
  technology_section_title: string;
  technology_section_description: string;
  technology_section: TechnologyItem[];
}

interface Props {
  data: ProductSpecificationsData;
}

/* ── Animation helpers ────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const tabs = ["Performance", "Design", "Technology"] as const;
type TabKey = (typeof tabs)[number];

/* ══════════════════════════════════════════════════════════════════════════ */
export default function ProductSpecifications({ data }: Props) {
  const [active, setActive] = useState<TabKey>("Performance");

  const tabTitles: Record<TabKey, string> = {
    Performance: data.performance_section_title || "Performance",
    Design: data.design_section_title || "Design",
    Technology: data.technology_section_title || "Technology",
  };

  return (
    <section style={{ backgroundColor: "#FFF5F5" }} className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Watermark title ── */}
        <motion.div
          className="mb-16 md:mb-20"
          {...fadeUp()}
        >
          <div className="pointer-events-none select-none flex justify-center">
            <svg
              viewBox="0 0 1000 120"
              width="100%"
              aria-hidden="true"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="specGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="100%" stopColor="#FFF5F5" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <text
                x="500"
                y="108"
                textAnchor="middle"
                fill="none"
                stroke="url(#specGrad)"
                strokeWidth="1"
                fontSize="120"
                style={{ fontFamily: fonts.display }}
              >
                Specifications
              </text>
            </svg>
          </div>
        </motion.div>

        {/* ── Tab bar ── */}
        <motion.div
          {...fadeUp(0.1)}
          className="flex justify-center gap-2 md:gap-3 mb-12 md:mb-16"
        >
          {tabs.map((tab) => {
            const isActive = active === tab;
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className="relative px-5 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-colors duration-300"
                style={{
                  fontFamily: fonts.body,
                  color: isActive ? "#fff" : colors.black,
                  background: isActive ? colors.primary : "rgba(0,0,0,0.05)",
                  border: isActive
                    ? "none"
                    : "1px solid rgba(0,0,0,0.1)",
                  boxShadow: isActive
                    ? "inset 0px 4px 4px rgba(0,0,0,0.25)"
                    : "none",
                }}
              >
                {tabTitles[tab]}
              </button>
            );
          })}
        </motion.div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          {active === "Performance" && (
            <PerformanceTab
              key="performance"
              items={data.performance_section}
              description={data.performance_section_details}
            />
          )}
          {active === "Design" && (
            <DesignTab
              key="design"
              items={data.design_section}
              description={data.design_section_description}
            />
          )}
          {active === "Technology" && (
            <TechnologyTab
              key="technology"
              items={data.technology_section}
              description={data.technology_section_description}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Performance Tab                                                         */
/* ══════════════════════════════════════════════════════════════════════════ */
function PerformanceTab({
  items,
  description,
}: {
  items: PerformanceItem[];
  description: string;
}) {
  const [selected, setSelected] = useState(0);
  const current = items[selected];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      {/* Subtitle */}
      {description && (
        <p
          className="text-center text-gray-500 text-sm md:text-base mb-10"
          style={{ fontFamily: fonts.body }}
        >
          {stripHtml(description)}
        </p>
      )}

      {/* Main highlight area */}
      {current && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
          {/* Left — main image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected + "-img"}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="relative w-full rounded-2xl overflow-hidden shadow-lg"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={current.main_section_image}
                alt={current.main_section_title}
                fill
                className="object-cover object-center"
              />
              {/* Bottom overlay with title + details */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3
                  className="text-white text-2xl md:text-3xl uppercase"
                  style={{ fontFamily: fonts.display }}
                >
                  {current.main_section_title}
                </h3>
                <p
                  className="text-white/70 text-sm mt-1"
                  style={{ fontFamily: fonts.body }}
                >
                  {stripHtml(current.main_section_details)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right — stacked feature cards */}
          <div className="flex flex-col gap-4">
            {items.map((item, i) => {
              const isSel = i === selected;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="flex items-center gap-4 rounded-xl p-3 md:p-4 text-left transition-all duration-300"
                  style={{
                    background: isSel
                      ? "rgba(171,35,35,0.08)"
                      : "#FFFFFF",
                    border: isSel
                      ? `1px solid ${colors.primary}`
                      : "1px solid rgba(0,0,0,0.06)",
                    boxShadow: isSel
                      ? "none"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="relative shrink-0 rounded-lg overflow-hidden"
                    style={{ width: 80, height: 64 }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="text-sm md:text-base font-semibold truncate"
                      style={{ fontFamily: fonts.body, color: colors.black }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-gray-500 text-xs md:text-sm mt-0.5 line-clamp-2"
                      style={{ fontFamily: fonts.body }}
                    >
                      {stripHtml(item.details)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Design Tab                                                              */
/* ══════════════════════════════════════════════════════════════════════════ */
function DesignTab({
  items,
  description,
}: {
  items: DesignItem[];
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      {description && (
        <p
          className="text-center text-gray-500 text-sm md:text-base mb-10"
          style={{ fontFamily: fonts.body }}
        >
          {stripHtml(description)}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-2xl overflow-hidden bg-white shadow-sm"
            style={{
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4 md:p-5">
              <h3
                className="text-base md:text-lg font-semibold mb-1"
                style={{ fontFamily: fonts.body, color: colors.black }}
              >
                {item.title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: fonts.body }}
              >
                {stripHtml(item.details)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Technology Tab                                                          */
/* ══════════════════════════════════════════════════════════════════════════ */
function TechnologyTab({
  items,
  description,
}: {
  items: TechnologyItem[];
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      {description && (
        <p
          className="text-center text-gray-500 text-sm md:text-base mb-10"
          style={{ fontFamily: fonts.body }}
        >
          {stripHtml(description)}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group flex flex-col sm:flex-row items-start gap-5 rounded-2xl p-5 md:p-6 bg-white shadow-sm transition-colors duration-300"
            style={{
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="relative shrink-0 w-full sm:w-32 md:w-40 rounded-xl overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-base md:text-lg font-semibold mb-1.5"
                style={{ fontFamily: fonts.body, color: colors.black }}
              >
                {item.title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: fonts.body }}
              >
                {stripHtml(item.details)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
