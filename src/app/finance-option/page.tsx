import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { CheckCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchFinanceOptionPage } from "@/lib/api";

export const metadata = {
  title: "Finance Options — Fleeto",
  description: "Flexible EMI and finance options to own your Fleeto electric scooter.",
};

const features = [
  "Zero down payment options",
  "Interest rates as low as 3.99%",
  "Simplified approval process",
  "Tenure as long as 5 years",
  "Available across all major banks",
  "Quick online application",
];

export default async function FinanceOptionPage() {
  const data = await fetchFinanceOptionPage();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="FINANCE" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto space-y-5">
          {data?.content && (
            <div className="bg-white rounded-2xl p-8 sm:p-10">
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
          )}
          <div className="bg-white rounded-2xl p-8 sm:p-10">
            <h2 className="text-xl mb-6" style={{ ...styles.headingFont, color: "#010101" }}>Why Finance with Fleeto?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                  <span className="text-sm text-gray-600" style={{ fontFamily: fonts.body }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#010101" }}>
            <h3 className="text-2xl text-white mb-2" style={styles.headingFont}>Ready to Ride?</h3>
            <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: fonts.body }}>Apply for finance online or speak to our team.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 text-white text-sm font-semibold rounded-full"
              style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}>
              Talk to Us <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
