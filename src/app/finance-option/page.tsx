import PageHeroBanner from "@/components/ui/PageHeroBanner";
import {
  ArrowUpRight,
  Wallet,
  Percent,
  BadgeCheck,
  Calendar,
  Building2,
  Zap,
  FileCheck,
  UserCheck,
  Bike,
} from "lucide-react";
import Link from "next/link";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchFinanceOptionPage } from "@/lib/api";

export const metadata = {
  title: "Finance Options — Fleeto",
  description: "Flexible EMI and finance options to own your Fleeto electric scooter.",
};

const stats = [
  { value: "0%", label: "Down Payment" },
  { value: "3.99%", label: "Starting Interest" },
  { value: "5 Yrs", label: "Max Tenure" },
  { value: "24 hrs", label: "Quick Approval" },
];

const features = [
  {
    icon: Wallet,
    title: "Zero Down Payment",
    desc: "Ride home today — pay nothing upfront on select plans.",
  },
  {
    icon: Percent,
    title: "From 3.99% Interest",
    desc: "Industry-leading rates negotiated through our banking partners.",
  },
  {
    icon: BadgeCheck,
    title: "Simplified Approval",
    desc: "Minimal paperwork, fast verification, and clear eligibility checks.",
  },
  {
    icon: Calendar,
    title: "Flexible Tenure",
    desc: "Spread your EMIs across terms up to 5 years to suit your budget.",
  },
  {
    icon: Building2,
    title: "Trusted Bank Network",
    desc: "SBI, HDFC, ICICI, Bajaj Finserv and more — all in one place.",
  },
  {
    icon: Zap,
    title: "Quick Online Application",
    desc: "Apply from your phone and receive an instant eligibility response.",
  },
];

const steps = [
  {
    icon: FileCheck,
    title: "Choose Your Ride",
    desc: "Pick a Fleeto model and preferred variant at our store or online.",
  },
  {
    icon: UserCheck,
    title: "Apply for Finance",
    desc: "Share basic KYC — we match you with the right partner in minutes.",
  },
  {
    icon: Bike,
    title: "Ride Home",
    desc: "On approval, complete delivery and start riding your new scooter.",
  },
];

const samplePlans = [
  { onRoad: "₹90,000", down: "₹0", tenure: "24 months", emi: "₹4,050" },
  { onRoad: "₹90,000", down: "₹10,000", tenure: "36 months", emi: "₹2,650" },
  { onRoad: "₹90,000", down: "₹15,000", tenure: "60 months", emi: "₹1,780" },
];

