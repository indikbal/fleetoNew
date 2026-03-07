import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import QuickConnect from "@/components/sections/QuickConnect";
import { fetchContactPage, extractMapSrc } from "@/lib/api";

export const metadata = {
  title: "Contact Us — Fleeto",
  description:
    "Get in touch with Fleeto for customer enquiries, dealership opportunities, and more.",
};

export default async function ContactPage() {
  const data = await fetchContactPage();
  const mapSrc = extractMapSrc(data.map);

  return (
    <>
      <Navbar />
      <main>
        <ContactFormSection
          bannerTitle={data.banner__title}
          formTitle={data.contact_form_title}
          formSubTitle={data.contact_form_sub_title}
          addressTitle={data.address_title}
          mailTitle={data.mail_us_title}
          telephoneTitle={data.telephone_title}
          workingHoursTitle={data.working_hours_title}
        />
        <QuickConnect
          sectionLabel={data.quick_connect_title}
          sectionTitle={data.quick_connect_sub_title}
          sectionHours={data.quick_connect_short_title}
          items={data.quick_connect}
        />

        {/* ── Full-width map ── */}
        {mapSrc && (
          <div style={{ height: "420px" }}>
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
