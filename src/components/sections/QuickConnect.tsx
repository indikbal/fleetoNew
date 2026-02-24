"use client";

import { useState } from "react";
import { PhoneCall, Building2, Store, ShoppingCart } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

const enquiries = [
  {
    icon: PhoneCall,
    label: "Customer Enquiry",
    phone: "08064521248",
  },
  {
    icon: Building2,
    label: "Dealership Enquiry",
    phone: "08064521248",
  },
  {
    icon: Store,
    label: "Find Fleeto Electric Stores Near You!",
    phone: "08064521248",
  },
];

export default function QuickConnect() {
  const [buyPhone, setBuyPhone] = useState("");

  return (
    <section style={{ backgroundColor: "#060000" }} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: colors.primaryLight, fontFamily: fonts.body }}
          >
            We&apos;re here to help
          </p>
          <h2
            className="text-4xl md:text-5xl text-white mb-3"
            style={styles.headingFont}
          >
            Quick Connect
          </h2>
          <p
            className="text-white/40 text-sm"
            style={{ fontFamily: fonts.body }}
          >
            10am – 7pm weekdays
          </p>
        </div>

        {/* ── Enquiry cards ── */}
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">

          {enquiries.map(({ icon: Icon, label, phone }) => (
            <div
              key={label}
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
                >
                  <Icon size={17} style={{ color: colors.primary }} />
                </div>
                <p
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: fonts.body }}
                >
                  {label}
                </p>
              </div>

              <a
                href={`tel:${phone}`}
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
              >
                <ShoppingCart size={17} style={{ color: colors.primary }} />
              </div>
              <div>
                <p
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: fonts.body }}
                >
                  Looking To Buy A E-Scooter!
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

        </div>
      </div>
    </section>
  );
}