export default async function FinanceOptionPage() {
  const data = await fetchFinanceOptionPage();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="FINANCE" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ─── CMS intro ──────────────────────────────────────────── */}
          {data?.content && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>
          )}

          {/* ─── Stats band ─────────────────────────────────────────── */}
          <div
            className="rounded-3xl p-6 sm:p-8 shadow-sm border relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
              borderColor: "transparent",
            }}
          >
            {/* Decorative blobs */}
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 relative">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-2xl sm:text-4xl font-extrabold text-white mb-1 leading-none"
                    style={{ fontFamily: fonts.display, letterSpacing: "1px" }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "#FFE8E8", fontFamily: fonts.body }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Why Finance with Fleeto? ───────────────────────────── */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="mb-6 sm:mb-8">
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-2"
                style={{ color: colors.primary, fontFamily: fonts.body }}
              >
                Benefits
              </p>
              <h2
                className="text-xl sm:text-2xl"
                style={{ ...styles.headingFont, color: colors.black }}
              >
                Why Finance with Fleeto?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="group rounded-2xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, #ffffff 0%, #FFFBFB 100%)",
                      borderColor: "#F2D4D4",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                        }}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className="text-sm font-bold text-gray-900 mb-1 leading-snug"
                          style={{ fontFamily: fonts.body }}
                        >
                          {f.title}
                        </h4>
                        <p
                          className="text-xs sm:text-[13px] text-gray-500 leading-relaxed"
                          style={{ fontFamily: fonts.body }}
                        >
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── How it works ───────────────────────────────────────── */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="mb-6 sm:mb-8 text-center">
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-2"
                style={{ color: colors.primary, fontFamily: fonts.body }}
              >
                How it works
              </p>
              <h2
                className="text-xl sm:text-2xl"
                style={{ ...styles.headingFont, color: colors.black }}
              >
                Three Steps to Ownership
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="relative text-center">
                    {/* Dashed connector (desktop only, between cards) */}
                    {i < steps.length - 1 && (
                      <div
                        className="hidden sm:block absolute top-8 -right-4 w-8 border-t-2 border-dashed"
                        style={{ borderColor: "#F2D4D4" }}
                      />
                    )}
                    <div
                      className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md relative"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      }}
                    >
                      <Icon size={26} className="text-white" />
                      <span
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm"
                        style={{
                          backgroundColor: "#fff",
                          color: colors.primary,
                          fontFamily: fonts.body,
                          border: `2px solid ${colors.primary}`,
                        }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <h4
                      className="text-sm sm:text-base font-bold text-gray-900 mb-1"
                      style={{ fontFamily: fonts.body }}
                    >
                      {s.title}
                    </h4>
                    <p
                      className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-[220px] mx-auto"
                      style={{ fontFamily: fonts.body }}
                    >
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Sample EMI plans ───────────────────────────────────── */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div
              className="px-6 sm:px-10 py-5 border-b border-gray-100"
              style={{ background: "linear-gradient(90deg, #FFF5F5 0%, #ffffff 100%)" }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-1"
                style={{ color: colors.primary, fontFamily: fonts.body }}
              >
                Sample plans
              </p>
              <h2
                className="text-xl sm:text-2xl"
                style={{ ...styles.headingFont, color: colors.black }}
              >
                Estimate Your EMI
              </h2>
              <p
                className="text-xs text-gray-500 mt-1"
                style={{ fontFamily: fonts.body }}
              >
                Illustrative figures. Final EMI depends on the lender, tenure, and eligibility.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr style={{ backgroundColor: "#FAFAFA" }}>
                    {["On-Road Price", "Down Payment", "Tenure", "Monthly EMI"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-500"
                        style={{ fontFamily: fonts.body }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {samplePlans.map((p, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-100 hover:bg-[#FFFBFB] transition-colors"
                    >
                      <td
                        className="px-6 py-4 text-sm font-semibold text-gray-900"
                        style={{ fontFamily: fonts.body }}
                      >
                        {p.onRoad}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-600"
                        style={{ fontFamily: fonts.body }}
                      >
                        {p.down}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-600"
                        style={{ fontFamily: fonts.body }}
                      >
                        {p.tenure}
                      </td>
                      <td
                        className="px-6 py-4 text-sm sm:text-base font-extrabold whitespace-nowrap"
                        style={{ color: colors.primary, fontFamily: fonts.body }}
                      >
                        {p.emi}
                        <span className="text-xs font-medium text-gray-400">/mo</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── CTA ────────────────────────────────────────────────── */}
          <div
            className="rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at top left, #2D0000 0%, #010101 60%)",
            }}
          >
            <div
              className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
              }}
            />
            <div className="relative">
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-3"
                style={{ color: colors.primaryLight, fontFamily: fonts.body }}
              >
                Ready to ride?
              </p>
              <h3
                className="text-2xl sm:text-3xl text-white mb-3"
                style={styles.headingFont}
              >
                Your Fleeto is one application away.
              </h3>
              <p
                className="text-gray-400 text-sm mb-6 max-w-md mx-auto"
                style={{ fontFamily: fonts.body }}
              >
                Apply for finance online or speak to our team — we&apos;ll handle the
                paperwork so you can focus on riding.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white text-sm font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                    fontFamily: fonts.body,
                    ...styles.redButtonShadow,
                  }}
                >
                  Talk to Us <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-colors"
                  style={{ fontFamily: fonts.body }}
                >
                  Browse Scooters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
