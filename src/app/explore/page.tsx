import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductBanner from "@/components/sections/ProductBanner";
import RideEasy from "@/components/sections/RideEasy";
import AlwaysInSync from "@/components/sections/AlwaysInSync";
import FamilyAlbum from "@/components/sections/FamilyAlbum";
import SavingsCalculator from "@/components/sections/SavingsCalculator";
import FinanceYourWay from "@/components/sections/FinanceYourWay";
import Accessories from "@/components/sections/Accessories";
import ScootyReveal from "@/components/ui/ScootyReveal";
import EverythingYouNeed from "@/components/sections/EverythingYouNeed";
import { fetchExplorePage } from "@/lib/api";

export const metadata = {
  title: "Explore — Fleeto",
  description: "Explore the Fleeto electric scooter — features, savings calculator, finance options, and accessories.",
};

export default async function ExplorePage() {
  const data = await fetchExplorePage();

  return (
    <>
      <Navbar />
      <main>
        <ProductBanner
          stats={data.banner_section}
          image={data.banner_section_image}
          pricingUrl={data.pricing_button_url}
          testRideUrl={data.book_your_test_ride_button_url}
        />
        <RideEasy
          title={data.ride_easy_section_title}
          mainImage={data.ride_easy_section_image}
          features={data.ride_easy_section}
        />
        <AlwaysInSync
          title={data.always_in_sync_section_title}
          description={data.always_in_sync_section_description}
          videoUrl={data.always_in_sync_section_video_file}
        />fre
        <FamilyAlbum
          title={data.the_familly_album_section_title}
          items={data.the_familly_album_section}
        />

        {/* ── Calculator + Finance wrapper — scooty straddles their boundary ── */}
        <div className="relative">
          <SavingsCalculator
            title1={data.calculator_section_title_1}
            title2={data.calculator_section_title_2}
            title3={data.calculator_section_title_3}
            title4={data.calculator_section_title_4}
            description={data.calculator_section_description}
            shortTitle={data.calculator_section_short_title}
            longTitle={data.calculator_section_long_title}
            longDescription={data.calculator_section_long_description}
          />
          <FinanceYourWay
            sectionTitle={data.finance_section_title}
            shortTitle={data.finance_section_short_title}
            icon={data.finance_section_icon}
            logos={data.finance_section}
            features={data.finance_section_description}
            emisTitle={data.emis_as_low_as_title}
            emisPrice={data.emis_as_low_as_price}
            emisButtonUrl={data.emis_as_low_as_button_url}
          />

          {/* Scooty — slides in from left at the section boundary */}
          <ScootyReveal image={data.finance_section_image} />
        </div>

        <Accessories
          title={data.accessories_your_fleeto_section_title}
          details={data.accessories_your_fleeto_section_details}
          buttonUrl={data.accessories_your_fleeto_section_button_url}
          image={data.accessories_your_fleeto_section_image}
        />
        <EverythingYouNeed />
      </main>
      <Footer />
    </>
  );
}
