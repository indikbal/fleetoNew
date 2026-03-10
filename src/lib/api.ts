const API_BASE = "https://fleetowebapi.codingcloud.in/wp-admin/admin-ajax.php";
const WC_BASE = "https://fleetowebapi.codingcloud.in/wp-json/wc/v3";
const WC_KEY = "ck_2a65d51ecd3d108e3e810dac3e03ba492cafe3bd";
const WC_SECRET = "cs_bebf42f0e9337f689dc4e88c2989c531c8aad6d9";

export interface BannerSlide {
  image: string;
  title: string;
  sub_title_1: string;
  sub_title_2: string;
  sub_title_3: string;
  button_url: string;
}

export interface SocialMedia {
  svg_image: string;
  name: string;
  url: string;
}

export interface FutureButton {
  title: string;
  url: string;
}

export interface EffortlessCard {
  title: string;
  image: string;
}

export interface WhyFeature {
  title_1: string;
  title_2: string;
  title_3: string;
  details: string;
}

export interface FAQ {
  title: string;
  details: string;
}

export interface HomePageData {
  banner_section: BannerSlide[];
  banner_section_social_media: SocialMedia[];
  the_future_of_electric_section: FutureButton[];
  effortless_riding_section: EffortlessCard[];
  why_riders_choose_fleeto_section: WhyFeature[];
  everything_you_need_to_know_about_fleeto_section: FAQ[];
  the_future_of_electric_section_title_1: string;
  the_future_of_electric_section_title_2: string;
  the_future_of_electric_section_title_3: string;
  the_future_of_electric_section_description: string;
  the_future_of_electric_section_image: string;
  fleeto_collection_lineup_section_title_1: string;
  fleeto_collection_lineup_section_title_2: string;
  effortless_riding_section_title_1: string;
  effortless_riding_section_title_2: string;
  effortless_riding_section_title_3: string;
  ride_smarter_with_fleeto_electric_scooters_section_title_1: string;
  ride_smarter_with_fleeto_electric_scooters_section_title_2: string;
  ride_smarter_with_fleeto_electric_scooters_section_title_3: string;
  ride_smarter_with_fleeto_electric_scooters_section_description: string;
  ride_smarter_with_fleeto_electric_scooters_section_image: string;
  ride_smarter_with_fleeto_electric_scooters_section_button_url: string;
  why_riders_choose_fleeto_section_title_1: string;
  why_riders_choose_fleeto_section_title_2: string;
  why_riders_choose_fleeto_section_description: string;
  why_riders_choose_fleeto_section_image: string;
  call_us_or_book_your_ride_instantly_title: string;
  call_us_or_book_your_ride_instantly_number: string;
  call_us_or_book_your_ride_instantly_button_url: string;
  everything_you_need_to_know_about_fleeto_section_title_1: string;
  everything_you_need_to_know_about_fleeto_section_title_2: string;
}

export interface WCProduct {
  id: number;
  name: string;
  price: string;
  sale_price: string;
  images: { src: string }[];
  attributes: { name: string; options: string[] }[];
}

export interface WCVariation {
  id: number;
  price: string;
  sale_price: string;
  stock_status: string;
  permalink: string;
  image: { src: string };
  attributes: { name: string; option: string }[];
}

