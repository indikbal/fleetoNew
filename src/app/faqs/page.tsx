import PageHeroBanner from "@/components/ui/PageHeroBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FaqAccordion from "./FaqAccordion";
import { fetchFaqPage } from "@/lib/api";

export const metadata = {
  title: "FAQs — Fleeto",
  description: "Answers to the most common questions about Fleeto electric scooters.",
};

export default async function FaqsPage() {
  const faqs = await fetchFaqPage();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="FAQS" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={faqs} />
        </div>
      </main>
      <Footer />
    </>
  );
}
