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
