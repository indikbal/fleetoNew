import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsGrid from "@/components/sections/ProductsGrid";

export const metadata = {
  title: "Products — Fleeto",
  description:
    "Explore the full Fleeto electric scooter lineup. Find the perfect model for your daily commute.",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductsGrid />
      </main>
      <Footer />
    </>
  );
}
