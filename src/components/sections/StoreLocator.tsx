"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ChevronDown, Loader2 } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

interface DealerResult {
  [key: string]: unknown;
}

const inputClass =
  "w-full border-b border-gray-200 pb-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300 transition-colors focus:border-[#AB2323]";

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

  const [districts, setDistricts] = useState<string[]>([]);

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
    setDistricts([]);
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
    setResults(null);

    if (!val) return;
    const data = await fetchFilter({ state, district: val });
    if (data) {
      setResults(data);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    const raw = (results as { all_data?: unknown }).all_data;
    const items: Record<string, string>[] = Array.isArray(raw) ? (raw as Record<string, string>[]) : [];

    if (items.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl p-5 border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <MapPin size={16} style={{ color: colors.primary }} />
                </div>
                <div className="min-w-0 flex-1">
                  {item.title && (
                    <p
                      className="font-semibold text-sm text-gray-900 mb-1"
                      style={{ fontFamily: fonts.body }}
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                  )}
                  {item.description && (
                    <div
                      className="text-xs text-gray-500 leading-relaxed prose prose-xs max-w-none"
                      style={{ fontFamily: fonts.body }}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                  {(item.time || item.day) && (
                    <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: fonts.body }}>
                      {[item.time, item.day].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {item.call && (
                    <a
                      href={`tel:${item.call}`}
                      className="text-xs mt-1 inline-block"
                      style={{ fontFamily: fonts.body, color: colors.primary }}
                    >
                      {item.call}
                    </a>
                  )}
                  {item.postcode && (
                    <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: fonts.body }}>
                      PIN: {item.postcode}
                    </p>
                  )}
                  {(item.direction || item.test_ride) && (
                    <div className="flex gap-3 mt-2">
                      {item.direction && (
                        <a
                          href={item.direction}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium"
                          style={{ fontFamily: fonts.body, color: colors.primary }}
                        >
                          Directions →
                        </a>
                      )}
                      {item.test_ride && (
                        <a
                          href={item.test_ride}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-700"
                          style={{ fontFamily: fonts.body }}
                        >
                          Book test ride →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    if (typeof (results as { message?: unknown }).message === "string") {
      return (
        <div className="bg-white rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500" style={{ fontFamily: fonts.body }}>
            {(results as { message: string }).message}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500" style={{ fontFamily: fonts.body }}>
          No dealers found for this location.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Search size={18} style={{ color: colors.primary }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ ...styles.headingFont, color: colors.black }}>
              Find a Dealer Near You
            </h2>
            <p className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>
              Select your location to find authorised Fleeto dealers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* State */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
              State
            </label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer pr-8`}
                style={{ fontFamily: fonts.body }}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* District */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
              District
            </label>
            <div className="relative">
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!state || districts.length === 0}
                className={`${inputClass} appearance-none cursor-pointer pr-8 disabled:opacity-40 disabled:cursor-not-allowed`}
                style={{ fontFamily: fonts.body }}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Loader2 size={16} className="animate-spin" style={{ color: colors.primary }} />
            <span className="text-sm text-gray-400" style={{ fontFamily: fonts.body }}>
              Searching dealers...
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 mt-4 text-center" style={{ fontFamily: fonts.body }}>
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
