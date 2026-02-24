import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fleeto - Go Green. Go Electric. Go Fleeto.",
  description:
    "Experience the future of urban mobility with Fleeto's premium electric scooters. Zero emissions, maximum performance.",
  keywords: ["electric scooter", "fleeto", "urban mobility", "green transport", "EV"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${anton.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
