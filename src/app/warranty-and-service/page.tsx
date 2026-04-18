import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { fetchWarrantyAndService } from "@/lib/api";
import WarrantyContent from "@/components/sections/WarrantyContent";

export const metadata = {
  title: "Warranty & Service — Fleeto",
  description:
    "Warranty rules and service support for all Fleeto electric scooter models.",
};

export default async function WarrantyAndServicePage() {
  const products = await fetchWarrantyAndService();

  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="WARRANTY & SERVICE" />
      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-5xl mx-auto space-y-6">
          <WarrantyContent products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
