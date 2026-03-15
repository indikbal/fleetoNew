import InnerPageBanner from "@/components/ui/InnerPageBanner";
import { FileText } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsConditionsPage() {
  return (
    <>
      <Navbar />
      <InnerPageBanner
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our services"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
        icon={<FileText size={22} style={{ color: colors.primary }} />}
      />

      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10 space-y-8">

            <Section title="1. Acceptance of Terms">
              <p>By accessing or using the Fleeto website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
            </Section>

            <Section title="2. Use of Website">
              <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You must not use our website to distribute unsolicited commercial communications or engage in any fraudulent activity.</p>
            </Section>

            <Section title="3. Product Information">
              <p>We strive to display product information, specifications, and prices as accurately as possible. However, we reserve the right to correct any errors and update information at any time without prior notice. Prices are subject to change without notice.</p>
            </Section>

            <Section title="4. Orders and Payments">
              <p>All orders are subject to availability and acceptance. We reserve the right to refuse or cancel any order at our discretion. Payment must be completed before the product is dispatched. We accept major credit/debit cards, UPI, and net banking.</p>
            </Section>

            <Section title="5. Intellectual Property">
              <p>All content on this website, including text, graphics, logos, images, and software, is the property of Fleetworth Automotives Pvt. Ltd. and is protected by applicable intellectual property laws. You may not reproduce or redistribute any content without our prior written consent.</p>
            </Section>

            <Section title="6. Limitation of Liability">
              <p>Fleetworth Automotives Pvt. Ltd. shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the purchase price of the product in question.</p>
            </Section>

            <Section title="7. Governing Law">
              <p>These Terms and Conditions are governed by the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of West Bengal, India.</p>
            </Section>

            <Section title="8. Changes to Terms">
              <p>We reserve the right to modify these Terms and Conditions at any time. Continued use of our website after any changes constitutes your acceptance of the new terms.</p>
            </Section>

            <p className="text-xs text-gray-400 border-t border-gray-100 pt-6" style={{ fontFamily: fonts.body }}>
              Last updated: March 2026
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg mb-3" style={{ ...styles.headingFont, color: "#010101" }}>{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2" style={{ fontFamily: fonts.body }}>
        {children}
      </div>
    </div>
  );
}
