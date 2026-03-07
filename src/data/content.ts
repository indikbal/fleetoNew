import type { NavLink, Product, Feature, FooterColumn } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home",           href: "/"               },
  { label: "About Us",       href: "/about"          },
  { label: "Products",       href: "/products"       },
  { label: "Explore",        href: "/explore"        },
  { label: "Contact Us",     href: "/contact"        },
];

export const heroContent = {
  headline: ["GO GREEN1.", "GO ELECTRIC1.", "GO FLEETO1."],
  highlightWord: "ELECTRIC.",
  subtitle:
    "Experience the future of urban mobility with Fleeto's premium electric scooters. Zero emissions, maximum performance.",
  cta: "Discover Now",
};

export const futureStats = [
  { icon: "Zap", value: "80 km/h", label: "Top Speed" },
  { icon: "Battery", value: "120 km", label: "Max Range" },
  { icon: "Clock", value: "3 hrs", label: "Charge Time" },
  { icon: "Gauge", value: "5000W", label: "Motor Power" },
];

export const products: Product[] = [
  {
    id: "fleeto-x1",
    name: "Fleeto X1",
    tagline: "Urban Commuter",
    speed: "60 km/h",
    range: "80 km range",
    image: "/images/scooter-placeholder.svg",
  },
  {
    id: "fleeto-s2",
    name: "Fleeto S2",
    tagline: "Sport Edition",
    speed: "80 km/h",
    range: "120 km range",
    image: "/images/scooter-placeholder.svg",
  },
  {
    id: "fleeto-e3",
    name: "Fleeto E3",
    tagline: "Eco Rider",
    speed: "45 km/h",
    range: "150 km range",
    image: "/images/scooter-placeholder.svg",
  },
];

export const effortlessFeatures: Feature[] = [
  {
    icon: "Leaf",
    title: "Zero Emissions",
    description:
      "100% electric powertrain that produces zero direct emissions, helping create cleaner cities.",
  },
  {
    icon: "Wrench",
    title: "Low Maintenance",
    description:
      "Fewer moving parts mean less wear and tear. Save time and money on maintenance.",
  },
  {
    icon: "Wifi",
    title: "Smart Connectivity",
    description:
      "Stay connected with the Fleeto app. Track rides, battery status, and get real-time diagnostics.",
  },
];

export const rideSmarterFeatures: Feature[] = [
  {
    icon: "Shield",
    title: "Advanced Safety",
    description: "Dual braking system with ABS and regenerative braking technology.",
  },
  {
    icon: "Smartphone",
    title: "Digital Dashboard",
    description: "Full-color TFT display with navigation, speed, and battery information.",
  },
  {
    icon: "Battery",
    title: "Swappable Battery",
    description: "Quick-swap battery system. Replace in seconds and keep riding.",
  },
  {
    icon: "MapPin",
    title: "GPS Tracking",
    description: "Built-in GPS for real-time location tracking and anti-theft protection.",
  },
];

export const whyChooseStats = [
  { value: "2500+", label: "Excellence in\nAutomotive Design" },
  { value: "Ultra Fast", label: "Performance &\nAcceleration" },
  { value: "Smart", label: "Technology &\nConnectivity" },
  { value: "150+", label: "The Most Economical\nWay to Ride" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Fleeto X1", href: "#products" },
      { label: "Fleeto S2", href: "#products" },
      { label: "Fleeto E3", href: "#products" },
      { label: "Accessories", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#contact" },
      { label: "Warranty", href: "#" },
      { label: "Service Centers", href: "#" },
    ],
  },
];

export const footerSocials = [
  { icon: "Facebook", href: "#" },
  { icon: "Twitter", href: "#" },
  { icon: "Instagram", href: "#" },
  { icon: "Youtube", href: "#" },
];
