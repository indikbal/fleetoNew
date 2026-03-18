import PageHeroBanner from "@/components/ui/PageHeroBanner";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { colors, fonts, styles } from "@/config/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sitemapSections = [
  {
    title: "Main Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "Explore", href: "/explore" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "My Cart", href: "/cart" },
      { label: "My Orders", href: "/orders" },
      { label: "Book a Test Ride", href: "/book-test-ride" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "My Profile", href: "/profile" },
      { label: "Forgot Password", href: "/forgot-password" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Resources", href: "/resources" },
      { label: "Support", href: "/support" },
      { label: "Retail Partnership", href: "/retails-partnership" },
      { label: "Find a Dealer", href: "/find-a-dealer" },
      { label: "Finance Options", href: "/finance-option" },
      { label: "Compare Models", href: "/compare-model" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Terms & Conditions", href: "/term-conditions" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <Navbar />
      <PageHeroBanner svgText="SITEMAP" />

      <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sitemapSections.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl p-6">
                <h2 className="text-sm mb-4" style={{ ...styles.headingFont, color: "#010101" }}>
                  {section.title}
                </h2>
                <div
                  className="h-[2px] w-8 rounded-full mb-4"
                  style={{ backgroundColor: colors.primary }}
                />
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 group transition-colors"
                        style={{ fontFamily: fonts.body }}
                      >
                        <ArrowUpRight
                          size={13}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: colors.primary }}
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