export async function fetchHomePage(): Promise<HomePageData> {
  const res = await fetch(`${API_BASE}?action=Home_Page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_slug: "home" }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch home page data");
  return res.json();
}

export async function fetchProducts(): Promise<WCProduct[]> {
  const res = await fetch(
    `${WC_BASE}/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// ─── About Page ───────────────────────────────────────────────────────────────
export interface AboutPill {
  image_svg: string;
  title: string;
  details: string;
}

export interface AboutStat {
  image_svg: string;
  number: string;
  title: string;
}

export interface AboutFeatureItem {
  image_svg: string;
  title: string;
  details: string;
}

export interface AboutPageData {
  about_us_section: AboutPill[];
  our_numbers_section: AboutStat[];
  our_feature_section: AboutFeatureItem[];
  banner_section_title: string;
  about_us_section_title: string;
  about_us_section_sub_title: string;
  about_us_section_description: string;
  about_us_section_image: string;
  about_us_section_button_url: string;
  "8+_years_experience_title": string;
  happy_customers_number: string;
  happy_customers_title: string;
  our_numbers_section_title: string;
  our_numbers_section_sub_title: string;
  our_feature_section_title: string;
  our_feature_section_sub_title: string;
}

export async function fetchAboutPage(): Promise<AboutPageData> {
  const res = await fetch(`${API_BASE}?action=About_Page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_slug: "about" }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch about page data");
  return res.json();
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
export interface QuickConnectItem {
  svg_image: string;
  title: string;
  number: string;
}

export interface ContactPageData {
  quick_connect: QuickConnectItem[];
  banner__title: string;
  contact_form_title: string;
  contact_form_sub_title: string;
  address_title: string;
  mail_us_title: string;
  telephone_title: string;
  working_hours_title: string;
  quick_connect_title: string;
  quick_connect_sub_title: string;
  quick_connect_short_title: string;
  map: string;
}

export async function fetchContactPage(): Promise<ContactPageData> {
  const res = await fetch(`${API_BASE}?action=Contact_Page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_slug: "contact" }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch contact page data");
  return res.json();
}

// ─── Explore Page ─────────────────────────────────────────────────────────────
export interface ExploreBannerStat {
  title: string;
  sub_title: string;
}

export interface ExploreRideEasyItem {
  image: string;
  title: string;
  details: string;
}

export interface ExploreAlbumItem {
  image: string;
}

export interface ExploreFinanceLogo {
  image: string;
}

export interface ExploreFinanceFeature {
  title: string;
}

export interface ExplorePageData {
  banner_section: ExploreBannerStat[];
  banner_section_image: string;
  pricing_button_url: string;
  book_your_test_ride_button_url: string;
  ride_easy_section: ExploreRideEasyItem[];
  ride_easy_section_title: string;
  ride_easy_section_image: string;
  always_in_sync_section_title: string;
  always_in_sync_section_description: string;
  always_in_sync_section_video_file: string;
  the_familly_album_section: ExploreAlbumItem[];
  the_familly_album_section_title: string;
  calculator_section_title_1: string;
  calculator_section_title_2: string;
  calculator_section_title_3: string;
  calculator_section_title_4: string;
  calculator_section_description: string;
  calculator_section_short_title: string;
  calculator_section_long_title: string;
  calculator_section_long_description: string;
  finance_section: ExploreFinanceLogo[];
  finance_section_description: ExploreFinanceFeature[];
  finance_section_image: string;
  finance_section_title: string;
  finance_section_short_title: string;
  finance_section_icon: string;
  emis_as_low_as_title: string;
  emis_as_low_as_price: string;
  emis_as_low_as_button_url: string;
  accessories_your_fleeto_section_title: string;
  accessories_your_fleeto_section_details: string;
  accessories_your_fleeto_section_button_url: string;
  accessories_your_fleeto_section_image: string;
}

export async function fetchExplorePage(): Promise<ExplorePageData> {
  const res = await fetch(`${API_BASE}?action=Explore_Page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_slug: "explore" }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch explore page data");
  return res.json();
}

// ─── Shop Page ────────────────────────────────────────────────────────────────
export interface ShopPageData {
  banner_section_title: string;
  our_collection_section_title: string;
  our_collection_section_sub_title_1: string;
  our_collection_section_sub_title_2: string;
  cant_decide_section_title: string;
  cant_decide_section_button_url: string;
}

export async function fetchShopPage(): Promise<ShopPageData> {
  const res = await fetch(`${API_BASE}?action=Shop_Page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_slug: "shop" }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch shop page data");
  return res.json();
}

// ─── Header Menu ──────────────────────────────────────────────────────────────
const CUSTOM_BASE = "https://fleetowebapi.codingcloud.in/wp-json/custom/v1";
const WP_BASE = "https://fleetowebapi.codingcloud.in";

export interface HeaderMenuItem {
  id: number;
  title: string;
  href: string;
  parent: string;
}

// Map WP page paths → Next.js routes
function wpUrlToHref(url: string): string {
  const path = url.replace(WP_BASE, "").replace(/\/$/, "") || "/";
  const map: Record<string, string> = {
    "/shop": "/products",
    "/book-a-test-ride": "/book-test-ride",
  };
  // WooCommerce single product pages → products listing
  if (path.startsWith("/product/")) return "/products";
  return map[path] ?? path;
}

export async function fetchHeaderMenu(): Promise<HeaderMenuItem[]> {
  const res = await fetch(`${CUSTOM_BASE}/header-menu`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch header menu");
  const data: { id: number; title: string; url: string; parent: string }[] =
    await res.json();
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    href: wpUrlToHref(item.url),
    parent: item.parent,
  }));
}

