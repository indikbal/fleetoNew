"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { styles } from "@/config/theme";
import type { BannerSlide, SocialMedia } from "@/lib/api";

// ─── Per-slide visual styles (colors + watermark — not from API) ──────────────
const SLIDE_STYLES = [
  { svgColor: "#EB4A4A", bgColor: "#FFE4E4", accentColor: "#EB4A4A", watermark: ["FLEETO", "UDAAN"] },
  { svgColor: "#4A7FEB", bgColor: "#E4ECFF", accentColor: "#4A7FEB", watermark: ["FLEETO", "SPRINT"] },
  { svgColor: "#4AAB5E", bgColor: "#E4F5EA", accentColor: "#4AAB5E", watermark: ["FLEETO", "POWER"] },
];

// ─── Replace the word FLEETO with the brand logo image ──────────────────────
// The logo (public/images/FLEETO.jpg) already includes the ® mark, so we strip
// any trailing ® from the CMS text before swapping in the image. The CMS may
// also insert the FLEETO logo as an inline <img> tag OR as a bare image URL —
// collapse either form to a single token so our swap below picks it up. This
// must happen BEFORE the case-insensitive FLEETO match, otherwise "fleeto"
// inside the URL host or filename produces phantom logos.
const renderWithRegMark = (text: string) => {
  if (!text) return null;
  let cleaned = text.replace(/<img\b[^>]*>/gi, "FLEETO");
  cleaned = cleaned.replace(/<[^>]+>/g, "");
  cleaned = cleaned.replace(/https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg)\b\S*/gi, "FLEETO");
  cleaned = cleaned.replace(/FLEETO\s*®/gi, "FLEETO");
  const parts = cleaned.split(/(FLEETO)/gi);
  return parts.map((part, i) =>
    /^FLEETO$/i.test(part) ? (
      <img
        key={i}
        src="/images/FLEETO.jpg"
        alt="FLEETO"
        style={{
          display: "inline-block",
          height: "0.85em",
          width: "auto",
          verticalAlign: "baseline",
          marginRight: "0.05em",
          borderRadius: "0.08em",
        }}
      />
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

// ─── Inline SVG bg with dynamic fill ─────────────────────────────────────────
const HeroBgSVG = ({ color }: { color: string }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 1728 885"
    fill="none"
    preserveAspectRatio="xMinYMin slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M406.456 320.297L-6 -1L297.289 494.468L782.767 530.5L1111.78 885H1728L829.806 320.297L406.456 320.297Z"
      fill={color}
      fillOpacity="0.35"
    />
  </svg>
);

interface Props {
  slides: BannerSlide[];
  socialLinks: SocialMedia[];
}

export default function HeroSection({ slides, socialLinks }: Props) {
  const [current, setCurrent] = useState(0);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const goTo = (index: number) => setCurrent(index);
  const slide = slides[current];
  const style = SLIDE_STYLES[current % SLIDE_STYLES.length];

  return (
    <motion.section
      id="home"
      className="relative min-h-screen flex overflow-hidden"
      animate={{ backgroundColor: style.bgColor }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* ── SVG background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${current}`}
            className="absolute inset-0"
            initial={{ clipPath: "circle(0% at 0% 0%)" }}
            animate={{ clipPath: "circle(150% at 0% 0%)" }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroBgSVG color={style.svgColor} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Social icons — hidden on mobile, visible md+ ── */}
      <div className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-20">
        {socialLinks.map(({ svg_image, name, url }) => {
          const isHovered = hoveredSocial === name;
          return (
            <a
              key={name}
              href={url}
              className="flex items-center gap-2"
              onMouseEnter={() => setHoveredSocial(name)}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <motion.div
                animate={{
                  backgroundColor: isHovered ? style.accentColor : "rgba(255,255,255,0.45)",
                  color: isHovered ? "#fff" : "#444",
                }}
                transition={{ duration: 0.2 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                dangerouslySetInnerHTML={{ __html: svg_image }}
              />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -8, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -8, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium text-gray-800 overflow-hidden whitespace-nowrap"
                  >
                    {name.replace("Icon", "")}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 flex-1 flex items-center w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          {/* Left — Scooter Image */}
          <div className="relative flex items-end lg:items-center justify-center pt-24 lg:pt-0 pl-8 sm:pl-12 md:pl-16 lg:pl-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`scooter-${current}`}
                initial={{ x: -50, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 50, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: "easeOut" as const }}
                className="relative w-full max-w-sm sm:max-w-lg lg:max-w-3xl"
                style={{ aspectRatio: "4 / 3" }}
              >
                <Image
                  src={slide.image}
                  alt="Fleeto Electric Scooter"
                  fill
                  className="object-contain object-bottom drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — Text content */}
          <div className="relative flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-14 pb-20 lg:pb-0 overflow-hidden">

            {/* Watermark — hidden on mobile/tablet, visible lg+ */}
            <div className="hidden lg:flex absolute right-0 top-0 items-start gap-3 pointer-events-none select-none pr-2 pt-20">
              <AnimatePresence mode="wait">
                {style.watermark.map((word, i) => (
                  <motion.div
                    key={`${word}-${current}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      transform: "rotate(180deg)",
                      color: "rgba(0,0,0,0.07)",
                      lineHeight: 1,
                      letterSpacing: "0.05em",
                      fontSize: i === 0 ? "50px" : "80px",
                      ...styles.headingFont,
                    }}
                  >
                    {word}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Tag pill */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`tag-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="mb-4 md:mb-5"
              >
                <span
                  className="inline-block px-4 md:px-5 py-2 text-sm text-gray-700 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${style.accentColor}55, transparent)`,
                  }}
                >
                  {slide.title}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Headline */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`headline-${current}`}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="tracking-tight"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 5.5rem)",
                    lineHeight: 1.2,
                    ...styles.headingFont,
                  }}
                >
                  <span style={{ color: "#1A3A8F" }}>{renderWithRegMark(slide.sub_title_1)}</span>
                  <span style={{ color: style.accentColor }}>{renderWithRegMark(slide.sub_title_2)}</span>
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.22 }}
                  className="tracking-tight"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 5.5rem)",
                    lineHeight: 1.2,
                    ...styles.headingFont,
                  }}
                >
                  <span style={{ color: "#1A3A8F" }}>{renderWithRegMark(slide.sub_title_3)}</span>
                  <span style={{ color: style.accentColor }}>{renderWithRegMark(slide.sub_title_4)}</span>
                </motion.h1>
              </motion.div>
            </AnimatePresence>

            {/* CTA button */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mt-6 md:mt-8"
              >
                <motion.a
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 text-white font-semibold rounded-full text-sm md:text-base"
                  animate={{ backgroundColor: style.accentColor }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{
                    backgroundColor: style.accentColor,
                    boxShadow: "inset 0px 4px 4px rgba(0,0,0,0.25)",
                  }}
                >
                  Explore Models
                  <ArrowUpRight size={18} />
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Pagination dots ── */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 flex items-center gap-2 z-20">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-2 rounded-full"
            animate={{
              width: i === current ? "2rem" : "1rem",
              backgroundColor: i === current
                ? SLIDE_STYLES[i % SLIDE_STYLES.length].accentColor
                : "rgba(0,0,0,0.2)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.section>
  );
}
