import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { fonts } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface PolicyData {
  title: string;
  content: string;
}

async function getData(): Promise<PolicyData | null> {
  try {
    const res = await fetch(
      `${process.env.WP_CUSTOM_URL}/refund-policy`,
      { next: { revalidate: 3600 } }
    );
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export default async function RefundPolicyPage() {
  const data = await getData();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="REFUND" />

      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10">
            {data?.content ? (
              <div
                className="text-sm text-gray-600 leading-relaxed [&>p]:mb-4 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:text-gray-900 [&>h2]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol>li]:mb-1"
                style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            ) : (
              <p className="text-sm text-gray-400" style={{ fontFamily: fonts.body }}>
                Content could not be loaded. Please try again later.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
