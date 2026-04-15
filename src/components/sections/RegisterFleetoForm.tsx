"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Plus, X } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

const inputClass =
  "w-full border-b border-gray-200 pb-2.5 pt-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300 transition-colors focus:border-[#AB2323]";

export default function RegisterFleetoForm() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_contact_number: "",
    invoice_number: "",
    invoice_date: "",
    dealer_name: "",
    dealer_contact_number: "",
    chassis_number: "",
  });
  const [batteryNumbers, setBatteryNumbers] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const updateBattery = (idx: number, val: string) =>
    setBatteryNumbers((prev) => prev.map((b, i) => (i === idx ? val : b)));

  const addBattery = () => setBatteryNumbers((prev) => [...prev, ""]);

  const removeBattery = (idx: number) =>
    setBatteryNumbers((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validBatteries = batteryNumbers.filter((b) => b.trim());
    if (validBatteries.length === 0) {
      setError("Please add at least one battery number.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/register-your-fleeto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          battery_numbers: validBatteries,
        }),
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
          Registration Successful!
        </h3>
        <p className="text-sm text-gray-400 max-w-sm mx-auto" style={{ fontFamily: fonts.body }}>
          Your Fleeto has been registered successfully. You&apos;ll receive a confirmation shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Customer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Customer Name
          </label>
          <input
            type="text" placeholder="Your full name" value={form.customer_name}
            onChange={set("customer_name")} required className={inputClass} style={{ fontFamily: fonts.body }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Contact Number
          </label>
          <input
            type="tel" placeholder="+91 98765 43210" value={form.customer_contact_number}
            onChange={set("customer_contact_number")} required className={inputClass} style={{ fontFamily: fonts.body }}
          />
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Invoice Number
          </label>
          <input
            type="text" placeholder="INV12345" value={form.invoice_number}
            onChange={set("invoice_number")} required className={inputClass} style={{ fontFamily: fonts.body }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Invoice Date
          </label>
          <input
            type="date" value={form.invoice_date}
            onChange={set("invoice_date")} required className={inputClass} style={{ fontFamily: fonts.body }}
          />
        </div>
      </div>

      {/* Dealer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Dealer Name
          </label>
          <input
            type="text" placeholder="Dealer name" value={form.dealer_name}
            onChange={set("dealer_name")} required className={inputClass} style={{ fontFamily: fonts.body }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Dealer Contact Number
          </label>
          <input
            type="tel" placeholder="+91 91234 56780" value={form.dealer_contact_number}
            onChange={set("dealer_contact_number")} required className={inputClass} style={{ fontFamily: fonts.body }}
          />
        </div>
      </div>

      {/* Chassis */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
          Chassis Number
        </label>
        <input
          type="text" placeholder="CHS789456" value={form.chassis_number}
          onChange={set("chassis_number")} required className={inputClass} style={{ fontFamily: fonts.body }}
        />
      </div>

      {/* Battery Numbers (dynamic) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>
            Battery Numbers
          </label>
          <button
            type="button"
            onClick={addBattery}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            style={{ color: colors.primary, backgroundColor: `${colors.primary}10`, fontFamily: fonts.body }}
          >
            <Plus size={12} /> Add Battery
          </button>
        </div>
        {batteryNumbers.map((bat, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Battery ${idx + 1}`}
              value={bat}
              onChange={(e) => updateBattery(idx, e.target.value)}
              required
              className={inputClass}
              style={{ fontFamily: fonts.body }}
            />
            {batteryNumbers.length > 1 && (
              <button
                type="button"
                onClick={() => removeBattery(idx)}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
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
        {loading ? "Registering..." : "Register My Fleeto"}
        {!loading && <ArrowUpRight size={16} />}
      </button>
    </form>
  );
}
