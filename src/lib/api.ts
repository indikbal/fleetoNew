const API_BASE  = process.env.WP_AJAX_URL!;
const WC_BASE   = process.env.WP_WC_URL!;
const WC_KEY    = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

// ISR cache lifetime (seconds) for all WP/WC fetches.
// Lower = fresher backend updates, higher = faster pages & less API load.
const CACHE_TTL = 60;

export interface BannerSlide {
  image: string;
  title: string;
  sub_title_1: string;
  sub_title_2: string;
  sub_title_3: string;
  sub_title_4: string;
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
      next: { revalidate: CACHE_TTL },
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
    next: { revalidate: CACHE_TTL },
  });
  if (!res.ok) throw new Error("Failed to fetch home page data");
  return res.json();
}

export async function fetchProducts(): Promise<WCProduct[]> {
  const res = await fetch(
    `${WC_BASE}/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
    { next: { revalidate: CACHE_TTL } }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  const products: Omit<WCProduct, "variation_colors">[] = await res.json();

  // Fetch each product's variations in parallel to get accurate active colors
  const variationColors = await Promise.all(
    products.map((p) =>
      fetch(
        `${WC_BASE}/products/${p.id}/variations?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
        { next: { revalidate: CACHE_TTL } }
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
    next: { revalidate: CACHE_TTL },
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
    next: { revalidate: CACHE_TTL },
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
    next: { revalidate: CACHE_TTL },
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
    next: { revalidate: CACHE_TTL },
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
    "/warranty-and-service": "/warranty-and-service",
  };
  // WooCommerce single product pages → products listing
  if (path.startsWith("/product/")) return "/products";
  return map[path] ?? path;
}

