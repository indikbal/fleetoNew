import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeroBanner from "@/components/ui/PageHeroBanner";
import RegisterFleetoForm from "@/components/sections/RegisterFleetoForm";
import { colors, fonts, styles } from "@/config/theme";

export const metadata = {
  title: "Register Your Fleeto — Fleeto",
  description: "Register your Fleeto electric scooter for warranty and support.",
};

export default function RegisterYourFleetoPage() {
  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="REGISTER" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10">
            <div className="mb-8">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
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
              <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: fonts.body }}>
                Register your electric scooter to activate warranty coverage and access dedicated support.
              </p>
            </div>
            <RegisterFleetoForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
