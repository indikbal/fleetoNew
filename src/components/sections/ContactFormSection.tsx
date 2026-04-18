"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

const inputClass =
  "w-full border-b border-gray-200 pb-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300 transition-colors focus:border-[#AB2323]";

interface Props {
  bannerTitle: string;
  formTitle: string;
  formSubTitle: string;
  addressTitle: string;
  mailTitle: string;
  telephoneTitle: string;
  workingHoursTitle: string;
  address: string;
  email: string;
  phone: string;
  workingHours: string;
}

export default function ContactFormSection({
  bannerTitle,
  formTitle,
  formSubTitle,
  addressTitle,
  mailTitle,
  telephoneTitle,
  workingHoursTitle,
  address,
  email,
  phone,
  workingHours,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const validate = () => {
    const errs: Partial<Record<keyof typeof form, string>> = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.email.trim()) {
      errs.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) {
      errs.phone = "Please enter your phone number.";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) {
      errs.phone = "Enter a valid phone number.";
    }
    if (!form.subject.trim()) errs.subject = "Please enter a subject.";
    if (!form.message.trim()) {
      errs.message = "Please enter a message.";
    } else if (form.message.trim().length < 10) {
      errs.message = "Message should be at least 10 characters.";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
      } else {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addressLines = address
    ? address.split(/\r?\n|<br\s*\/?>(?![^<]*<\/[^>]+>)/i).map((l) => l.trim()).filter(Boolean)
    : [];

  const infoItems: {
    icon: typeof MapPin;
    label: string;
    lines: string[];
    href?: string;
  }[] = [
    ...(address
      ? [{ icon: MapPin, label: addressTitle, lines: addressLines }]
      : []),
    ...(email
      ? [{ icon: Mail, label: mailTitle, lines: [email], href: `mailto:${email}` }]
      : []),
    ...(phone
      ? [{ icon: Phone, label: telephoneTitle, lines: [phone], href: `tel:${phone.replace(/\s+/g, "")}` }]
      : []),
  ];

  return (
    <section
      className="relative overflow-hidden pt-20 md:pt-24 pb-16 md:pb-24"
      style={{ backgroundColor: "#FFF5F5" }}
    >
      {/* ── SVG sunrise title ── */}
      <motion.div
        className="absolute inset-x-0 pointer-events-none select-none"
        style={{ zIndex: 0, top: "5rem" }}
        initial={{ y: "8vw", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 1200 160"
          width="100%"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="contactGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor="#FFF5F5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <text
            x="600"
            y="145"
            textAnchor="middle"
            fill="none"
            stroke="url(#contactGrad)"
            strokeWidth="1"
            fontSize="120"
            style={{ fontFamily: fonts.display }}
          >
            {bannerTitle}
          </text>
        </svg>
      </motion.div>

      {/* ── White card ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "12%" }}
      >
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">

          {/* Tag + heading */}
          <div className="mb-10">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: colors.primary, fontFamily: fonts.body }}
            >
              {formTitle}
            </p>
            <h2
              className="text-3xl md:text-4xl"
              style={{ ...styles.headingFont, color: colors.black }}
            >
              {formSubTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* ── Left: form ── */}
            <form className="flex flex-col gap-7" onSubmit={handleSubmit} noValidate>

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Your Name</label>
                  <input type="text" placeholder="John Doe" value={form.name} onChange={set("name")}
                    className={`${inputClass} ${fieldErrors.name ? "border-red-400" : ""}`} style={{ fontFamily: fonts.body }} />
                  {fieldErrors.name && (
                    <span className="text-xs text-red-500" style={{ fontFamily: fonts.body }}>{fieldErrors.name}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Email Address</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
                    className={`${inputClass} ${fieldErrors.email ? "border-red-400" : ""}`} style={{ fontFamily: fonts.body }} />
                  {fieldErrors.email && (
                    <span className="text-xs text-red-500" style={{ fontFamily: fonts.body }}>{fieldErrors.email}</span>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")}
                    className={`${inputClass} ${fieldErrors.phone ? "border-red-400" : ""}`} style={{ fontFamily: fonts.body }} />
                  {fieldErrors.phone && (
                    <span className="text-xs text-red-500" style={{ fontFamily: fonts.body }}>{fieldErrors.phone}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Subject</label>
                  <input type="text" placeholder="How can we help?" value={form.subject} onChange={set("subject")}
                    className={`${inputClass} ${fieldErrors.subject ? "border-red-400" : ""}`} style={{ fontFamily: fonts.body }} />
                  {fieldErrors.subject && (
                    <span className="text-xs text-red-500" style={{ fontFamily: fonts.body }}>{fieldErrors.subject}</span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Your Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us more about your enquiry..."
                  value={form.message}
                  onChange={set("message")}
                  className={`${inputClass} resize-none ${fieldErrors.message ? "border-red-400" : ""}`}
                  style={{ fontFamily: fonts.body }}
                />
                {fieldErrors.message && (
                  <span className="text-xs text-red-500" style={{ fontFamily: fonts.body }}>{fieldErrors.message}</span>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 -mb-3" style={{ fontFamily: fonts.body }}>
                  {error}
                </p>
              )}

              {/* Success */}
              {submitted && (
                <p className="text-sm text-green-600 -mb-3" style={{ fontFamily: fonts.body }}>
                  Message sent! We&apos;ll get back to you shortly.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-white text-sm font-semibold rounded-xl transition-colors btn-red-inner-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                {loading ? "SENDING…" : "SEND MESSAGE"}
              </button>
            </form>

            {/* ── Right: info cards ── */}
            <div className="flex flex-col gap-5">

              {infoItems.map(({ icon: Icon, label, lines, href }, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.primary}18` }}
                  >
                    <Icon size={18} style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-gray-800 mb-1 text-sm"
                      style={{ fontFamily: fonts.body }}
                    >
                      {label}
                    </p>
                    {lines.map((line, i) => (
                      <p
                        key={i}
                        className="text-sm leading-relaxed"
                        style={{
                          fontFamily: fonts.body,
                          color: href ? colors.primary : "#6b7280",
                        }}
                      >
                        {href ? (
                          <a href={href} className="hover:underline break-all">
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Working hours */}
              {workingHours && (
                <div className="flex gap-4 items-start">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.primary}18` }}
                  >
                    <Clock size={18} style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1.5 text-sm" style={{ fontFamily: fonts.body }}>
                      {workingHoursTitle}
                    </p>
                    <div
                      className="text-sm text-gray-500 leading-relaxed [&_p]:m-0"
                      style={{ fontFamily: fonts.body }}
                      dangerouslySetInnerHTML={{ __html: workingHours }}
                    />
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
