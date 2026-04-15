import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchFindADealerPage } from "@/lib/api";
import StoreLocator from "@/components/sections/StoreLocator";

export const metadata = {
  title: "Find a Dealer — Fleeto",
  description: "Locate your nearest Fleeto authorised dealer or service centre.",
};

export default async function FindADealerPage() {
  const data = await fetchFindADealerPage();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="DEALER" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto space-y-5">
          {data?.content && (
            <div className="bg-white rounded-2xl p-8 sm:p-10">
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
          )}

          {/* Store Locator — cascading filter */}
          <StoreLocator />

          <div className="bg-white rounded-2xl p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl mb-2" style={{ ...styles.headingFont, color: "#010101" }}>Can&apos;t Find a Dealer Near You?</h2>
                <p className="text-sm text-gray-500" style={{ fontFamily: fonts.body }}>
                  Contact us and we&apos;ll help you find the nearest authorised point or arrange a home demo.
                </p>
              </div>
              <Link href="/contact" className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}>
                Contact Us <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#010101" }}>
            <h3 className="text-2xl text-white mb-2" style={styles.headingFont}>Interested in Becoming a Dealer?</h3>
            <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: fonts.body }}>
              Join the Fleeto dealer network and grow with India&apos;s EV revolution.
            </p>
            <Link href="/retails-partnership" className="inline-flex items-center gap-2 px-8 py-3.5 text-white text-sm font-semibold rounded-full"
              style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}>
              Learn More <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
