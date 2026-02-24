"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Clock, ShieldCheck, ThumbsUp, CheckCircle2 } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

// ─── Perks shown on the left panel ───────────────────────────────────────────
const perks = [
  { icon: Clock,       text: "15-minute hands-on experience" },
  { icon: ShieldCheck, text: "Expert guidance from our team"  },
  { icon: ThumbsUp,    text: "Zero commitment, 100% free"     },
];

// ─── Form fields config ───────────────────────────────────────────────────────
type FormKey = "name" | "email" | "phone" | "address";

const fields: { key: FormKey; label: string; placeholder: string; type: string }[] = [
  { key: "name",    label: "Full Name",      placeholder: "John Doe",          type: "text"  },
  { key: "email",   label: "Email Address",  placeholder: "you@example.com",   type: "email" },
  { key: "phone",   label: "Phone Number",   placeholder: "+91 98765 43210",   type: "tel"   },
  { key: "address", label: "Your Address",   placeholder: "City, State",       type: "text"  },
];

// ─── Shared input style ───────────────────────────────────────────────────────
const inputClass =
  "w-full border-b border-gray-200 pb-3 pt-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300 transition-colors focus:border-[#AB2323]";

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const slideIn = (dir: "left" | "right", delay = 0) => ({
  initial: { opacity: 0, x: dir === "left" ? -50 : 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.75, ease: "easeOut" as const, delay },
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function BookTestRideSection() {
  const [form, setForm] = useState<Record<FormKey, string>>({
    name: "", email: "", phone: "", address: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key: FormKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row">

      {/* ══════════════════════════════════════════════════════════════════════
          LEFT PANEL — dark red, branding + perks + scooter
      ══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        {...slideIn("left")}
        className="relative lg:w-[48%] flex flex-col overflow-hidden"
        style={{
          background: `linear-gradient(145deg, #1A0000 0%, ${colors.primaryDark} 40%, ${colors.primary} 100%)`,
          minHeight: "420px",
        }}
      >
        {/* Decorative pulsing rings */}
        {[280, 440, 600].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              top: "22%",
              left: "-18%",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.18, 0.5] }}
            transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          />
        ))}

        {/* Top-right glow blob */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,120,120,0.12) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col h-full px-8 md:px-12 pt-28 lg:pt-36 pb-8">

          {/* Tag */}
          <motion.p
            {...fadeUp(0.25)}
            className="text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: fonts.body }}
          >
            Fleeto Electric Scooters
          </motion.p>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.35)}
            className="leading-none mb-5"
            style={{ ...styles.headingFont, fontSize: "clamp(44px, 5.5vw, 72px)" }}
          >
            <span className="text-white">Book Your</span>
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px rgba(255,255,255,0.55)",
                color: "transparent",
              }}
            >
              Test Ride
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.45)}
            className="text-sm leading-relaxed mb-10 max-w-xs"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: fonts.body }}
          >
            Feel the silence. Feel the speed. Experience the future of urban
            mobility — completely free, no strings attached.
          </motion.p>

          {/* Perks */}
          <div className="flex flex-col gap-4 mb-10">
            {perks.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                {...fadeUp(0.55 + i * 0.1)}
                className="flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <Icon size={15} color="white" />
                </div>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.75)", fontFamily: fonts.body }}
                >
                  {text}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>

      {/* ── Scooter at the split — desktop only ── */}
      <div
        className="absolute hidden lg:block pointer-events-none"
        style={{
          top: "50%",
          left: "48%",
          transform: "translate(-70%, -50%)",
          width: "520px",
          height: "520px",
          zIndex: 20,
        }}
      >
        <motion.div
          style={{ width: "100%", height: "100%", position: "relative" }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/hero-scooty.png"
            alt="Fleeto electric scooter"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          RIGHT PANEL — white, form
      ══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        {...slideIn("right", 0.1)}
        className="lg:w-[52%] bg-white flex items-center justify-center px-6 py-16 md:px-16 lg:px-20"
      >
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">

            {/* ── Form state ── */}
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Heading */}
                <motion.div {...fadeUp(0.3)} className="mb-10">
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-2"
                    style={{ color: colors.primary, fontFamily: fonts.body }}
                  >
                    Reserve Your Slot
                  </p>
                  <h2
                    className="text-3xl md:text-4xl mb-2"
                    style={{ ...styles.headingFont, color: colors.black }}
                  >
                    Let&apos;s Get Started
                  </h2>
                  <p
                    className="text-gray-400 text-sm leading-relaxed"
                    style={{ fontFamily: fonts.body }}
                  >
                    Fill in your details and we&apos;ll reach out to confirm your slot.
                  </p>
                </motion.div>

                {/* Fields */}
                <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
                  {fields.map(({ key, label, placeholder, type }, i) => (
                    <motion.div
                      key={key}
                      {...fadeUp(0.4 + i * 0.08)}
                      className="flex flex-col gap-1.5"
                    >
                      <label
                        className="text-xs text-gray-400 font-medium"
                        style={{ fontFamily: fonts.body }}
                      >
                        {label}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={set(key)}
                        required
                        className={inputClass}
                        style={{ fontFamily: fonts.body }}
                      />
                    </motion.div>
                  ))}

                  {/* Submit */}
                  <motion.button
                    {...fadeUp(0.75)}
                    type="submit"
                    className="w-full py-4 text-white text-sm font-semibold rounded-xl transition-colors btn-red-inner-shadow flex items-center justify-center gap-2 mt-2"
                    style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                  >
                    Book My Test Ride
                    <ArrowUpRight size={16} />
                  </motion.button>

                  {/* Fine print */}
                  <motion.p
                    {...fadeUp(0.82)}
                    className="text-center text-xs text-gray-300"
                    style={{ fontFamily: fonts.body }}
                  >
                    By submitting, you agree to be contacted by our team.
                  </motion.p>
                </form>
              </motion.div>

            ) : (
              /* ── Success state ── */
              <motion.div
                key="success"
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Animated check circle */}
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                  style={{ backgroundColor: `${colors.primary}15` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                >
                  <CheckCircle2 size={44} style={{ color: colors.primary }} />
                </motion.div>

                <motion.h3
                  className="text-4xl mb-3"
                  style={{ ...styles.headingFont, color: colors.black }}
                  {...fadeUp(0.25)}
                >
                  You&apos;re All Set!
                </motion.h3>

                <motion.p
                  className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto"
                  style={{ fontFamily: fonts.body }}
                  {...fadeUp(0.35)}
                >
                  We&apos;ve received your request. Our team will call you shortly
                  to confirm your test ride slot.
                </motion.p>

                <motion.a
                  href="/"
                  className="inline-flex items-center gap-2 px-7 py-3 text-white text-sm font-semibold rounded-full btn-red-inner-shadow transition-colors"
                  style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                  {...fadeUp(0.45)}
                >
                  Back to Home
                </motion.a>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

    </div>
  );
}
