import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsGrid from "@/components/sections/ProductsGrid";
import { fetchShopPage, fetchProducts } from "@/lib/api";

export const metadata = {
  title: "Products — Fleeto",
  description:
    "Explore the full Fleeto electric scooter lineup. Find the perfect model for your daily commute.",
};

export default async function ProductsPage() {
  const [shopData, products] = await Promise.all([
    fetchShopPage(),
    fetchProducts(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <ProductsGrid shopData={shopData} products={products} />
      </main>
      <Footer />
    </>
  );
}
