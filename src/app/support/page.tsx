import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { colors, fonts } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchSupportPage } from "@/lib/api";

export const metadata = {
  title: "Support — Fleeto",
  description: "Get help and support for your Fleeto electric scooter.",
};

export default async function SupportPage() {
  const data = await fetchSupportPage();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="SUPPORT" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto space-y-5">
          {data?.content && (
            <div className="bg-white rounded-2xl p-8 sm:p-10">
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "FAQs", href: "/faqs", desc: "Common questions answered" },
              { label: "Resources", href: "/resources", desc: "Manuals & guides" },
              { label: "Contact Us", href: "/contact", desc: "Reach our support team" },
              { label: "Register Your Fleeto", href: "/register-your-fleeto", desc: "Activate your warranty" },
              { label: "Raise Service Issue", href: "/raise-service-issue", desc: "Report a problem" },
              { label: "Find a Dealer", href: "/find-a-dealer", desc: "Locate nearby dealers" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow block">
                <p className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: fonts.body }}>{item.label}</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
