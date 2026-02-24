"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

const infoItems = [
  {
    icon: MapPin,
    label: "Address",
    lines: [
      "Plot No 2, 3rd Floor, Block FA",
      "East Kolkata Development Project",
      "Ward no 107, Rajdanga Main Road",
      "PS Kasba, Kolkata – 700107",
    ],
  },
  {
    icon: Mail,
    label: "Mail Us",
    lines: ["reach_fleeto@fleetoev.in"],
    isLink: true,
  },
  {
    icon: Phone,
    label: "Telephone",
    lines: ["Sales: 08064521248", "Service: 08064521248"],
  },
];

const inputClass =
  "w-full border-b border-gray-200 pb-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300 transition-colors focus:border-[#AB2323]";

export default function ContactFormSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

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
            Contact Us
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
              Let&apos;s Connect
            </p>
            <h2
              className="text-3xl md:text-4xl"
              style={{ ...styles.headingFont, color: colors.black }}
            >
              Send Your Message
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* ── Left: form ── */}
            <form className="flex flex-col gap-7" onSubmit={(e) => e.preventDefault()}>

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Your Name</label>
                  <input type="text" placeholder="John Doe" value={form.name} onChange={set("name")}
                    className={inputClass} style={{ fontFamily: fonts.body }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Email Address</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
                    className={inputClass} style={{ fontFamily: fonts.body }} />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")}
                    className={inputClass} style={{ fontFamily: fonts.body }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium" style={{ fontFamily: fonts.body }}>Subject</label>
                  <input type="text" placeholder="How can we help?" value={form.subject} onChange={set("subject")}
                    className={inputClass} style={{ fontFamily: fonts.body }} />
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
                  className={`${inputClass} resize-none`}
                  style={{ fontFamily: fonts.body }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 text-white text-sm font-semibold rounded-xl transition-colors btn-red-inner-shadow"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                SEND MESSAGE
              </button>
            </form>

            {/* ── Right: info cards ── */}
            <div className="flex flex-col gap-5">

              {infoItems.map(({ icon: Icon, label, lines, isLink }) => (
                <div key={label} className="flex gap-4 items-start">
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
                          color: isLink ? colors.primary : "#6b7280",
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Working hours */}
              <div className="flex gap-4 items-start">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}18` }}
                >
                  <Clock size={18} style={{ color: colors.primary }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1.5 text-sm" style={{ fontFamily: fonts.body }}>
                    Working Hours
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: fonts.body }}>Mon – Sat &nbsp;&nbsp; 10:00 am – 7:00 pm</p>
                  <p className="text-sm text-gray-400" style={{ fontFamily: fonts.body }}>Sunday &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Closed</p>
                </div>
              </div>


            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
