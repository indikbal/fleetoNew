"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, Minus, ChevronDown } from "lucide-react";
import { colors, fonts } from "@/config/theme";

// The API returns HTML for descriptions/details (paragraphs, <br/>s).
// Render it inline so multi-line copy doesn't collapse into one run-on string.
const RichText = ({
  html,
  className,
  style,
}: {
  html?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  if (!html) return null;
  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

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
  data?: ProductSpecificationsData | null;
  technicalInfo?: Record<string, string>;
  // Disclaimer pulled from product-details variations[].mileage_note. Rendered
  // under the Vehicle Mileage section when present.
  mileageNote?: string;
}

/* ── Animation helpers ────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const allTabs = ["Performance", "Design", "Technology", "Technical Specification"] as const;
type TabKey = (typeof allTabs)[number];

/* ══════════════════════════════════════════════════════════════════════════ */
export default function ProductSpecifications({ data, technicalInfo, mileageNote }: Props) {
  const hasTechInfo = !!technicalInfo && Object.keys(technicalInfo).length > 0;

  // Only include tabs we actually have data for, so a missing endpoint never
  // surfaces an empty tab.
  const tabs = allTabs.filter((t) => {
    if (t === "Technical Specification") return hasTechInfo;
    return !!data;
  });

  const [active, setActive] = useState<TabKey>(tabs[0] ?? "Performance");

  const tabTitles: Record<TabKey, string> = {
    Performance: data?.performance_section_title || "Performance",
    Design: data?.design_section_title || "Design",
    Technology: data?.technology_section_title || "Technology",
    "Technical Specification": "Technical Specification",
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
          className="flex justify-start md:justify-center gap-2 md:gap-3 mb-12 md:mb-16 overflow-x-auto px-1 -mx-1 scrollbar-none"
        >
          {tabs.map((tab) => {
            const isActive = active === tab;
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className="relative shrink-0 px-4 md:px-7 py-2.5 md:py-3 rounded-full text-xs md:text-base font-semibold transition-colors duration-300 whitespace-nowrap"
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
          {active === "Performance" && data && (
            <PerformanceTab
              key="performance"
              items={data.performance_section}
              description={data.performance_section_details}
            />
          )}
          {active === "Design" && data && (
            <DesignTab
              key="design"
              items={data.design_section}
              description={data.design_section_description}
            />
          )}
          {active === "Technology" && data && (
            <TechnologyTab
              key="technology"
              items={data.technology_section}
              description={data.technology_section_description}
            />
          )}
          {active === "Technical Specification" && technicalInfo && (
            <TechnicalSpecificationTab
              key="techspec"
              info={technicalInfo}
              mileageNote={mileageNote}
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
      <RichText
        html={description}
        className="prose-spec text-center text-gray-500 text-sm md:text-base mb-10 max-w-3xl mx-auto"
        style={{ fontFamily: fonts.body }}
      />

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
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
                <h3
                  className="text-white text-2xl md:text-3xl uppercase"
                  style={{ fontFamily: fonts.display }}
                >
                  {current.main_section_title}
                </h3>
                <RichText
                  html={current.main_section_details}
                  className="prose-spec text-white/80 text-sm mt-1"
                  style={{ fontFamily: fonts.body }}
                />
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
                  className="flex items-start gap-4 rounded-xl p-3 md:p-4 text-left transition-all duration-300"
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
                  {item.image ? (
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
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <h4
                      className="text-sm md:text-base font-semibold"
                      style={{ fontFamily: fonts.body, color: colors.black }}
                    >
                      {item.title}
                    </h4>
                    <RichText
                      html={item.details}
                      className="prose-spec text-gray-500 text-xs md:text-sm mt-0.5"
                      style={{ fontFamily: fonts.body }}
                    />
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
      <RichText
        html={description}
        className="prose-spec text-center text-gray-500 text-sm md:text-base mb-10 max-w-3xl mx-auto"
        style={{ fontFamily: fonts.body }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col"
            style={{
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {item.image ? (
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : null}
            <div className="p-4 md:p-5 flex-1">
              <h3
                className="text-base md:text-lg font-semibold mb-1"
                style={{ fontFamily: fonts.body, color: colors.black }}
              >
                {item.title}
              </h3>
              <RichText
                html={item.details}
                className="prose-spec text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: fonts.body }}
              />
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
      <RichText
        html={description}
        className="prose-spec text-center text-gray-500 text-sm md:text-base mb-10 max-w-3xl mx-auto"
        style={{ fontFamily: fonts.body }}
      />

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
            {item.image ? (
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
            ) : null}
            <div className="flex-1 min-w-0">
              <h3
                className="text-base md:text-lg font-semibold mb-1.5"
                style={{ fontFamily: fonts.body, color: colors.black }}
              >
                {item.title}
              </h3>
              <RichText
                html={item.details}
                className="prose-spec text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: fonts.body }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Technical Specification Tab                                              */
/* ══════════════════════════════════════════════════════════════════════════ */
// The technical-information-section endpoint returns a flat ordered dict where
// 4 well-known keys act as section headers. Group everything under the most
// recent header as we walk the entries.
const TECH_SECTION_HEADERS: Record<string, string> = {
  vehicle_operational_features: "Vehicle Operational Features",
  lead_acid_battery_compatibility: "Lead Acid Battery Compatibility",
  lithium_battery_compatibility: "Lithium Battery Compatibility",
  vehicle_mileage: "Vehicle Mileage",
};

// "lead_acid:_60v_32_ah_vm" → "Lead Acid: 60V 32 Ah" (drop _vm/_lbc suffixes
// that disambiguate same-named keys in compatibility vs mileage sections).
function humanizeTechKey(key: string): string {
  return key
    .replace(/_lbc$/i, "")
    .replace(/_vm$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/(\d+)\s*v\b/gi, "$1V")
    .replace(/(\d+)\s*ah\b/gi, "$1Ah");
}

interface TechRow {
  key: string;
  label: string;
  value: string;
}

interface TechGroup {
  title: string;
  rows: TechRow[];
}

// Title/description pairs the backend appends to every product's technical_info
// payload. They render as a separate "Specifications Overview" group with the
// description shown as HTML, instead of the YES/NA value rows used elsewhere.
const DESCRIPTION_PAIRS: { titleKey: string; descKey: string }[] = [
  { titleKey: "motor_title", descKey: "motor_description" },
  { titleKey: "ground_clearance_title", descKey: "ground_clearance_description" },
  { titleKey: "boot_space_title", descKey: "boot_space_description" },
];

const DESCRIPTION_KEYS = new Set(
  DESCRIPTION_PAIRS.flatMap((p) => [p.titleKey, p.descKey])
);

interface TechDescriptionItem {
  title: string;
  description: string;
}

function groupTechnicalInfo(info: Record<string, string>): TechGroup[] {
  const groups: TechGroup[] = [];
  let current: TechGroup = { title: "", rows: [] };
  for (const [key, value] of Object.entries(info)) {
    if (DESCRIPTION_KEYS.has(key)) continue;
    const headerLabel = TECH_SECTION_HEADERS[key];
    if (headerLabel) {
      if (current.title || current.rows.length > 0) groups.push(current);
      current = { title: headerLabel, rows: [] };
      continue;
    }
    current.rows.push({ key, label: humanizeTechKey(key), value });
  }
  if (current.title || current.rows.length > 0) groups.push(current);
  return groups;
}

function extractDescriptionItems(
  info: Record<string, string>
): TechDescriptionItem[] {
  const items: TechDescriptionItem[] = [];
  for (const { titleKey, descKey } of DESCRIPTION_PAIRS) {
    const title = (info[titleKey] ?? "").trim();
    const description = (info[descKey] ?? "").trim();
    if (!title && !description) continue;
    items.push({ title, description });
  }
  return items;
}

function TechnicalSpecificationTab({
  info,
  mileageNote,
}: {
  info: Record<string, string>;
  mileageNote?: string;
}) {
  const groups = groupTechnicalInfo(info);
  const descriptionItems = extractDescriptionItems(info);

  // Open the first group by default so the user sees content without clicking;
  // the rest stay collapsed to keep the section short.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Render YES/NA as icons for compatibility sections; everything else stays
  // as the raw API string (e.g. "12 Inches", "BLDC Hub Motor (IP67)").
  const renderValue = (v: string) => {
    const trimmed = (v ?? "").trim();
    const upper = trimmed.toUpperCase();
    if (upper === "YES") {
      return (
        <span
          className="inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: colors.primary, fontFamily: fonts.body }}
        >
          <Check size={16} strokeWidth={2.5} />
          Yes
        </span>
      );
    }
    if (upper === "NO" || upper === "NA" || upper === "N/A") {
      return (
        <span
          className="inline-flex items-center gap-1.5 text-sm text-gray-400"
          style={{ fontFamily: fonts.body }}
        >
          <Minus size={16} strokeWidth={2.5} />
          {upper === "NO" ? "No" : "NA"}
        </span>
      );
    }
    return (
      <span
        className="text-sm text-gray-800"
        style={{ fontFamily: fonts.body }}
      >
        {trimmed}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex flex-col gap-3 md:gap-4">
        {groups.map((group, gi) => {
          const isOpen = openIndex === gi;
          const panelId = `tech-spec-panel-${gi}`;
          const buttonId = `tech-spec-button-${gi}`;
          return (
            <motion.div
              key={`${group.title}-${gi}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: gi * 0.05 }}
              className="rounded-2xl bg-white overflow-hidden shadow-sm"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}
            >
              {group.title && (
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : gi)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-3.5 md:py-4 text-left transition-colors"
                  style={{
                    color: isOpen ? "#fff" : colors.black,
                    background: isOpen
                      ? `linear-gradient(90deg, ${colors.primary}, ${colors.primaryDark})`
                      : "rgba(0,0,0,0.02)",
                    fontFamily: fonts.body,
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="text-xs font-semibold opacity-70 tabular-nums"
                      style={{ minWidth: "1.5rem" }}
                    >
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm md:text-base font-semibold tracking-wide">
                      {group.title}
                    </span>
                    <span
                      className="text-xs font-medium opacity-60 hidden sm:inline"
                    >
                      ({group.rows.length})
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full"
                    style={{
                      background: isOpen ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.05)",
                    }}
                  >
                    <ChevronDown size={16} strokeWidth={2.5} />
                  </motion.span>
                </button>
              )}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <dl
                      className="divide-y"
                      style={{ borderColor: "rgba(0,0,0,0.06)" }}
                    >
                      {group.rows.map((row) => (
                        <div
                          key={row.key}
                          className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-1 sm:gap-4 px-5 md:px-6 py-3 md:py-3.5"
                          style={{ borderColor: "rgba(0,0,0,0.06)" }}
                        >
                          <dt
                            className="text-sm font-medium text-gray-500"
                            style={{ fontFamily: fonts.body }}
                          >
                            {row.label}
                          </dt>
                          <dd className="sm:text-right">{renderValue(row.value)}</dd>
                        </div>
                      ))}
                    </dl>
                    {group.title === TECH_SECTION_HEADERS.vehicle_mileage &&
                      mileageNote && (
                        <p
                          className="px-5 md:px-6 py-3 text-xs italic"
                          style={{
                            backgroundColor: "rgba(171,35,35,0.04)",
                            color: colors.primaryDark,
                            fontFamily: fonts.body,
                            borderTop: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          * {mileageNote}
                        </p>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {descriptionItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-2">
            {descriptionItems.map((item, i) => (
              <motion.div
                key={`${item.title}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-2xl bg-white overflow-hidden shadow-sm p-5 md:p-6 flex flex-col gap-2"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <h4
                  className="text-sm md:text-base font-semibold uppercase tracking-wide"
                  style={{ color: colors.primary, fontFamily: fonts.body }}
                >
                  {item.title}
                </h4>
                <RichText
                  html={item.description}
                  className="prose-spec text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: fonts.body }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
