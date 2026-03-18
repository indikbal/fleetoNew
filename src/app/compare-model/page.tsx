import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchCompareModelPage, fetchProducts, formatPrice } from "@/lib/api";

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
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
          )}

          {products.length > 0 && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "#FFF5F5" }}>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: colors.primary, fontFamily: fonts.body, minWidth: "140px" }}>
                        Feature
                      </th>
                      {products.map((p) => (
                        <th key={p.id} className="text-center px-6 py-4 text-sm font-semibold"
                          style={{ color: "#010101", fontFamily: fonts.body, minWidth: "160px" }}>
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-100">
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: fonts.body }}>Price</td>
                      {products.map((p) => (
                        <td key={p.id} className="px-6 py-4 text-center">
                          <span className="text-sm font-bold" style={{ color: colors.primary, fontFamily: fonts.body }}>{formatPrice(p.price)}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-100" style={{ backgroundColor: "#FAFAFA" }}>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: fonts.body }}>Colours</td>
                      {products.map((p) => (
                        <td key={p.id} className="px-6 py-4 text-center text-sm text-gray-600" style={{ fontFamily: fonts.body }}>
                          {p.variation_colors.length > 0 ? `${p.variation_colors.length} options` : "—"}
                        </td>
                      ))}
                    </tr>
                    {(() => {
                      const allAttrs = new Set<string>();
                      products.forEach(p => p.attributes.filter(a => !["color","colour"].includes(a.name.toLowerCase())).forEach(a => allAttrs.add(a.name)));
                      return Array.from(allAttrs).map((attrName, idx) => (
                        <tr key={attrName} className="border-t border-gray-100" style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: fonts.body }}>{attrName}</td>
                          {products.map((p) => {
                            const attr = p.attributes.find(a => a.name === attrName);
                            return <td key={p.id} className="px-6 py-4 text-center text-sm text-gray-600" style={{ fontFamily: fonts.body }}>{attr ? attr.options.join(", ") : "—"}</td>;
                          })}
                        </tr>
                      ));
                    })()}
                    <tr className="border-t border-gray-100">
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: fonts.body }}>Details</td>
                      {products.map((p) => (
                        <td key={p.id} className="px-6 py-4 text-center">
                          <Link href={`/products/${p.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full text-white"
                            style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}>
                            View <ArrowUpRight size={12} />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
