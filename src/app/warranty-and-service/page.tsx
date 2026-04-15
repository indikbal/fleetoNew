import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { fetchWarrantyAndService, fetchFourYearsWarranty } from "@/lib/api";
import WarrantyContent from "@/components/sections/WarrantyContent";
import { ShieldCheck } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

export const metadata = {
  title: "Warranty & Service — Fleeto",
  description:
    "Warranty rules and service support for all Fleeto electric scooter models.",
};

export default async function WarrantyAndServicePage() {
  const [products, warrantyTexts] = await Promise.all([
    fetchWarrantyAndService(),
    fetchFourYearsWarranty(),
  ]);

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="WARRANTY & SERVICE" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 4-Years Warranty Badge */}
          {warrantyTexts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <ShieldCheck size={20} style={{ color: colors.primary }} />
                </div>
                <h2 className="text-lg font-semibold" style={{ ...styles.headingFont, color: colors.black }}>
                  Warranty Coverage
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {warrantyTexts.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: "#F7F7F7", border: "1px solid rgba(0,0,0,0.05)" }}
                  >
                    <ShieldCheck size={16} style={{ color: colors.primary }} className="flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: fonts.body }}>
                        {item.product_name}
                      </p>
                      <p className="text-xs font-medium" style={{ fontFamily: fonts.body, color: colors.primary }}>
                        {item["4_years_warranty"]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <WarrantyContent products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
