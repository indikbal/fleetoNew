import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
