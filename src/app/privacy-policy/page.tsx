import InnerPageBanner from "@/components/ui/InnerPageBanner";
import { Shield } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <InnerPageBanner
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        icon={<Shield size={22} style={{ color: colors.primary }} />}
      />

      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10 space-y-8">

            <Section title="1. Information We Collect">
              <p>We collect information you provide directly to us, such as your name, email address, phone number, and billing details when you register an account, place an order, or contact us. We also collect usage data automatically when you interact with our website.</p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use the information we collect to process your orders, send you transactional and promotional emails, improve our services, and comply with legal obligations. We do not sell your personal data to third parties.</p>
            </Section>

            <Section title="3. Cookies">
              <p>Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookies through your browser settings, though disabling them may affect certain features of our site.</p>
            </Section>

            <Section title="4. Data Security">
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
            </Section>

            <Section title="5. Third-Party Services">
              <p>We may share your information with trusted third-party service providers (such as payment processors and shipping partners) who assist us in operating our website and conducting our business. These parties are obligated to keep your information confidential.</p>
            </Section>

            <Section title="6. Your Rights">
              <p>You have the right to access, correct, or delete your personal information at any time. To exercise these rights, please contact us at <a href="mailto:support@fleeto.in" style={{ color: colors.primary }}>support@fleeto.in</a>.</p>
            </Section>

            <Section title="7. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.</p>
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
