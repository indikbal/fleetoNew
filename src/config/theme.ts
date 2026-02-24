// ─────────────────────────────────────────────────────────────────────────────
// Central design-token config
// Change any value here and it propagates everywhere automatically.
// ─────────────────────────────────────────────────────────────────────────────

// ── Fonts ────────────────────────────────────────────────────────────────────
export const fonts = {
  display: "var(--font-anton), sans-serif",   // Anton — all headings / titles
  body:    "var(--font-inter), sans-serif",    // Inter — body text
} as const;

// ── Brand colors ─────────────────────────────────────────────────────────────
export const colors = {
  // Core brand
  primary:      "#AB2323",   // fleeto red
  primaryDark:  "#8A1C1C",   // hover / pressed state
  primaryLight: "#E05555",   // soft red used for highlights

  // Neutrals
  black:        "#010101",
  white:        "#FFFFFF",

  // About section
  aboutBg:      "radial-gradient(ellipse at -37% 50%, #AB2323, #2D0000)",
  aboutAccent:  "#E05555",   // heading highlights + border bar
} as const;

// ── Hero slider — one entry per slide ────────────────────────────────────────
// svgColor  : fill of the diagonal SVG shape
// bgColor   : section background
// accentColor: headline highlight word + CTA button + dots + social hover
export const heroSlides = [
  {
    tag:         "Feel the thrill of silent power",
    lines: [
      { black: "GO GREEN.",   red: "" },
      { black: "GO ",         red: "ELECTRIC." },
      { black: "GO FLEETO.",  red: "" },
    ],
    watermark:    ["FLEETO", "UDAAN"],
    cta:          "Explore Models",
    svgColor:     "#EB4A4A",
    bgColor:      "#FFE4E4",
    accentColor:  "#EB4A4A",
  },
  {
    tag:         "The future of urban mobility",
    lines: [
      { black: "RIDE CLEAN.",  red: "" },
      { black: "RIDE ",        red: "SMART." },
      { black: "RIDE FLEETO.", red: "" },
    ],
    watermark:    ["FLEETO", "SPRINT"],
    cta:          "Explore Models",
    svgColor:     "#4A7FEB",
    bgColor:      "#E4ECFF",
    accentColor:  "#4A7FEB",
  },
  {
    tag:         "Zero emissions, maximum thrills",
    lines: [
      { black: "THINK GREEN.", red: "" },
      { black: "ACT ",         red: "ELECTRIC." },
      { black: "BE FLEETO.",   red: "" },
    ],
    watermark:    ["FLEETO", "POWER"],
    cta:          "Explore Models",
    svgColor:     "#4AAB5E",
    bgColor:      "#E4F5EA",
    accentColor:  "#4AAB5E",
  },
] as const;

// ── Reusable style objects ────────────────────────────────────────────────────
export const styles = {
  // Glass button — Apple-style. Just add className="glass-btn" to the element.
  // Defined in globals.css: blur(24px) saturate(1.8), hairline border, inset top highlight.
  glassButtonClass: "glass-btn",

  // Inner shadow applied to all solid red CTA buttons
  redButtonShadow: {
    boxShadow: "inset 0px 4px 4px rgba(0,0,0,0.25)",
  },

  // Anton heading base style (spread into style prop)
  headingFont: {
    fontFamily: "var(--font-anton), sans-serif",
  },
} as const;
