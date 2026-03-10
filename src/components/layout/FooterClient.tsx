"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import { colors, styles } from "@/config/theme";
import type { FooterMenuColumn } from "@/lib/api";

// ─── Social SVG icons ────────────────────────────────────────────────────────
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}
function PinterestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

const socialLinks = [
  { icon: <FacebookIcon />,  href: "#" },
  { icon: <YoutubeIcon />,   href: "#" },
  { icon: <PinterestIcon />, href: "#" },
  { icon: <InstagramIcon />, href: "#" },
];

// ─── Red glass icon button style ─────────────────────────────────────────────
const glassIconStyle: React.CSSProperties = {
  background: "linear-gradient(160deg, #3D0A0A 0%, #1A0000 100%)",
  backdropFilter: "blur(12px) saturate(1.6)",
  WebkitBackdropFilter: "blur(12px) saturate(1.6)",
  borderTop: "1px solid rgba(171,35,35,0.45)",
  borderLeft: "1px solid rgba(171,35,35,0.25)",
  borderRight: "1px solid rgba(171,35,35,0.25)",
  borderBottom: "1px solid rgba(0,0,0,0.6)",
  boxShadow:
    "inset 0 1px 0 rgba(171,35,35,0.3), inset 0 -2px 6px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.5)",
  borderRadius: "14px",
};

// ─── Footer Client ────────────────────────────────────────────────────────────
interface FooterClientProps {
  columns: FooterMenuColumn[];
}

export default function FooterClient({ columns }: FooterClientProps) {
  return (
    <footer id="contact" style={{ backgroundColor: "#010101" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top: tagline + CTA ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-10">
          <p
            className="text-gray-400 text-sm leading-relaxed max-w-xl"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            FLEETO, a brand owned by Fleetworth Automotives Pvt Ltd, was established in 2019 with an
            aim to bring to you the most economical and best-designed electric two wheelers.
          </p>
          <Link
            href="/book-test-ride"
            className="glass-btn inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold flex-shrink-0"
          >
            Book Your Test Ride
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* ── Middle: nav columns + contact ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 py-12">

          {columns.map((col) => (
            <div key={col.title}>
              <h4
                className="mb-5"
                style={{ ...styles.headingFont, fontSize: "25px", color: "rgba(255,255,255,0.4)" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="inline-block hover:text-white hover:translate-x-1.5 transition-all duration-200"
                      style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.9)" }}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h4
              className="mb-5"
              style={{ ...styles.headingFont, fontSize: "25px", color: "rgba(255,255,255,0.4)" }}
            >
              Contact
            </h4>
            <div
              className="space-y-3 leading-relaxed"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.9)" }}
            >
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                <span>
                  Plot No 2, 3rd Floor, Block FA,
                  Ward no 107, Rajdanga Main Road
                  PS Kasba, Kol - 700107
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="flex-shrink-0" style={{ color: colors.primary }} />
                <a href="mailto:reach_fleeto@fleetoev.in" className="hover:text-white transition-colors duration-200">
                  reach_fleeto@fleetoev.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="flex-shrink-0" style={{ color: colors.primary }} />
                <a href="tel:08064521248" className="hover:text-white transition-colors duration-200">
                  08064521248
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* ── Bottom: watermark text + social icons ── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between py-8 gap-4">

          {/* "Ride with FLEETO" — liquid glass text */}
          <h2
            className="text-3xl md:text-4xl leading-none select-none pointer-events-none"
            style={{
              ...styles.headingFont,
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0.1) 65%, rgba(255,255,255,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 1px 6px rgba(255,255,255,0.08))",
            }}
          >
            Ride with{" "}
            <span
              style={{
                background:
                  "linear-gradient(160deg, #E05555 0%, #AB2323 40%, rgba(171,35,35,0.25) 65%, #E05555 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FLEETO
            </span>
          </h2>

          {/* Social icons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {socialLinks.map(({ icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-10 h-10 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-80"
                style={glassIconStyle}
              >
                {icon}
              </a>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}
