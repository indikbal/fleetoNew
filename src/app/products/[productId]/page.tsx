import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailView from "@/components/sections/ProductDetailView";
import ProductBanner from "@/components/sections/ProductBanner";
import RideEasy from "@/components/sections/RideEasy";
import AlwaysInSync from "@/components/sections/AlwaysInSync";
import FamilyAlbum from "@/components/sections/FamilyAlbum";
import SavingsCalculator from "@/components/sections/SavingsCalculator";
import FinanceYourWay from "@/components/sections/FinanceYourWay";
import Accessories from "@/components/sections/Accessories";
import ScootyReveal from "@/components/ui/ScootyReveal";
import EverythingYouNeed from "@/components/sections/EverythingYouNeed";
import { fetchProductDetails, fetchProductSpecs, fetchProductDetailsNew } from "@/lib/api";
import ProductSpecifications from "@/components/sections/ProductSpecifications";

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { productId } = await params;
  const product = await fetchProductDetails(parseInt(productId, 10));
  if (!product) return { title: "Product Not Found — Fleeto" };
  return {
    title:       `${product.title} — Fleeto`,
    description: `Explore the ${product.title} electric scooter by Fleeto.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params;
  const id = parseInt(productId, 10);
  if (isNaN(id)) notFound();

  const [product, specs, productDetailsNew] = await Promise.all([
    fetchProductDetails(id),
    fetchProductSpecs(id),
    fetchProductDetailsNew(id),
  ]);
  if (!product) notFound();

  const acf = product.acf;

  // Extract battery attributes from the new product-details endpoint
  const batteryAttributes = productDetailsNew?.attributes?.filter(
    (a) => a.attribute_name === "Battery Selection" || a.attribute_name === "Battery Selection (Smart)"
  );
  const warrantyText = productDetailsNew?.["4_years_warranty"]?.trim() ?? "";

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Full-screen banner with stats — same as explore page */}
        <ProductBanner
          stats={acf.banner_section}
          image={acf.banner_section_image}
          pricingUrl="#product-detail"
          testRideUrl={acf.book_your_test_ride_button_url}
        />

        {/* 2. Product info card — title, image, price, colour picker, add to cart */}
        <ProductDetailView
          product={product}
          batteryAttributes={batteryAttributes}
          warrantyText={warrantyText}
        />

        {/* 3. Explore sections from acf */}
        <RideEasy
          title={acf.ride_easy_section_title}
          mainImage={acf.ride_easy_section_image}
          features={acf.ride_easy_section}
        />
        <AlwaysInSync
          title={acf.always_in_sync_section_title}
          description={acf.always_in_sync_section_description}
          videoUrl={acf.always_in_sync_section_video_file}
        />
        <FamilyAlbum
          title={acf.the_familly_album_section_title}
          items={acf.the_familly_album_section}
        />

        {/* 4. Performance / Design / Technology specs */}
        {specs && <ProductSpecifications data={specs} />}

        <div className="relative">
          <SavingsCalculator
            title1={acf.calculator_section_title_1}
            title2={acf.calculator_section_title_2}
            title3={acf.calculator_section_title_3}
            title4={acf.calculator_section_title_4}
            description={acf.calculator_section_description}
            shortTitle={acf.calculator_section_short_title}
            longTitle={acf.calculator_section_long_title}
            longDescription={acf.calculator_section_long_description}
          />
          <FinanceYourWay
            sectionTitle={acf.finance_section_title}
            shortTitle={acf.finance_section_short_title}
            icon={acf.finance_section_icon}
            logos={acf.finance_section}
            features={acf.finance_section_description}
            emisTitle={acf.emis_as_low_as_title}
            emisPrice={acf.emis_as_low_as_price}
            emisButtonUrl={acf.emis_as_low_as_button_url}
          />
          <ScootyReveal image={acf.finance_section_image} />
        </div>

        <Accessories
          title={acf.accessories_your_fleeto_section_title}
          details={acf.accessories_your_fleeto_section_details}
          buttonUrl={acf.accessories_your_fleeto_section_button_url}
          image={acf.accessories_your_fleeto_section_image}
        />
        <EverythingYouNeed />
      </main>
      <Footer />
    </>
  );
}
