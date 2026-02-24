import Navbar from "@/components/layout/Navbar";
import BookTestRideSection from "@/components/sections/BookTestRideSection";

export const metadata = {
  title: "Book a Test Ride — Fleeto",
  description:
    "Experience the Fleeto electric scooter first-hand. Book your free test ride today.",
};

export default function BookTestRidePage() {
  return (
    <>
      <Navbar />
      <main>
        <BookTestRideSection />
      </main>
    </>
  );
}