// ─── Footer Menus ─────────────────────────────────────────────────────────────
export interface FooterMenuItem {
  id: number;
  title: string;
  href: string;
}

export interface FooterMenuColumn {
  title: string;
  items: FooterMenuItem[];
}

async function fetchMenuColumn(endpoint: string): Promise<FooterMenuItem[]> {
  const res = await fetch(`${CUSTOM_BASE}/${endpoint}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  const data: { id: number; title: string; url: string; parent: string }[] =
    await res.json();
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    href: wpUrlToHref(item.url),
  }));
}

export async function fetchFooterMenus(): Promise<FooterMenuColumn[]> {
  const [products, quickLinks, aboutUs, support] = await Promise.all([
    fetchMenuColumn("our-product-menu"),
    fetchMenuColumn("quick-link-menu"),
    fetchMenuColumn("about-us-menu"),
    fetchMenuColumn("footer-menu"),
  ]);
  return [
    { title: "Our Products", items: products },
    { title: "Quick Links", items: quickLinks },
    { title: "About us", items: aboutUs },
    { title: "Support", items: support },
  ];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  display_name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export async function loginUser(
  username: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export async function logoutUser(): Promise<{ success: boolean }> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export async function sendOtp(email: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
}

export async function resetPassword(
  email: string,
  otp: string,
  new_password: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, new_password }),
  });
  return res.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Parse "10K+", "513+" etc. → { value, suffix } for animated counters
export function parseStatNumber(str: string): { value: number; suffix: string } {
  const m = str.match(/^([\d.]+)(K?)\+?$/i);
  if (!m) return { value: 0, suffix: "+" };
  const n = parseFloat(m[1]) * (m[2].toUpperCase() === "K" ? 1000 : 1);
  return { value: n, suffix: "+" };
}

// Extract iframe src from WordPress map HTML string
export function extractMapSrc(mapHtml: string): string {
  return mapHtml.match(/src="([^"]+)"/)?.[1] ?? "";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function formatPrice(price: string): string {
  const num = parseInt(price, 10);
  if (isNaN(num)) return price;
  return `₹${num.toLocaleString("en-IN")}`;
}

// Color name → hex for WooCommerce product attributes
export const COLOR_HEX: Record<string, string> = {
  black: "#010101",
  blue: "#4A7FEB",
  red: "#AB2323",
  white: "#F5F5F5",
  green: "#4AAB5E",
  grey: "#888888",
  gray: "#888888",
  pink: "#F4A0A0",
  yellow: "#FFD700",
  silver: "#C0C0C0",
};

export function colorNameToHex(name: string): string {
  return COLOR_HEX[name.toLowerCase()] ?? "#CCCCCC";
}
