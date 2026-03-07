"use client";

import { useState } from "react";
import { colors, fonts, styles } from "@/config/theme";
import type { QuickConnectItem } from "@/lib/api";

interface Props {
  sectionLabel: string;
  sectionTitle: string;
  sectionHours: string;
  items: QuickConnectItem[];
}

export default function QuickConnect({ sectionLabel, sectionTitle, sectionHours, items }: Props) {
  const [buyPhone, setBuyPhone] = useState("");

  // Last item is the "Buy E-Scooter" card with phone input; rest are regular call cards
  const regularItems = items.slice(0, -1);
  const buyItem = items[items.length - 1];

  return (
    <section style={{ backgroundColor: "#060000" }} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: colors.primaryLight, fontFamily: fonts.body }}
          >
            {sectionLabel}
          </p>
          <h2
            className="text-4xl md:text-5xl text-white mb-3"
            style={styles.headingFont}
          >
            {sectionTitle}
          </h2>
          <p
            className="text-white/40 text-sm"
            style={{ fontFamily: fonts.body }}
          >
            {sectionHours}
          </p>
        </div>

        {/* ── Enquiry cards ── */}
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">

          {regularItems.map(({ svg_image, title, number }) => (
            <div
              key={title}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 rounded-2xl transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}28` }}
                  dangerouslySetInnerHTML={{ __html: svg_image }}
                />
                <p
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: fonts.body }}
                >
                  {title}
                </p>
              </div>

              <a
                href={`tel:${number}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-full btn-red-inner-shadow transition-colors sm:flex-shrink-0"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                Call Now
              </a>
            </div>
          ))}

          {/* ── Buy E-Scooter card ── */}
          {buyItem && (
            <div
              className="px-6 py-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}28` }}
                  dangerouslySetInnerHTML={{ __html: buyItem.svg_image }}
                />
                <div>
                  <p
                    className="text-white font-semibold text-sm"
                    style={{ fontFamily: fonts.body }}
                  >
                    {buyItem.title}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: colors.primaryLight, fontFamily: fonts.body }}
                  >
                    Our experts will assist you!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  placeholder="Enter Phone No."
                  value={buyPhone}
                  onChange={(e) => setBuyPhone(e.target.value)}
                  className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 outline-none transition-colors"
                  style={{
                    fontFamily: fonts.body,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.primary}80`)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}
                />
                <a
                  href={buyPhone ? `tel:${buyPhone}` : undefined}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-white text-sm font-semibold rounded-xl btn-red-inner-shadow transition-colors"
                  style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                >
                  Call Now
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
