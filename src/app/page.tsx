import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FutureOfElectric from "@/components/sections/FutureOfElectric";
import CollectionLineup from "@/components/sections/CollectionLineup";
import EffortlessRiding from "@/components/sections/EffortlessRiding";
import RideSmarter from "@/components/sections/RideSmarter";
import WhyRidersChoose from "@/components/sections/WhyRidersChoose";
import EverythingYouNeed from "@/components/sections/EverythingYouNeed";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FutureOfElectric />
        <CollectionLineup />
        <EffortlessRiding />
        <RideSmarter />
        <WhyRidersChoose />
        <EverythingYouNeed />
      </main>
      <Footer />
    </>
  );
}
