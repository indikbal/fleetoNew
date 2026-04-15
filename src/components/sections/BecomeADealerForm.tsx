"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const inputClass =
  "w-full border-b border-gray-200 pb-2.5 pt-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300 transition-colors focus:border-[#AB2323]";

export default function BecomeADealerForm() {
  const [form, setForm] = useState({
    name: "",
    contact_number: "",
    email: "",
    pincode: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/become-a-dealer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="text-center py-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${colors.primary}15` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        >
          <CheckCircle2 size={40} style={{ color: colors.primary }} />
        </motion.div>
        <h3 className="text-2xl mb-2" style={{ ...styles.headingFont, color: colors.black }}>
          Request Submitted!
        </h3>
        <p className="text-sm text-gray-400 max-w-sm mx-auto" style={{ fontFamily: fonts.body }}>
          Thank you for your interest. Our partnership team will review your application and get in touch shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={set("name")}
            required
            className={inputClass}
            style={{ fontFamily: fonts.body }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Contact Number
          </label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={form.contact_number}
            onChange={set("contact_number")}
            required
            className={inputClass}
            style={{ fontFamily: fonts.body }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
            required
            className={inputClass}
            style={{ fontFamily: fonts.body }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Pincode
          </label>
          <input
            type="text"
            placeholder="700001"
            value={form.pincode}
            onChange={set("pincode")}
            required
            pattern="[0-9]{6}"
            maxLength={6}
            className={inputClass}
            style={{ fontFamily: fonts.body }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
          State
        </label>
        <select
          value={form.state}
          onChange={set("state")}
          required
          className={`${inputClass} appearance-none cursor-pointer`}
          style={{ fontFamily: fonts.body }}
        >
          <option value="">Select State</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center" style={{ fontFamily: fonts.body }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-white text-sm font-semibold rounded-xl transition-colors btn-red-inner-shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primaryDark)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
      >
        {loading ? "Submitting..." : "Submit Application"}
        {!loading && <ArrowUpRight size={16} />}
      </button>
    </form>
  );
}
