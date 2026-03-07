import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/AboutHero";
import AboutStats from "@/components/sections/AboutStats";
import AboutFeatures from "@/components/sections/AboutFeatures";
import { fetchAboutPage } from "@/lib/api";

export const metadata = {
  title: "About Us — Fleeto",
  description:
    "Learn about Fleeto's mission to redefine urban mobility with eco-friendly, stylish electric scooters for the modern Indian commuter.",
};

export default async function AboutPage() {
  const data = await fetchAboutPage();

  return (
    <>
      <Navbar />
      <main>
        <AboutHero
          bannerTitle={data.banner_section_title}
          subTitle={data.about_us_section_title}
          title={data.about_us_section_sub_title}
          description={data.about_us_section_description}
          image={data.about_us_section_image}
          buttonUrl={data.about_us_section_button_url}
          pills={data.about_us_section}
          yearsExperience={data["8+_years_experience_title"]}
          happyCustomersNumber={data.happy_customers_number}
          happyCustomersTitle={data.happy_customers_title}
        />
        <AboutStats
          sectionLabel={data.our_numbers_section_title}
          sectionTitle={data.our_numbers_section_sub_title}
          stats={data.our_numbers_section}
        />
        <AboutFeatures
          sectionLabel={data.our_feature_section_title}
          sectionTitle={data.our_feature_section_sub_title}
          features={data.our_feature_section}
        />
      </main>
      <Footer />
    </>
  );
}
