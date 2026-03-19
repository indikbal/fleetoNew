const API_BASE  = process.env.WP_AJAX_URL!;
const WC_BASE   = process.env.WP_WC_URL!;
const WC_KEY    = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

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
  /** Colours extracted from active variations — populated by fetchProducts() */
  variation_colors: string[];
}

export interface ProductVariation {
  variation_id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  stock: string;
  attributes: Record<string, string>; // e.g. { Color: "black" }
  image: string;
}

export interface WCProductDetail {
  id: number;
  title: string;
  type: string;
  price: string;
  image: string;
  desc: string;          // HTML list of specs
  acf: ExplorePageData; // same structure as the explore page
  variations: ProductVariation[];
}

export async function fetchProductDetails(productId: number): Promise<WCProductDetail | null> {
  try {
    const res = await fetch("https://fleetowebapi.codingcloud.in/wp-json/custom/v1/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
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
  const products: Omit<WCProduct, "variation_colors">[] = await res.json();

  // Fetch each product's variations in parallel to get accurate active colors
  const variationColors = await Promise.all(
    products.map((p) =>
      fetch(
        `${WC_BASE}/products/${p.id}/variations?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
        { next: { revalidate: 3600 } }
      )
        .then((r) => (r.ok ? r.json() : []))
        .then((vars: WCVariation[]) =>
          vars
            .map(
              (v) =>
                v.attributes.find(
                  (a) =>
                    a.name.toLowerCase() === "color" ||
                    a.name.toLowerCase() === "colour"
                )?.option ??
                v.attributes[0]?.option ??
                ""
            )
            .filter(Boolean)
        )
        .catch(() => [] as string[])
    )
  );

  return products.map((p, i) => ({ ...p, variation_colors: variationColors[i] }));
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
const CUSTOM_BASE = process.env.WP_CUSTOM_URL!;
const WP_BASE     = process.env.WP_BASE!;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  success: boolean | number | string;
  message?: string;
  user?: AuthUser;
  data?: AuthUser & Record<string, unknown>;
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

// ─── User Profile ─────────────────────────────────────────────────────────────
export interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
}

// ─── Cart ──────────────────────────────────────────────────────────────────────
export interface CartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: string;
  total: string;
  image: string;
}

export async function fetchMyCart(user_id: number): Promise<CartItem[]> {
  const res = await fetch("/api/user/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id }),
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  // Handle both array response and { items: [] } shape
  return Array.isArray(data) ? data : (data.items ?? data.cart ?? []);
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  total: string;
}

export interface Order {
  id: number;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  line_items: OrderItem[];
}

export async function downloadInvoice(user_id: number, order_id: number): Promise<void> {
  const res = await fetch("/api/user/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Failed to download invoice");
  }

  const data = await res.json();
  // Response shape: { status, user_id, orders: [{ order_id, date, total, invoice_link }] }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders: any[] = Array.isArray(data?.orders) ? data.orders : [];
  const match = orders.find((o) => o.order_id === order_id || String(o.order_id) === String(order_id));
  const invoiceLink: string = match?.invoice_link ?? "";

  if (!invoiceLink) throw new Error("Invoice not found for this order");
  window.open(invoiceLink, "_blank");
}

export async function fetchMyOrders(user_id: number): Promise<Order[]> {
  const res = await fetch(`/api/user/orders?user_id=${user_id}`);
  const data = await res.json();
  // WP returns 404 + { error: true } when user has no orders — treat as empty
  if (!res.ok || data?.error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = Array.isArray(data) ? data : (data.orders ?? []);
  return raw.map((o) => ({
    id: o.order_id ?? o.id,
    status: o.status,
    date_created: o.date ?? o.date_created ?? "",
    total: o.total,
    currency: o.currency ?? "INR",
    line_items: (o.products ?? o.line_items ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => ({
        product_id: p.product_id,
        name: p.product_name ?? p.name,
        quantity: p.quantity,
        total: p.subtotal ?? p.total ?? "0",
      })
    ),
  }));
}

export async function fetchMyProfile(user_id: number): Promise<UserProfile> {
  const res = await fetch(`/api/user/profile?user_id=${user_id}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = await res.json();
  // WP returns { success: true, data: { id, username, email, first_name, last_name } }
  const d = json.data ?? json;
  return {
    user_id: d.id ?? d.user_id,
    username: d.username,
    email: d.email,
    first_name: d.first_name ?? "",
    last_name: d.last_name ?? "",
    display_name: d.display_name ?? d.username ?? "",
  };
}

export async function updateProfile(
  user_id: number,
  first_name: string,
  last_name: string,
  email: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/user/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, first_name, last_name, email }),
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

// ─── Book Test Ride Page ───────────────────────────────────────────────────────
export interface BookTestRidePageData {
  banner_title?: string;
  section_title?: string;
  section_sub_title?: string;
  section_description?: string;
  perk_1?: string;
  perk_2?: string;
  perk_3?: string;
  [key: string]: string | undefined;
}

export async function fetchBookTestRidePage(): Promise<BookTestRidePageData> {
  try {
    const res = await fetch(`${API_BASE}?action=Book_A_Test_Ride_Page`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_slug: "book-a-test-ride" }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
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
  // Blacks
  black: "#1A1A1A",
  "matte black": "#1A1A1A",
  "matt black": "#1A1A1A",
  "gloss black": "#1A1A1A",
  "glossy black": "#1A1A1A",
  "metallic black": "#1A1A1A",
  // Whites
  white: "#F2F2F2",
  "pearl white": "#F0EFE9",
  "glossy white": "#F5F5F5",
  "matt white": "#EFEFEF",
  "matte white": "#EFEFEF",
  "ivory white": "#FFFFF0",
  // Reds
  red: "#AB2323",
  "candy red": "#C0392B",
  "cherry red": "#A93226",
  "sporty red": "#C0392B",
  "wine red": "#7B241C",
  "fire red": "#C0392B",
  maroon: "#800000",
  // Blues
  blue: "#4A7FEB",
  "sky blue": "#5DADE2",
  "navy blue": "#1A3A6B",
  "ocean blue": "#1F618D",
  "electric blue": "#007FFF",
  "metallic blue": "#4A6FA5",
  // Greens
  green: "#4AAB5E",
  teal: "#008080",
  "teal green": "#008080",
  olive: "#808000",
  // Greys / Silvers
  grey: "#888888",
  gray: "#888888",
  "dark grey": "#555555",
  "dark gray": "#555555",
  "light grey": "#BBBBBB",
  "metallic grey": "#8D99AE",
  "metallic gray": "#8D99AE",
  "silver grey": "#9EAAB4",
  silver: "#C0C0C0",
  // Pinks / Purples
  pink: "#F4A0A0",
  "rose gold": "#B76E79",
  rose: "#FF007F",
  purple: "#8B5CF6",
  violet: "#7F00FF",
  // Yellows / Oranges / Golds
  yellow: "#FFD700",
  gold: "#FFD700",
  orange: "#E87722",
  // Browns
  brown: "#8B4513",
};

export function colorNameToHex(name: string): string {
  const lower = name.toLowerCase().trim();
  // 1. Exact match
  if (COLOR_HEX[lower]) return COLOR_HEX[lower];
  // 2. Word-split match — handles "Matte Black", "Pearl White", "Sky Blue" etc.
  const words = lower.split(/[\s\-_]+/);
  for (const word of words) {
    if (COLOR_HEX[word]) return COLOR_HEX[word];
  }
  return "#CCCCCC";
}

// ─── Blog / Posts ─────────────────────────────────────────────────────────────
export interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  date: string;
}

export interface BlogPostDetail {
  id: number;
  title: string;
  description: string; // HTML
  image: string;
  author: string;
  publish_date: string;
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${CUSTOM_BASE}/posts`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchPost(postId: number): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(`${CUSTOM_BASE}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch { return null; }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export interface FaqItem {
  title: string;
  details: string; // HTML
}

export async function fetchFaqPage(): Promise<FaqItem[]> {
  try {
    const res = await fetch(`${API_BASE}?action=Faq_Page`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_slug: "faqs" }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.faq_section ?? [];
  } catch { return []; }
}

// ─── Simple CMS pages (title + HTML content) ─────────────────────────────────
export interface SimplePageData {
  id: number;
  title: string;
  content: string; // HTML
  image: string | false;
}

async function fetchSimplePage(endpoint: string): Promise<SimplePageData | null> {
  try {
    const res = await fetch(`${CUSTOM_BASE}/${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch { return null; }
}

export const fetchRetailsPartnershipPage = () => fetchSimplePage("retails-partnership");
export const fetchSupportPage            = () => fetchSimplePage("support");
export const fetchFinanceOptionPage      = () => fetchSimplePage("finance-option");
export const fetchFindADealerPage        = () => fetchSimplePage("find-a-dealer");
export const fetchCompareModelPage       = () => fetchSimplePage("compare-model");
