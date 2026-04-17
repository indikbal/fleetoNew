import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { fonts } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompareTable from "@/components/sections/CompareTable";
import { fetchCompareModelPage, fetchProducts } from "@/lib/api";

export const metadata = {
  title: "Compare Models — Fleeto",
  description: "Compare Fleeto electric scooter models side by side.",
};

export default async function CompareModelPage() {
  const [data, products] = await Promise.all([fetchCompareModelPage(), fetchProducts()]);

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="COMPARE" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-5xl mx-auto space-y-5">
          {data?.content && (
            <div className="bg-white rounded-2xl p-8 sm:p-10">
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>
          )}

          <CompareTable products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
