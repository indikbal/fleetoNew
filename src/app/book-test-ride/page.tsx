import Navbar from "@/components/layout/Navbar";
import BookTestRideSection from "@/components/sections/BookTestRideSection";
import { fetchBookTestRidePage, fetchModelList } from "@/lib/api";

export const metadata = {
  title: "Book a Test Ride — Fleeto",
  description:
    "Experience the Fleeto electric scooter first-hand. Book your free test ride today.",
};

export default async function BookTestRidePage() {
  const [pageData, models] = await Promise.all([
    fetchBookTestRidePage(),
    fetchModelList(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <BookTestRideSection pageData={pageData} models={models} />
      </main>
    </>
  );
}
