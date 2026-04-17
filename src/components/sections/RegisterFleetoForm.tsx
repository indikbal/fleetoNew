"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Plus,
  X,
  User,
  FileText,
  Store,
  Cog,
  BatteryCharging,
  Loader2,
} from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

const inputClass =
  "w-full border-2 rounded-xl px-4 py-3 text-sm outline-none bg-white text-gray-800 placeholder-gray-300 transition-colors focus:border-[#AB2323]";

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
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        >
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>
        <h3
          className="text-2xl mb-2"
          style={{ ...styles.headingFont, color: colors.black }}
        >
          Registration Successful!
        </h3>
        <p
          className="text-sm text-gray-500 max-w-sm mx-auto"
          style={{ fontFamily: fonts.body }}
        >
          Your Fleeto has been registered. You&apos;ll receive a confirmation shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      {/* ─── Customer Info ──────────────────────────────────────────── */}
      <Section icon={<User size={16} />} title="Customer Details" step={1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Field label="Customer Name">
            <input
              type="text"
              placeholder="Your full name"
              value={form.customer_name}
              onChange={set("customer_name")}
              required
              className={inputClass}
              style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
            />
          </Field>
          <Field label="Contact Number">
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={form.customer_contact_number}
              onChange={set("customer_contact_number")}
              required
              className={inputClass}
              style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
            />
          </Field>
        </div>
      </Section>

      {/* ─── Invoice Info ───────────────────────────────────────────── */}
      <Section icon={<FileText size={16} />} title="Purchase Details" step={2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Field label="Invoice Number">
            <input
              type="text"
              placeholder="INV12345"
              value={form.invoice_number}
              onChange={set("invoice_number")}
              required
              className={inputClass}
              style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
            />
          </Field>
          <Field label="Invoice Date">
            <input
              type="date"
              value={form.invoice_date}
              onChange={set("invoice_date")}
              required
              className={inputClass}
              style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
            />
          </Field>
        </div>
      </Section>

      {/* ─── Dealer Info ────────────────────────────────────────────── */}
      <Section icon={<Store size={16} />} title="Dealer Details" step={3}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Field label="Dealer Name">
            <input
              type="text"
              placeholder="Dealer name"
              value={form.dealer_name}
              onChange={set("dealer_name")}
              required
              className={inputClass}
              style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
            />
          </Field>
          <Field label="Dealer Contact Number">
            <input
              type="tel"
              placeholder="+91 91234 56780"
              value={form.dealer_contact_number}
              onChange={set("dealer_contact_number")}
              required
              className={inputClass}
              style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
            />
          </Field>
        </div>
      </Section>

      {/* ─── Vehicle / Chassis ──────────────────────────────────────── */}
      <Section icon={<Cog size={16} />} title="Vehicle Details" step={4}>
        <Field label="Chassis Number">
          <input
            type="text"
            placeholder="CHS789456"
            value={form.chassis_number}
            onChange={set("chassis_number")}
            required
            className={inputClass}
            style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
          />
        </Field>
      </Section>

      {/* ─── Battery Numbers ────────────────────────────────────────── */}
      <Section icon={<BatteryCharging size={16} />} title="Battery Numbers" step={5}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p
              className="text-xs text-gray-500"
              style={{ fontFamily: fonts.body }}
            >
              Add one entry per battery unit.
            </p>
            <button
              type="button"
              onClick={addBattery}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors hover:bg-[#AB232318]"
              style={{
                color: colors.primary,
                backgroundColor: `${colors.primary}10`,
                fontFamily: fonts.body,
              }}
            >
              <Plus size={12} /> Add Battery
            </button>
          </div>
          {batteryNumbers.map((bat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold pointer-events-none"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    fontFamily: fonts.body,
                  }}
                >
                  {idx + 1}
                </span>
                <input
                  type="text"
                  placeholder={`Battery ${idx + 1} number`}
                  value={bat}
                  onChange={(e) => updateBattery(idx, e.target.value)}
                  required
                  className={`${inputClass} pl-12`}
                  style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
                />
              </div>
              {batteryNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBattery(idx)}
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-2 border-gray-200"
                  aria-label="Remove battery"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>

      {error && (
        <div
          className="text-sm px-4 py-3 rounded-xl text-center font-medium"
          style={{
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
            fontFamily: fonts.body,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-white text-sm font-semibold rounded-2xl btn-red-inner-shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg transition-transform hover:scale-[1.01]"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          fontFamily: fonts.body,
        }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Registering...
          </>
        ) : (
          <>
            Register My Fleeto <ArrowUpRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}

/* ─── Section wrapper ───────────────────────────────────────────────── */
function Section({
  icon,
  title,
  step,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            color: "#fff",
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
            style={{ fontFamily: fonts.body }}
          >
            Step {step}
          </p>
          <h3
            className="text-sm sm:text-base font-bold text-gray-900 leading-tight"
            style={{ fontFamily: fonts.body }}
          >
            {title}
          </h3>
        </div>
        <div className="hidden sm:block flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  );
}

/* ─── Field wrapper ─────────────────────────────────────────────────── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider"
        style={{ fontFamily: fonts.body }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
