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

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductBanner />
        <RideEasy />
        <AlwaysInSync />
        <FamilyAlbum />

        {/* ── Calculator + Finance wrapper — scooty straddles their boundary ── */}
        <div className="relative">
          <SavingsCalculator />
          <FinanceYourWay />

          {/* Scooty — slides in from left at the section boundary */}
          <ScootyReveal />
        </div>

        <Accessories />
        <EverythingYouNeed/>
      </main>
      <Footer />
    </>
  );
}
