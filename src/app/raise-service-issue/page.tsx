import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeroBanner from "@/components/ui/PageHeroBanner";
import RaiseServiceIssueForm from "@/components/sections/RaiseServiceIssueForm";
import { colors, fonts, styles } from "@/config/theme";

export const metadata = {
  title: "Raise Service Issue — Fleeto",
  description: "Report a service issue with your Fleeto electric scooter.",
};

export default function RaiseServiceIssuePage() {
  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="SERVICE" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10">
            <div className="mb-8">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: colors.primary, fontFamily: fonts.body }}
              >
                Service Support
              </p>
              <h2
                className="text-2xl md:text-3xl mb-2"
                style={{ ...styles.headingFont, color: colors.black }}
              >
                Raise a Service Issue
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: fonts.body }}>
                Having trouble with your Fleeto? Submit the details below and our service team will reach out.
              </p>
            </div>
            <RaiseServiceIssueForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
