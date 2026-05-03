"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS   = 25;   // working days per month
const PET_KM = 40;   // km per litre (petrol)
const PET_RS = 100;  // ₹ per litre
const EL_KM  = 35;   // km per unit (electric)
const EL_RS  = 10;   // ₹ per unit

function calc(km: number) {
  const monthlyKm = km * DAYS;
  const petrol    = Math.round((monthlyKm / PET_KM) * PET_RS);
  const electric  = Math.round((monthlyKm / EL_KM)  * EL_RS);
  const savings   = petrol - electric;
  const annual    = savings * 12;
  return { petrol, electric, savings, annual };
}

function fmt(n: number) {
  return `₹ ${n.toLocaleString("en-IN")}`;
}

function IconCircle({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0">
      <Image src={src} alt={alt} width={44} height={44} className="object-contain" />
    </div>
  );
}

interface Props {
  title1: string;
  title2: string;
  title3: string;
  title4: string;
  description: string;
  shortTitle: string;
  longTitle: string;
  longDescription: string;
  // Fixed annual amount added on top of (savings * 12). Backend-managed.
  miscellaneousAmount?: string | number;
  miscellaneousLabel?: string;
}

export default function SavingsCalculator({
  title1,
  title2,
  title3,
  title4,
  description,
  shortTitle,
  longTitle,
  longDescription,
  miscellaneousAmount,
  miscellaneousLabel,
}: Props) {
  const [km, setKm] = useState(60);
  const { petrol, electric, savings, annual: baseAnnual } = calc(km);

  // Backend may ship the misc amount as a string; coerce and clamp negatives.
  const miscRaw =
    typeof miscellaneousAmount === "number"
      ? miscellaneousAmount
      : parseInt(String(miscellaneousAmount ?? "").replace(/[^\d-]/g, ""), 10);
  const misc = Number.isFinite(miscRaw) && miscRaw > 0 ? miscRaw : 0;
  const miscTitle = miscellaneousLabel?.trim() || "Miscellaneous";
  const annual = baseAnnual + misc;

  const MIN = 10;
  const MAX = 150;
  const pct = ((km - MIN) / (MAX - MIN)) * 100;

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "580px" }}>

      {/* Background image */}
      <Image
        src="/images/calc-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(100,10,10,0.98) 0%, rgba(50,5,5,0.80) 45%, rgba(5,0,0,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left ── */}
          <div className="pb-10 sm:pb-20 lg:pb-0">

            {/* Heading — API order: title1 title2 title4 title3 */}
            <h2
              className="text-4xl md:text-5xl leading-tight mb-5"
              style={styles.headingFont}
            >
              <span className="text-white">{title1} </span>
              <span style={{ color: colors.primaryLight }}>{title2} </span>
              <span className="text-white">{title4} </span>
              <span style={{ color: colors.primaryLight }}>{title3}</span>
            </h2>

            <p
              className="text-white/65 text-sm leading-relaxed mb-10 max-w-sm"
              style={{ fontFamily: fonts.body }}
            >
              {description}
            </p>

            <p
              className="text-white text-base font-semibold mb-4"
              style={{ fontFamily: fonts.body }}
            >
              {shortTitle}
            </p>

            {/* Custom slider */}
            <div className="relative max-w-md">
              <div
                className="relative w-full h-12 rounded-full overflow-hidden"
                style={{
                  background: "rgba(60,8,8,0.70)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `calc(${pct}% - ${(pct / 100) * 72}px + 36px)`,
                    background: `linear-gradient(to right, #3D0505, ${colors.primaryDark})`,
                    transition: "width 50ms linear",
                  }}
                />
                <div
                  className="absolute inset-y-0 rounded-full flex items-center justify-center pointer-events-none"
                  style={{
                    width: "72px",
                    left: `calc(${pct}% - ${(pct / 100) * 72}px)`,
                    transition: "left 50ms linear",
                    background: `linear-gradient(160deg, #C03030 0%, ${colors.primaryDark} 100%)`,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20)",
                  }}
                >
                  <span
                    className="text-white text-sm font-bold select-none"
                    style={{ fontFamily: fonts.body }}
                  >
                    {km}km
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={MIN}
                max={MAX}
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing"
                style={{ zIndex: 10 }}
              />
            </div>

            {/* Assumptions */}
            <div className="mt-10">
              <p
                className="text-white/55 text-xs font-semibold mb-1.5"
                style={{ fontFamily: fonts.body }}
              >
                {longTitle}
              </p>
              <p
                className="text-white/35 text-xs leading-relaxed max-w-xs"
                style={{ fontFamily: fonts.body }}
              >
                {longDescription}
              </p>
            </div>
          </div>

          {/* ── Right: results card ── */}
          <div
            className="rounded-2xl p-6 md:p-8 flex flex-col gap-5"
            style={{
              background: "rgba(60,8,8,0.05)",
              backdropFilter: "blur(4px) saturate(1.5)",
              WebkitBackdropFilter: "blur(4px) saturate(1.8)",
              borderTop: "1px solid rgba(255,255,255,0.18)",
              borderLeft: "1px solid rgba(255,255,255,0.10)",
              borderRight: "1px solid rgba(255,255,255,0.10)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <IconCircle src="/images/petrol-icon.png" alt="Petrol" />
              <div className="flex-1">
                <p className="text-white/55 text-sm leading-none mb-0.5" style={{ fontFamily: fonts.body }}>Monthly</p>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: fonts.body }}>petrol cost</p>
              </div>
              <p className="text-white text-xl font-bold tabular-nums" style={{ fontFamily: fonts.body }}>
                {fmt(petrol)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <IconCircle src="/images/electric-icon.png" alt="Electric" />
              <div className="flex-1">
                <p className="text-white/55 text-sm leading-none mb-0.5" style={{ fontFamily: fonts.body }}>Monthly</p>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: fonts.body }}>electricity cost *</p>
              </div>
              <p className="text-white text-xl font-bold tabular-nums" style={{ fontFamily: fonts.body }}>
                {fmt(electric)}
              </p>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between">
              <p className="text-white font-semibold" style={{ fontFamily: fonts.body }}>Monthly Savings</p>
              <p className="text-white text-xl font-bold tabular-nums" style={{ fontFamily: fonts.body }}>
                {fmt(savings)}
              </p>
            </div>

            {misc > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold" style={{ fontFamily: fonts.body }}>
                  {miscTitle}
                </p>
                <p className="text-white text-xl font-bold tabular-nums" style={{ fontFamily: fonts.body }}>
                  {fmt(misc)}
                </p>
              </div>
            )}

            <div
              className="flex items-center justify-between rounded-xl px-5 py-4 mb-5"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(1px) saturate(1.5)",
                WebkitBackdropFilter: "blur(4px) saturate(1.8)",
              }}
            >
              <p className="text-white font-semibold" style={{ fontFamily: fonts.body }}>Annual Savings</p>
              <p className="text-white text-2xl font-bold tabular-nums" style={{ fontFamily: fonts.body }}>
                {fmt(annual)}
              </p>
            </div>

            <a
              href="#contact"
              className="self-center inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full transition-colors btn-red-inner-shadow"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              Book Your Test Ride
              <ArrowUpRight size={15} />
            </a>
          </div>

        </div>
      </div>

    </section>
  );
}
