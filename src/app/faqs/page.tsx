import InnerPageBanner from "@/components/ui/InnerPageBanner";
import { HelpCircle } from "lucide-react";
import { colors } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FaqAccordion from "./FaqAccordion";

export const metadata = {
  title: "FAQs — Fleeto",
  description: "Answers to the most common questions about Fleeto electric scooters.",
};

export default function FaqsPage() {
  return (
    <>
      <Navbar />
      <InnerPageBanner
        title="FAQs"
        subtitle="Answers to the most common questions about Fleeto"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
        icon={<HelpCircle size={22} style={{ color: colors.primary }} />}
      />

      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion />
        </div>
      </main>

      <Footer />
    </>
  );
}
