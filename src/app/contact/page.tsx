import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import QuickConnect from "@/components/sections/QuickConnect";

export const metadata = {
  title: "Contact Us — Fleeto",
  description:
    "Get in touch with Fleeto for customer enquiries, dealership opportunities, and more.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactFormSection />
        <QuickConnect />

        {/* ── Full-width map ── */}
        <div style={{ height: "420px" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.7!2d88.3985!3d22.5094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275bb1234abcd%3A0xef01234567890abc!2sRajdanga+Main+Rd%2C+Kolkata%2C+West+Bengal+700107!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
