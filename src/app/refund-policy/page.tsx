import InnerPageBanner from "@/components/ui/InnerPageBanner";
import { RotateCcw } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <InnerPageBanner
        title="Refund Policy"
        subtitle="Our terms for returns, exchanges, and refunds"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Refund Policy" }]}
        icon={<RotateCcw size={22} style={{ color: colors.primary }} />}
      />

      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10 space-y-8">

            <Section title="1. Eligibility for Refund">
              <p>Refund requests must be raised within 7 days of delivery. Products must be unused, in their original packaging, and accompanied by the original invoice. Refunds are not applicable on products that have been registered with the RTO.</p>
            </Section>

            <Section title="2. Non-Refundable Items">
              <p>The following are not eligible for refunds: accessories, spare parts, helmets, and any product that has been used or damaged after delivery. Booking amounts for test rides are also non-refundable.</p>
            </Section>

            <Section title="3. Refund Process">
              <p>To initiate a refund, contact our support team at <a href="mailto:support@fleeto.in" style={{ color: colors.primary }}>support@fleeto.in</a> with your order ID and reason for return. Our team will review your request within 3–5 business days and provide further instructions.</p>
            </Section>

            <Section title="4. Refund Timeline">
              <p>Once your return is approved and the product is received and inspected, we will process your refund within 7–10 business days. The amount will be credited to your original payment method.</p>
            </Section>

            <Section title="5. Exchange Policy">
              <p>We offer exchanges for manufacturing defects reported within 30 days of purchase. Exchanges are subject to availability of the requested variant. Transportation charges for exchange may apply.</p>
            </Section>

            <Section title="6. Warranty Claims">
              <p>Warranty claims are handled separately from refund requests. All Fleeto vehicles come with a manufacturer warranty. Please refer to your warranty card or contact your nearest service center for warranty-related issues.</p>
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
