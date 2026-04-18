"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import { colors, styles } from "@/config/theme";
import type { FooterMenuColumn, CommonData } from "@/lib/api";

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

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

// ─── Footer Client ────────────────────────────────────────────────────────────
interface FooterClientProps {
  columns: FooterMenuColumn[];
  common: CommonData;
}

export default function FooterClient({ columns, common }: FooterClientProps) {
  const testRideExternal = isExternalUrl(common.footerTestRideUrl);

  return (
    <footer id="contact" style={{ backgroundColor: "#010101" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top: tagline + CTA ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-10">
          {common.footerContent ? (
            <div
              className="text-gray-400 text-sm leading-relaxed max-w-xl [&_p]:m-0"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
              dangerouslySetInnerHTML={{ __html: common.footerContent }}
            />
          ) : (
            <p
              className="text-gray-400 text-sm leading-relaxed max-w-xl"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              FLEETO, a brand owned by Fleetworth Automotives Pvt Ltd, was established in 2019 with an
              aim to bring to you the most economical and best-designed electric two wheelers.
            </p>
          )}
          {testRideExternal ? (
            <a
              href={common.footerTestRideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold flex-shrink-0"
            >
              Book Your Test Ride
              <ArrowUpRight size={15} />
            </a>
          ) : (
            <Link
              href={common.footerTestRideUrl}
              className="glass-btn inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold flex-shrink-0"
            >
              Book Your Test Ride
              <ArrowUpRight size={15} />
            </Link>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {(() => {
          const productsCol = columns.find((c) => /product/i.test(c.title));
          const otherCols = columns.filter((c) => c !== productsCol);

          return (
            <>
              {/* ── Products row: horizontal chip list ── */}
              {productsCol && (
                <div className="py-10">
                  <h4
                    className="mb-5"
                    style={{ ...styles.headingFont, fontSize: "25px", color: "rgba(255,255,255,0.4)" }}
                  >
                    {productsCol.title}
                  </h4>
                  <ul className="flex flex-wrap gap-2.5">
                    {productsCol.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className="inline-block px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors duration-200"
                          style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)" }}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Divider between products row and nav columns */}
              {productsCol && <div className="h-px bg-white/10" />}

              {/* ── Middle: nav columns + contact ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 py-12">

                {otherCols.map((col) => {
                  const isWide = col.items.length > 6;
                  return (
                    <div key={col.title} className={isWide ? "sm:col-span-2 lg:col-span-2" : ""}>
                      <h4
                        className="mb-5"
                        style={{ ...styles.headingFont, fontSize: "25px", color: "rgba(255,255,255,0.4)" }}
                      >
                        {col.title}
                      </h4>
                      <ul
                        className={
                          isWide
                            ? "space-y-3 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3 sm:space-y-0"
                            : "space-y-3"
                        }
                      >
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
                  );
                })}

                {/* Contact column */}
                <div>
                  <h4
                    className="mb-5"
                    style={{ ...styles.headingFont, fontSize: "25px", color: "rgba(255,255,255,0.4)" }}
                  >
                    {common.columnTitles.contact}
                  </h4>
                  <div
                    className="space-y-3 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.9)" }}
                  >
                    {common.address && (
                      <div className="flex items-start gap-2.5">
                        <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                        <span>{common.address}</span>
                      </div>
                    )}
                    {common.email && (
                      <div className="flex items-center gap-2.5">
                        <Mail size={14} className="flex-shrink-0" style={{ color: colors.primary }} />
                        <a
                          href={`mailto:${common.email}`}
                          className="hover:text-white transition-colors duration-200 break-all"
                        >
                          {common.email}
                        </a>
                      </div>
                    )}
                    {common.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone size={14} className="flex-shrink-0" style={{ color: colors.primary }} />
                        <a
                          href={`tel:${common.phone.replace(/\s+/g, "")}`}
                          className="hover:text-white transition-colors duration-200"
                        >
                          {common.phone}
                        </a>
                      </div>
                    )}
                    {common.workingHours && (
                      <div className="flex items-start gap-2.5">
                        <Clock size={14} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                        <div
                          className="[&_p]:m-0"
                          dangerouslySetInnerHTML={{ __html: common.workingHours }}
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          );
        })()}

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
            {common.footerTitle1}{" "}
            <span
              style={{
                background:
                  "linear-gradient(160deg, #E05555 0%, #AB2323 40%, rgba(171,35,35,0.25) 65%, #E05555 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {common.footerTitle2}
            </span>
          </h2>

          {/* Social icons */}
          {common.socialMedia.length > 0 && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {common.socialMedia.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-80"
                  style={glassIconStyle}
                  dangerouslySetInnerHTML={{ __html: social.svg }}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </footer>
  );
}
