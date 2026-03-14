import InnerPageBanner from "@/components/ui/InnerPageBanner";
import { BookOpen, Download, Play, FileText } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const resources = [
  {
    icon: <FileText size={20} style={{ color: colors.primary }} />,
    category: "User Manuals",
    title: "Fleeto Aayan-SMART Owner's Manual",
    description: "Complete guide to operating, maintaining, and troubleshooting your Fleeto Aayan-SMART electric scooter.",
    type: "PDF",
  },
  {
    icon: <FileText size={20} style={{ color: colors.primary }} />,
    category: "User Manuals",
    title: "Fleeto Aayan-PRO Owner's Manual",
    description: "Detailed documentation for Fleeto Aayan-PRO owners including safety guidelines and service schedules.",
    type: "PDF",
  },
  {
    icon: <Download size={20} style={{ color: colors.primary }} />,
    category: "Brochures",
    title: "Fleeto Product Catalogue 2026",
    description: "Explore the full Fleeto electric scooter lineup with specifications, color options, and pricing.",
    type: "PDF",
  },
  {
    icon: <Play size={20} style={{ color: colors.primary }} />,
    category: "Video Guides",
    title: "How to Charge Your Fleeto Scooter",
    description: "Step-by-step video guide on charging best practices to maximize battery life and performance.",
    type: "Video",
  },
  {
    icon: <Play size={20} style={{ color: colors.primary }} />,
    category: "Video Guides",
    title: "First Ride Setup & Safety Tips",
    description: "Everything you need to know before your first ride — mirrors, lights, brakes, and road safety.",
    type: "Video",
  },
  {
    icon: <BookOpen size={20} style={{ color: colors.primary }} />,
    category: "Guides",
    title: "EV Subsidy & Government Schemes",
    description: "A comprehensive guide to FAME II subsidies and state-level EV incentives available in India.",
    type: "Article",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <InnerPageBanner
        title="Resources"
        subtitle="Manuals, brochures, guides and everything you need"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        icon={<BookOpen size={22} style={{ color: colors.primary }} />}
      />

      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${colors.primary}12` }}
                >
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: colors.primary, fontFamily: fonts.body }}
                  >
                    {r.category}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-1 mb-1.5" style={{ fontFamily: fonts.body }}>
                    {r.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3" style={{ fontFamily: fonts.body }}>
                    {r.description}
                  </p>
                  <span
                    className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${colors.primary}12`, color: colors.primary, fontFamily: fonts.body }}
                  >
                    {r.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-10" style={{ fontFamily: fonts.body }}>
            More resources coming soon. Contact us at{" "}
            <a href="mailto:support@fleeto.in" style={{ color: colors.primary }}>support@fleeto.in</a>
            {" "}for specific documents.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
