import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FutureOfElectric from "@/components/sections/FutureOfElectric";
import CollectionLineup from "@/components/sections/CollectionLineup";
import EffortlessRiding from "@/components/sections/EffortlessRiding";
import RideSmarter from "@/components/sections/RideSmarter";
import WhyRidersChoose from "@/components/sections/WhyRidersChoose";
import EverythingYouNeed from "@/components/sections/EverythingYouNeed";
import AppDownload from "@/components/sections/AppDownload";
import { fetchHomePage, fetchProducts } from "@/lib/api";

export default async function Home() {
  const [homeData, products] = await Promise.all([
    fetchHomePage(),
    fetchProducts(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection
          slides={homeData.banner_section}
          socialLinks={homeData.banner_section_social_media}
        />
        <FutureOfElectric
          title1={homeData.the_future_of_electric_section_title_1}
          title2={homeData.the_future_of_electric_section_title_2}
          title3={homeData.the_future_of_electric_section_title_3}
          description={homeData.the_future_of_electric_section_description}
          image={homeData.the_future_of_electric_section_image}
          buttons={homeData.the_future_of_electric_section}
        />
        <CollectionLineup
          title1={homeData.fleeto_collection_lineup_section_title_1}
          title2={homeData.fleeto_collection_lineup_section_title_2}
          products={products}
        />
        <EffortlessRiding
          title1={homeData.effortless_riding_section_title_1}
          title2={homeData.effortless_riding_section_title_2}
          title3={homeData.effortless_riding_section_title_3}
          cards={homeData.effortless_riding_section}
        />
        <RideSmarter
          title1={homeData.ride_smarter_with_fleeto_electric_scooters_section_title_1}
          title2={homeData.ride_smarter_with_fleeto_electric_scooters_section_title_2}
          title3={homeData.ride_smarter_with_fleeto_electric_scooters_section_title_3}
          description={homeData.ride_smarter_with_fleeto_electric_scooters_section_description}
          image={homeData.ride_smarter_with_fleeto_electric_scooters_section_image}
          buttonUrl={homeData.ride_smarter_with_fleeto_electric_scooters_section_button_url}
        />
        <WhyRidersChoose
          title1={homeData.why_riders_choose_fleeto_section_title_1}
          title2={homeData.why_riders_choose_fleeto_section_title_2}
          description={homeData.why_riders_choose_fleeto_section_description}
          image={homeData.why_riders_choose_fleeto_section_image}
          features={homeData.why_riders_choose_fleeto_section}
          ctaTitle={homeData.call_us_or_book_your_ride_instantly_title}
          ctaNumber={homeData.call_us_or_book_your_ride_instantly_number}
          ctaButtonUrl={homeData.call_us_or_book_your_ride_instantly_button_url}
        />
        <EverythingYouNeed
          title1={homeData.everything_you_need_to_know_about_fleeto_section_title_1}
          title2={homeData.everything_you_need_to_know_about_fleeto_section_title_2}
          faqs={homeData.everything_you_need_to_know_about_fleeto_section}
        />
        <AppDownload />
      </main>
      <Footer />
    </>
  );
}
