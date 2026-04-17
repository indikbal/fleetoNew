import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeroBanner from "@/components/ui/PageHeroBanner";
import RegisterFleetoForm from "@/components/sections/RegisterFleetoForm";
import { colors, fonts, styles } from "@/config/theme";
import {
  ShieldCheck,
  Headphones,
  BellRing,
  BadgeCheck,
  ArrowUpRight,
  Phone,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Register Your Fleeto — Fleeto",
  description: "Register your Fleeto electric scooter for warranty and support.",
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Activate Warranty",
    desc: "Unlock full warranty coverage on your scooter and battery.",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    desc: "Access dedicated customer care and fast service response.",
  },
  {
    icon: BellRing,
    title: "Service Alerts",
    desc: "Get timely reminders for maintenance and software updates.",
  },
];

const needList = [
  "Customer details",
  "Invoice number & date",
  "Dealer details",
  "Chassis number",
  "Battery number(s)",
];

export default function RegisterYourFleetoPage() {
  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="REGISTER" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ─── Benefits strip ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="group rounded-2xl p-4 sm:p-5 border transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #FFFBFB 100%)",
                    borderColor: "#F2D4D4",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      }}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4
                        className="text-sm font-bold text-gray-900 mb-0.5"
                        style={{ fontFamily: fonts.body }}
                      >
                        {b.title}
                      </h4>
                      <p
                        className="text-xs text-gray-500 leading-relaxed"
                        style={{ fontFamily: fonts.body }}
                      >
                        {b.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── Form card with side panel ──────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            {/* Side info panel */}
            <aside className="lg:sticky lg:top-6 self-start space-y-4">
              <div
                className="rounded-3xl p-6 relative overflow-hidden border shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #FFF5F5 100%)",
                  borderColor: "#F2D4D4",
                }}
              >
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <p
                    className="text-[11px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: colors.primary, fontFamily: fonts.body }}
                  >
                    What you&apos;ll need
                  </p>
                  <h3
                    className="text-lg font-bold mb-4 leading-tight"
                    style={{ ...styles.headingFont, color: colors.black }}
                  >
                    Keep these handy before you start
                  </h3>
                  <ul className="space-y-2.5">
                    {needList.map((n) => (
                      <li key={n} className="flex items-start gap-2.5">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${colors.primary}15` }}
                        >
                          <BadgeCheck size={12} style={{ color: colors.primary }} />
                        </span>
                        <span
                          className="text-sm text-gray-700"
                          style={{ fontFamily: fonts.body }}
                        >
                          {n}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className="rounded-3xl p-6 text-center relative overflow-hidden"
                style={{
                  background:
                    "radial-gradient(ellipse at top left, #2D0000 0%, #010101 70%)",
                }}
              >
                <div
                  className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className="w-11 h-11 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <Phone size={18} className="text-white" />
                  </div>
                  <p
                    className="text-[11px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: colors.primaryLight, fontFamily: fonts.body }}
                  >
                    Need help?
                  </p>
                  <h4
                    className="text-sm text-white font-bold mb-2"
                    style={{ fontFamily: fonts.body }}
                  >
                    Our team is here for you
                  </h4>
                  <p
                    className="text-[11px] text-gray-400 mb-4 leading-relaxed"
                    style={{ fontFamily: fonts.body }}
                  >
                    Stuck on a detail? Our support team will walk you through registration.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full text-white"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      fontFamily: fonts.body,
                    }}
                  >
                    Contact Us <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <div className="mb-8">
                <p
                  className="text-[11px] font-semibold tracking-widest uppercase mb-2"
                  style={{ color: colors.primary, fontFamily: fonts.body }}
                >
                  Product Registration
                </p>
                <h2
                  className="text-2xl md:text-3xl mb-2"
                  style={{ ...styles.headingFont, color: colors.black }}
                >
                  Register Your Fleeto
                </h2>
                <p
                  className="text-sm text-gray-500 leading-relaxed"
                  style={{ fontFamily: fonts.body }}
                >
                  Fill in the details below to activate warranty and unlock Fleeto&apos;s
                  full support ecosystem.
                </p>
              </div>
              <RegisterFleetoForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