export async function fetchHeaderMenu(): Promise<HeaderMenuItem[]> {
  const res = await fetch(`${CUSTOM_BASE}/header-menu`, {
    next: { revalidate: CACHE_TTL },
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
    next: { revalidate: CACHE_TTL },
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

// Map WC product slug → numeric ID so footer product links resolve to /products/[id]
async function fetchProductSlugMap(): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${WC_BASE}/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&per_page=100&_fields=id,slug&status=publish`,
      { next: { revalidate: CACHE_TTL } }
    );
    if (!res.ok) return {};
    const list: { id: number; slug: string }[] = await res.json();
    const map: Record<string, number> = {};
    for (const p of list) if (p.slug) map[p.slug] = p.id;
    return map;
  } catch {
    return {};
  }
}

export async function fetchFooterMenus(): Promise<FooterMenuColumn[]> {
  const [quickLinks, aboutUs, support, common, slugToId, productsRaw] =
    await Promise.all([
      fetchMenuColumn("quick-link-menu"),
      fetchMenuColumn("about-us-menu"),
      fetchMenuColumn("footer-menu"),
      fetchCommonData(),
      fetchProductSlugMap(),
      fetch(`${CUSTOM_BASE}/our-product-menu`, {
        next: { revalidate: CACHE_TTL },
      })
        .then((r) =>
          r.ok
            ? (r.json() as Promise<
                { id: number; title: string; url: string; parent: string }[]
              >)
            : []
        )
        .catch(() => [] as { id: number; title: string; url: string }[]),
    ]);

  const products: FooterMenuItem[] = productsRaw.map((item) => {
    const slug = item.url.match(/\/product\/([^/]+)/)?.[1];
    const pid = slug ? slugToId[slug] : undefined;
    return {
      id: item.id,
      title: item.title,
      href: pid ? `/products/${pid}` : wpUrlToHref(item.url),
    };
  });

  return [
    { title: common.columnTitles.ourProducts, items: products },
    { title: common.columnTitles.quickLinks, items: quickLinks },
    { title: common.columnTitles.aboutUs, items: aboutUs },
    { title: common.columnTitles.support, items: support },
  ];
}

// ─── Common (shared site-wide data) ───────────────────────────────────────────
export interface CommonSocialMedia {
  svg: string;
  name: string;
  url: string;
}

export interface CommonData {
  headerLogo: string;
  headerTestRideUrl: string;
  footerContent: string;
  footerTestRideUrl: string;
  columnTitles: {
    ourProducts: string;
    quickLinks: string;
    aboutUs: string;
    support: string;
    contact: string;
  };
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  footerTitle1: string;
  footerTitle2: string;
  socialMedia: CommonSocialMedia[];
}

const pickFirst = (v: unknown): string => {
  if (Array.isArray(v)) return typeof v[0] === "string" ? v[0] : "";
  if (typeof v === "string") return v;
  return "";
};

const stripHtmlBasic = (s: string) =>
  s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const commonFallback: CommonData = {
  headerLogo: "/images/logo.png",
  headerTestRideUrl: "/book-test-ride",
  footerContent: "",
  footerTestRideUrl: "/book-test-ride",
  columnTitles: {
    ourProducts: "Our Products",
    quickLinks: "Quick Links",
    aboutUs: "About us",
    support: "Support",
    contact: "Contact",
  },
  address: "",
  phone: "",
  email: "",
  workingHours: "",
  footerTitle1: "Ride with",
  footerTitle2: "FLEETO",
  socialMedia: [],
};

export async function fetchCommonData(): Promise<CommonData> {
  try {
    const res = await fetch(`${API_BASE}?action=Common`, {
      method: "POST",
      next: { revalidate: CACHE_TTL },
    });
    if (!res.ok) return commonFallback;
    const json = await res.json();

    const socialRaw = Array.isArray(json.Footer_social_media)
      ? json.Footer_social_media
      : [];

    return {
      headerLogo: pickFirst(json.Header_logo) || commonFallback.headerLogo,
      headerTestRideUrl:
        pickFirst(json.Book_an_test_ride_url) || commonFallback.headerTestRideUrl,
      footerContent: pickFirst(json.Footer_content),
      footerTestRideUrl:
        pickFirst(json.Footer_book_your_test_ride_url) ||
        commonFallback.footerTestRideUrl,
      columnTitles: {
        ourProducts:
          pickFirst(json.Our_products_title) || commonFallback.columnTitles.ourProducts,
        quickLinks:
          pickFirst(json.Quick_links_title) || commonFallback.columnTitles.quickLinks,
        aboutUs:
          pickFirst(json.About_us_title) || commonFallback.columnTitles.aboutUs,
        support:
          pickFirst(json.Support_title) || commonFallback.columnTitles.support,
        contact:
          pickFirst(json.Contact_title) || commonFallback.columnTitles.contact,
      },
      address: pickFirst(json.Address),
      phone: stripHtmlBasic(pickFirst(json.Phone_number)),
      email: pickFirst(json.Email_id),
      workingHours: pickFirst(json.Working_hours),
      footerTitle1:
        pickFirst(json.Footer_ride_with_section_title_1) || commonFallback.footerTitle1,
      footerTitle2:
        pickFirst(json.Footer_ride_with_section_title_2) || commonFallback.footerTitle2,
      socialMedia: socialRaw.map(
        (s: { image_svg?: string; name?: string; url?: string }) => ({
          svg: s.image_svg ?? "",
          name: s.name ?? "",
          url: s.url ?? "#",
        })
      ),
    };
  } catch {
    return commonFallback;
  }
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
  subtotal: string;
  total: string;
}

export interface OrderAddress {
  first_name: string;
  last_name: string;
  company: string;
  email?: string;
  phone?: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

// Lightweight shape returned by the orders-list API
export interface OrderSummary {
  id: number;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  line_items: OrderItem[];
}

// Full shape returned by the order-details API (/invoice/v1/order)
export interface OrderDetails extends OrderSummary {
  discount: string;
  shipping_cost: string;
  tax: string;
  payment_method: string;
  billing: OrderAddress;
  shipping: OrderAddress;
  invoice_link: string;
}

export async function fetchOrderDetails(order_id: number): Promise<OrderDetails | null> {
  const res = await fetch("/api/user/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id }),
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (json?.status !== "success" || !json?.order) return null;

  const o = json.order;
  return {
    id: o.order_id,
    status: o.status,
    date_created: o.date ?? "",
    total: o.total,
    currency: o.currency ?? "INR",
    discount: o.discount ?? "0",
    shipping_cost: o.shipping_cost ?? "0",
    tax: o.tax ?? "0",
    payment_method: o.payment_method ?? "",
    billing: o.billing ?? {},
    shipping: o.shipping ?? {},
    line_items: (o.items ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => ({
        product_id: p.product_id,
        name: p.name,
        quantity: p.quantity,
        subtotal: p.subtotal ?? p.total ?? "0",
        total: p.total ?? "0",
      })
    ),
    invoice_link: o.invoice_link ?? "",
  };
}

export async function downloadInvoice(order_id: number): Promise<void> {
  const res = await fetch("/api/user/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Failed to download invoice");
  }

  const json = await res.json();
  const invoiceLink: string = json?.order?.invoice_link ?? "";

  if (!invoiceLink) throw new Error("Invoice not found for this order");
  window.open(invoiceLink, "_blank");
}

export async function fetchMyOrders(user_id: number): Promise<OrderSummary[]> {
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
        subtotal: p.subtotal ?? p.total ?? "0",
        total: p.total ?? "0",
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

// ─── Razorpay Payment ────────────────────────────────────────────────────────
export interface CheckoutLineItem {
  product_id: number;
  variation_id: number;
  quantity: number;
}

export interface CheckoutAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface CreateRazorpayOrderResponse {
  success: boolean;
  rp_order_id?: string;
  amount?: number;
  currency?: string;
  key_id?: string;
  error?: string;
}

export async function createRazorpayOrder(payload: {
  items: CheckoutLineItem[];
  billing: CheckoutAddress;
  shipping: CheckoutAddress;
  customer_id?: number;
}): Promise<CreateRazorpayOrderResponse> {
  const res = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export interface VerifyRazorpayPaymentResponse {
  success: boolean;
  wc_order_id?: number;
  error?: string;
  payment_id?: string;
}

export async function verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  items: CheckoutLineItem[];
  billing: CheckoutAddress;
  shipping: CheckoutAddress;
  customer_id?: number;
}): Promise<VerifyRazorpayPaymentResponse> {
  const res = await fetch("/api/payment/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
      next: { revalidate: CACHE_TTL },
    });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

// ─── Model List (for Book a Test Ride) ─────────────────────────────────────
export interface TestRideModel {
  model_name: string;
  model_image: string;
}

// Server-side fetcher (used for SSR prefill)
export async function fetchModelList(): Promise<TestRideModel[]> {
  try {
    const res = await fetch(
      `${process.env.WP_CUSTOM_API_URL}/model-list`,
      { next: { revalidate: CACHE_TTL } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.models ?? [];
  } catch {
    return [];
  }
}

// ─── Performance / Design / Technology Sections ──────────────────────────
export interface PerformanceSectionItem {
  image: string;
  title: string;
  details: string;
  main_section_image: string;
  main_section_title: string;
  main_section_details: string;
}

export interface DesignSectionItem {
  image: string;
  title: string;
  details: string;
}

export interface TechnologySectionItem {
  image: string;
  title: string;
  details: string;
}

export interface ProductSpecsData {
  product_id: number;
  product_name: string;
  performance_section_title: string;
  performance_section_details: string;
  performance_section: PerformanceSectionItem[];
  design_section_title: string;
  design_section_description: string;
  design_section: DesignSectionItem[];
  technology_section_title: string;
  technology_section_description: string;
  technology_section: TechnologySectionItem[];
}

export async function fetchProductSpecs(productId: number): Promise<ProductSpecsData | null> {
  try {
    const res = await fetch(
      "https://fleetowebapi.codingcloud.in/wp-json/custom-api/v1/performance_section",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
        next: { revalidate: CACHE_TTL },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.data || !Array.isArray(json.data)) return null;
    return json.data.find((p: ProductSpecsData) => p.product_id === productId) ?? null;
  } catch {
    return null;
  }
}

// ─── Warranty & Service ──────────────────────────────────────────────────
export interface WarrantyProduct {
  product_id: number;
  product_name: string;
  warranty_rules: string; // HTML
  support_rules: string;  // HTML
  warranty_and_support_section_pdf?: string;
}

export async function fetchWarrantyAndService(): Promise<WarrantyProduct[]> {
  try {
    const res = await fetch(
      "https://fleetowebapi.codingcloud.in/wp-json/custom-api/v1/warentry_and_serivce",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: CACHE_TTL },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchWarrantyServiceMenu(): Promise<HeaderMenuItem[]> {
  try {
    const res = await fetch(`${CUSTOM_BASE}/warranty-and-service-menu`, {
      next: { revalidate: CACHE_TTL },
    });
    if (!res.ok) return [];
    const data: { id: number; title: string; url: string; parent: string }[] =
      await res.json();
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      href: wpUrlToHref(item.url),
      parent: item.parent,
    }));
  } catch {
    return [];
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
    const res = await fetch(`${CUSTOM_BASE}/posts`, { next: { revalidate: CACHE_TTL } });
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
      next: { revalidate: CACHE_TTL },
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
      next: { revalidate: CACHE_TTL },
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
    const res = await fetch(`${CUSTOM_BASE}/${endpoint}`, { next: { revalidate: CACHE_TTL } });
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

// ─── Store Locator (Dealer Filter) ──────────────────────────────────────────
const DEALER_FILTER_URL = "https://fleetowebapi.codingcloud.in/wp-json/dealer/v12/filter";

export interface DealerFilterResult {
  [key: string]: unknown;
}

export async function filterDealers(body: Record<string, string>): Promise<DealerFilterResult> {
  const res = await fetch("/api/dealer/filter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Server-side dealer filter (used by API route)
export async function filterDealersServer(body: Record<string, string>): Promise<DealerFilterResult> {
  const res = await fetch(DEALER_FILTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to filter dealers");
  return res.json();
}

// ─── Product Details (new endpoint with battery selection) ──────────────────
export interface ProductDetailAttributeValue {
  name: string;
  description: string;
  warranty: string | null;
}

export interface ProductDetailAttribute {
  attribute_name: string;
  values: ProductDetailAttributeValue[];
}

export interface ProductDetailVariation {
  variation_id: number;
  price: number;
  regular_price: number;
  attributes: Record<string, string>;
  image: string;
  description?: string;
}

export interface ProductDetailsNew {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  gallery_images: string[];
  attributes: ProductDetailAttribute[];
  variations: ProductDetailVariation[];
  "4_years_warranty"?: string;
}

export async function fetchProductDetailsNew(productId: number): Promise<ProductDetailsNew | null> {
  try {
    const res = await fetch("https://fleetowebapi.codingcloud.in/wp-json/custom/v1/product-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
      next: { revalidate: CACHE_TTL },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.status ? json.data : null;
  } catch {
    return null;
  }
}

// ─── Technical Information (4th specs tab) ──────────────────────────────────
// GET /custom-api/v1/technical-information-section returns ALL products in one
// payload. The `technical_info` value is a flat ordered object whose 4 special
// "header" keys split it into logical sections (operational features, lead-acid
// compatibility, lithium compatibility, mileage). The rest are data rows.
export interface TechnicalInformationItem {
  product_id: number;
  product_name: string;
  technical_info: Record<string, string>;
}

export async function fetchTechnicalInformation(
  productId: number
): Promise<TechnicalInformationItem | null> {
  try {
    const res = await fetch(
      "https://fleetowebapi.codingcloud.in/wp-json/custom-api/v1/technical-information-section",
      { next: { revalidate: CACHE_TTL } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const list: TechnicalInformationItem[] = json?.data ?? [];
    return list.find((p) => p.product_id === productId) ?? null;
  } catch {
    return null;
  }
}

// ─── 4-Years Warranty ───────────────────────────────────────────────────────
export interface WarrantyTextItem {
  product_id: number;
  product_name: string;
  "4_years_warranty": string;
}

export async function fetchFourYearsWarranty(): Promise<WarrantyTextItem[]> {
  try {
    const res = await fetch(
      "https://fleetowebapi.codingcloud.in/wp-json/custom-api/v1/4-years-warranty",
      { next: { revalidate: CACHE_TTL } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

// ─── Become a Dealer ────────────────────────────────────────────────────────
export async function submitBecomeADealer(body: {
  name: string;
  contact_number: string;
  email: string;
  pincode: string;
  state: string;
}): Promise<{ status: string; message: string }> {
  const res = await fetch("/api/become-a-dealer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ─── Register Your Fleeto ───────────────────────────────────────────────────
export async function submitRegisterFleeto(body: {
  customer_name: string;
  customer_contact_number: string;
  invoice_number: string;
  invoice_date: string;
  dealer_name: string;
  dealer_contact_number: string;
  chassis_number: string;
  battery_numbers: string[];
}): Promise<{ status: string; message: string }> {
  const res = await fetch("/api/register-your-fleeto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ─── Raise Service Issue ────────────────────────────────────────────────────
export async function submitRaiseServiceIssue(body: {
  customer_name: string;
  customer_contact_number: string;
  invoice_number: string;
  invoice_date: string;
  dealer_name: string;
  dealer_contact_number: string;
  chassis_number: string;
  issue_details: string;
}): Promise<{ status: string; message: string }> {
  const res = await fetch("/api/raise-service-issue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
