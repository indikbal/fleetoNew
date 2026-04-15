import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { CheckCircle } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchRetailsPartnershipPage, stripHtml } from "@/lib/api";
import BecomeADealerForm from "@/components/sections/BecomeADealerForm";

const benefits = [
  "Exclusive dealership territory rights",
  "Comprehensive training and onboarding support",
  "Marketing and branding material provided",
  "Attractive dealer margins and incentive schemes",
  "After-sales service and spare parts support",
  "Access to Fleeto's growing customer base",
  "Dedicated relationship manager",
  "Regular product updates and new model launches",
];

const steps = [
  { step: "01", title: "Apply Online", desc: "Fill out our partnership enquiry form with your business details and preferred location." },
  { step: "02", title: "Initial Review", desc: "Our team reviews your application and contacts you within 5 business days." },
  { step: "03", title: "Site Evaluation", desc: "We conduct a site visit to assess your showroom location and infrastructure." },
  { step: "04", title: "Agreement & Onboarding", desc: "Sign the dealership agreement and complete the onboarding and training program." },
];

export default async function RetailsPartnershipPage() {
  const data = await fetchRetailsPartnershipPage();
  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="PARTNER" />

      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Intro */}
          <div className="bg-white rounded-2xl p-8 sm:p-10">
            <h2 className="text-2xl mb-4" style={{ ...styles.headingFont, color: "#010101" }}>
              Become a Fleeto Dealer
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: fonts.body }}>
              {data?.content ? stripHtml(data.content) : "Fleeto is expanding its dealer network across India. Partner with us and be part of the EV revolution."}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl p-8 sm:p-10">
            <h2 className="text-xl mb-6" style={{ ...styles.headingFont, color: "#010101" }}>
              Why Partner with Fleeto?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                  <span className="text-sm text-gray-600" style={{ fontFamily: fonts.body }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl p-8 sm:p-10">
            <h2 className="text-xl mb-6" style={{ ...styles.headingFont, color: "#010101" }}>
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ backgroundColor: `${colors.primary}12`, color: colors.primary, fontFamily: fonts.body }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: fonts.body }}>{s.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily: fonts.body }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Become a Dealer Form */}
          <div className="bg-white rounded-2xl p-8 sm:p-10">
            <div className="mb-8">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: colors.primary, fontFamily: fonts.body }}
              >
                Apply Now
              </p>
              <h2
                className="text-2xl mb-2"
                style={{ ...styles.headingFont, color: "#010101" }}
              >
                Become a Fleeto Dealer
              </h2>
              <p className="text-sm text-gray-400" style={{ fontFamily: fonts.body }}>
                Fill out the form below and our partnership team will get in touch.
              </p>
            </div>
            <BecomeADealerForm />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
