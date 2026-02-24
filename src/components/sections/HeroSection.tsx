"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { heroSlides, styles } from "@/config/theme";

// ─── Social icon SVGs ────────────────────────────────────────────────────────
const FacebookSVG = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramSVG = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2.5" />
  </svg>
);

const YoutubeSVG = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.5C5.12 20 12 20 12 20s6.88 0 8.59-.5a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const PinterestSVG = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const socialLinks = [
  { Icon: FacebookSVG, label: "Facebook", href: "#" },
  { Icon: InstagramSVG, label: "Instagram", href: "#" },
  { Icon: YoutubeSVG, label: "YouTube", href: "#" },
  { Icon: PinterestSVG, label: "Pinterest", href: "#" },
];

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

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const goTo = (index: number) => setCurrent(index);
  const slide = heroSlides[current];

  return (
    <motion.section
      id="home"
      className="relative min-h-screen flex overflow-hidden"
      animate={{ backgroundColor: slide.bgColor }}
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
            <HeroBgSVG color={slide.svgColor} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Social icons — hidden on mobile, visible md+ ── */}
      <div className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-20">
        {socialLinks.map(({ Icon, label, href }) => {
          const isHovered = hoveredSocial === label;
          return (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2"
              onMouseEnter={() => setHoveredSocial(label)}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <motion.div
                animate={{
                  backgroundColor: isHovered ? slide.accentColor : "rgba(255,255,255,0.45)",
                  color: isHovered ? "#fff" : "#444",
                }}
                transition={{ duration: 0.2 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <Icon />
              </motion.div>
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -8, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -8, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium text-gray-800 overflow-hidden whitespace-nowrap"
                  >
                    {label}
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
                  src="/images/hero-scooty.png"
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
                {slide.watermark.map((word, i) => (
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
                    background: `linear-gradient(to right, ${slide.accentColor}55, transparent)`,
                  }}
                >
                  {slide.tag}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Headline lines */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`headline-${current}`}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {slide.lines.map((line, i) => (
                  <motion.h1
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 + i * 0.12 }}
                    className="tracking-tight"
                    style={{
                      fontSize: "clamp(2rem, 5vw, 5.5rem)",
                      lineHeight: 1.2,
                      ...styles.headingFont,
                    }}
                  >
                    <span style={{ color: "#010101" }}>{line.black}</span>
                    {line.red && (
                      <span style={{ color: slide.accentColor }}>{line.red}</span>
                    )}
                  </motion.h1>
                ))}
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
                  animate={{ backgroundColor: slide.accentColor }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{
                    backgroundColor: slide.accentColor,
                    ...styles.redButtonShadow,
                  }}
                >
                  {slide.cta}
                  <ArrowUpRight size={18} />
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Pagination dots ── */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 flex items-center gap-2 z-20">
        {heroSlides.map((s, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-2 rounded-full"
            animate={{
              width: i === current ? "2rem" : "1rem",
              backgroundColor: i === current ? s.accentColor : "rgba(0,0,0,0.2)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.section>
  );
}
