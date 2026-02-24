import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/AboutHero";
import AboutStats from "@/components/sections/AboutStats";
import AboutFeatures from "@/components/sections/AboutFeatures";

export const metadata = {
  title: "About Us — Fleeto",
  description:
    "Learn about Fleeto's mission to redefine urban mobility with eco-friendly, stylish electric scooters for the modern Indian commuter.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutStats />
        <AboutFeatures />
      </main>
      <Footer />
    </>
  );
}
