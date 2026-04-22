"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ChevronDown,
  Loader2,
  Phone,
  Clock,
  Navigation,
  ArrowUpRight,
  Store,
  Mail,
} from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

interface DealerItem {
  title?: string;
  description?: string;
  time?: string;
  day?: string;
  call?: string;
  postcode?: string;
  direction?: string;
  test_ride?: string;
  email?: string;
  [key: string]: unknown;
}

interface DealerResult {
  all_data?: DealerItem[];
  message?: string;
  [key: string]: unknown;
}

const stripHtml = (html?: string) =>
  (html ?? "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

// Backend sometimes returns district names in lowercase (e.g. "north dinajpur")
// even though admin entered them as "North Dinajpur". Normalise for display.
const toTitleCase = (s?: string) =>
  (s ?? "")
    .toLowerCase()
    .replace(/\b([a-z])/g, (_, c: string) => c.toUpperCase());

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export default function StoreLocator() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [dealerIdx, setDealerIdx] = useState<string>("");

  const [districts, setDistricts] = useState<string[]>([]);
  const [dealers, setDealers] = useState<DealerItem[]>([]);

  const [results, setResults] = useState<DealerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilter = async (body: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dealer/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
        return null;
      }
      return data;
    } catch {
      setError("Something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (val: string) => {
    setState(val);
    setDistrict("");
    setDealerIdx("");
    setDistricts([]);
    setDealers([]);
    setResults(null);

    if (!val) return;
    const data = await fetchFilter({ state: val });
    if (data) {
      const distList = Array.isArray(data.data) ? data.data : [];
      setDistricts(distList);
      if (distList.length === 0) {
        setResults(data);
      }
    }
  };

  const handleDistrictChange = async (val: string) => {
    setDistrict(val);
    setDealerIdx("");
    setDealers([]);
    setResults(null);

    if (!val) return;
    const data = await fetchFilter({ state, district: val });
    if (data) {
      const list: DealerItem[] = Array.isArray(data.all_data) ? data.all_data : [];
      setDealers(list);
      if (list.length === 0) {
        setResults(data);
      }
    }
  };

  const handleDealerChange = (val: string) => {
    setDealerIdx(val);
    if (!val) {
      setResults(null);
      return;
    }
    if (val === "all") {
      setResults({ all_data: dealers });
      return;
    }
    const picked = dealers[Number(val)];
    setResults(picked ? { all_data: [picked] } : null);
  };

  // Step progress — visual guide for user
  const currentStep = !state ? 1 : !district ? 2 : !dealerIdx ? 3 : 4;

  const items: DealerItem[] = Array.isArray(results?.all_data) ? results!.all_data! : [];
  const showEmptyPrompt = !loading && !error && !results;

  return (
    <div className="space-y-6">
      {/* ─── Filter Card ──────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-5 sm:p-8 shadow-sm border relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #FFF5F5 100%)",
          borderColor: "#F2D4D4",
        }}
      >
        {/* Decorative blob */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
          }}
        />

        <div className="flex items-center gap-3 mb-5 sm:mb-6 relative">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            }}
          >
            <Search size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <h2
              className="text-base sm:text-xl font-bold leading-tight"
              style={{ ...styles.headingFont, color: colors.black }}
            >
              Find a Dealer Near You
            </h2>
            <p
              className="text-[11px] sm:text-xs text-gray-500 mt-0.5"
              style={{ fontFamily: fonts.body }}
            >
              Follow the steps below to see authorised Fleeto dealers
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5 relative">
          {[1, 2, 3].map((n, i) => {
            const active = currentStep >= n;
            const done = currentStep > n;
            return (
              <div key={n} className="flex items-center flex-1 min-w-0">
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shrink-0"
                  style={{
                    backgroundColor: active ? colors.primary : "#E5E7EB",
                    color: active ? "#fff" : "#9CA3AF",
                    fontFamily: fonts.body,
                  }}
                >
                  {done ? "✓" : n}
                </div>
                {i < 2 && (
                  <div
                    className="h-0.5 flex-1 mx-2 rounded-full transition-all"
                    style={{
                      backgroundColor: currentStep > n ? colors.primary : "#E5E7EB",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 relative">
          <StyledSelect
            label="State"
            icon={<MapPin size={13} />}
            value={state}
            onChange={handleStateChange}
            placeholder="Select State"
            options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
          />
          <StyledSelect
            label="District"
            icon={<MapPin size={13} />}
            value={district}
            onChange={handleDistrictChange}
            disabled={!state || districts.length === 0}
            placeholder="Select District"
            options={districts.map((d) => ({ value: d, label: toTitleCase(d) }))}
          />
          <StyledSelect
            label="Dealer"
            icon={<Store size={13} />}
            value={dealerIdx}
            onChange={handleDealerChange}
            disabled={!district || dealers.length === 0}
            placeholder="Select Dealer"
            options={[
              ...(dealers.length > 1
                ? [{ value: "all", label: `All dealers (${dealers.length})` }]
                : []),
              ...dealers.map((d, i) => ({
                value: String(i),
                label: stripHtml(d.title) || `Dealer ${i + 1}`,
              })),
            ]}
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6 relative">
            <Loader2 size={16} className="animate-spin" style={{ color: colors.primary }} />
            <span className="text-sm text-gray-500 font-medium" style={{ fontFamily: fonts.body }}>
              Searching dealers...
            </span>
          </div>
        )}

        {error && (
          <div
            className="text-sm mt-4 px-4 py-3 rounded-xl text-center font-medium relative"
            style={{ backgroundColor: "#FEE2E2", color: "#B91C1C", fontFamily: fonts.body }}
          >
            {error}
          </div>
        )}
      </div>

      {/* ─── Loading skeletons ────────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <DealerCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ─── Empty prompt ─────────────────────────────────────────────── */}
      {showEmptyPrompt && (
        <EmptyPrompt step={currentStep} />
      )}

      {/* ─── Results ──────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {results && !loading && (
          <motion.div
            key={dealerIdx || "all"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {items.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: colors.primary, fontFamily: fonts.body }}
                  >
                    {items.length === 1 ? "Dealer Details" : `${items.length} Dealers Found`}
                  </h3>
                  {district && (
                    <span
                      className="text-xs text-gray-500 font-medium"
                      style={{ fontFamily: fonts.body }}
                    >
                      {toTitleCase(district)}, {state}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item, idx) => (
                    <DealerCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <MapPin size={22} style={{ color: colors.primary }} />
                </div>
                <p
                  className="text-sm text-gray-600 font-medium"
                  style={{ fontFamily: fonts.body }}
                >
                  {typeof results.message === "string"
                    ? results.message
                    : "No dealers found for this location."}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Dealer card ─────────────────────────────────────────────────────── */
function DealerCard({ item, index }: { item: DealerItem; index: number }) {
  const title = stripHtml(item.title) || `Dealer ${index + 1}`;
  const hours = [item.time, item.day].filter(Boolean).join(" · ");

  const directionUrl =
    item.direction?.trim() ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      [title, stripHtml(item.description), item.postcode].filter(Boolean).join(", ")
    )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col"
    >
      {/* Header bar */}
      <div
        className="px-5 py-4 flex items-start gap-3 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFF5F5 0%, #ffffff 100%)",
          borderBottom: "1px solid #F2D4D4",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          }}
        >
          <Store size={18} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h4
            className="font-bold text-sm sm:text-base text-gray-900 leading-snug"
            style={{ fontFamily: fonts.body }}
          >
            {title}
          </h4>
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mt-0.5"
            style={{ color: colors.primary, fontFamily: fonts.body }}
          >
            Authorised Partner
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1 space-y-3">
        {item.description && (
          <DealerRow icon={<MapPin size={14} />}>
            <div
              className="text-xs sm:text-sm text-gray-600 leading-relaxed prose prose-xs max-w-none"
              style={{ fontFamily: fonts.body }}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </DealerRow>
        )}
        {hours && (
          <DealerRow icon={<Clock size={14} />}>
            <span
              className="text-xs sm:text-sm text-gray-600"
              style={{ fontFamily: fonts.body }}
            >
              {hours}
            </span>
          </DealerRow>
        )}
        {item.call && (
          <DealerRow icon={<Phone size={14} />}>
            <a
              href={`tel:${item.call}`}
              className="text-xs sm:text-sm font-semibold hover:underline"
              style={{ color: colors.primary, fontFamily: fonts.body }}
            >
              {item.call}
            </a>
          </DealerRow>
        )}
        {item.email && (
          <DealerRow icon={<Mail size={14} />}>
            <a
              href={`mailto:${item.email}`}
              className="text-xs sm:text-sm text-gray-700 hover:underline break-all"
              style={{ fontFamily: fonts.body }}
            >
              {item.email}
            </a>
          </DealerRow>
        )}
        {item.postcode && (
          <DealerRow icon={<MapPin size={14} />}>
            <span
              className="text-xs sm:text-sm text-gray-500"
              style={{ fontFamily: fonts.body }}
            >
              PIN: <span className="font-semibold text-gray-700">{item.postcode}</span>
            </span>
          </DealerRow>
        )}
      </div>

      {/* Footer CTAs */}
      <div className="px-5 pb-5 pt-1 flex flex-wrap gap-2">
        <a
          href={directionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full text-white transition-transform hover:scale-105 shadow-sm"
          style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
        >
          <Navigation size={12} /> Get Directions
        </a>
        {item.test_ride && (
          <a
            href={item.test_ride}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border-2 transition-colors hover:bg-gray-50"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              fontFamily: fonts.body,
            }}
          >
            Book Test Ride <ArrowUpRight size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function DealerRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${colors.primary}12`, color: colors.primary }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 pt-1">{children}</div>
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────────── */
function DealerCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="px-5 py-4 flex items-start gap-3 bg-gray-50 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-2 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5 pt-1">
              <div className="h-2.5 bg-gray-200 rounded w-full" />
              <div className="h-2.5 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Empty prompt ────────────────────────────────────────────────────── */
function EmptyPrompt({ step }: { step: number }) {
  const messages: Record<number, { title: string; sub: string; icon: React.ReactNode }> = {
    1: {
      title: "Start by selecting your State",
      sub: "We'll then narrow down to your nearest dealers",
      icon: <MapPin size={26} style={{ color: colors.primary }} />,
    },
    2: {
      title: "Now pick your District",
      sub: "This helps us find dealers closest to you",
      icon: <MapPin size={26} style={{ color: colors.primary }} />,
    },
    3: {
      title: "Almost there — choose a Dealer",
      sub: "Pick one from the dropdown to see full details",
      icon: <Store size={26} style={{ color: colors.primary }} />,
    },
  };
  const msg = messages[step] ?? messages[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-8 sm:p-10 text-center border-2 border-dashed"
      style={{ borderColor: "#E5D0D0", backgroundColor: "#FFFBFB" }}
    >
      <div
        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #FFF5F5 100%)",
          border: "2px solid #F2D4D4",
        }}
      >
        {msg.icon}
      </div>
      <h3
        className="text-sm sm:text-base font-bold mb-1"
        style={{ color: colors.black, fontFamily: fonts.body }}
      >
        {msg.title}
      </h3>
      <p
        className="text-xs sm:text-sm text-gray-500"
        style={{ fontFamily: fonts.body }}
      >
        {msg.sub}
      </p>
    </motion.div>
  );
}

/* ─── Styled select ───────────────────────────────────────────────────── */
interface SelectOption {
  value: string;
  label: string;
}
interface StyledSelectProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
}
function StyledSelect({
  label,
  icon,
  value,
  onChange,
  placeholder,
  options,
  disabled,
}: StyledSelectProps) {
  const active = Boolean(value);
  return (
    <label className="block min-w-0">
      <span
        className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 text-gray-500"
        style={{ fontFamily: fonts.body }}
      >
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none border-2 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 text-xs sm:text-sm bg-white cursor-pointer font-semibold focus:outline-none transition-colors truncate disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            fontFamily: fonts.body,
            color: colors.black,
            borderColor: active ? colors.primary : "#E5E7EB",
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: active ? colors.primary : "#9CA3AF" }}
        />
      </div>
    </label>
  );
}
