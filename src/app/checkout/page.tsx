"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CheckCircle2,
  ShoppingCart,
  ChevronRight,
  CreditCard,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  formatPrice,
  createRazorpayOrder,
  verifyRazorpayPayment,
  type CheckoutAddress,
  type CheckoutLineItem,
} from "@/lib/api";
import { colors, fonts, styles } from "@/config/theme";
import InnerPageBanner from "@/components/ui/InnerPageBanner";
import LoginModal from "@/components/ui/LoginModal";

// ─── Razorpay global typings (minimal surface used by this page) ─────────────
interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: { description?: string; reason?: string; code?: string };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", cb: (resp: RazorpayFailureResponse) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// Lazily inject the Razorpay checkout script only when payment starts — avoids
// a blocking third-party request on initial render.
function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-rzp-checkout]"
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.dataset.rzpCheckout = "1";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface StateItem {
  code: string;
  name: string;
}

interface CountryStateData {
  country_code: string;
  country_name: string;
  states: StateItem[];
}

interface Address {
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

const emptyAddress = (): Address => ({
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "IN",
  email: "",
  phone: "",
});

// ─── Shared input style ───────────────────────────────────────────────────────
const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white text-gray-700 placeholder-gray-300 transition-colors focus:border-[#AB2323] focus:ring-1 focus:ring-[#AB2323]/20";

const labelClass = "block text-xs text-gray-500 font-medium mb-1";

const selectClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white text-gray-700 transition-colors focus:border-[#AB2323] focus:ring-1 focus:ring-[#AB2323]/20 cursor-pointer";

// ─── Component ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isLoggedIn, isLoading } = useAuth();

  const [billing, setBilling] = useState<Address>(emptyAddress());
  const [shipping, setShipping] = useState<Address>(emptyAddress());
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [countriesData, setCountriesData] = useState<CountryStateData[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Guard: require login to access checkout
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      setShowLoginModal(true);
    }
  }, [isLoading, isLoggedIn]);

  // Pre-fill email from logged-in user
  useEffect(() => {
    if (user?.email) {
      setBilling((b) => ({ ...b, email: user.email }));
    }
  }, [user]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && orderId === null) {
      router.replace("/cart");
    }
  }, [items, orderId, router]);

  // Fetch countries + states from API
  useEffect(() => {
    fetch("https://fleetowebapi.codingcloud.in/wp-json/custom/v1/all-countries-states")
      .then((r) => r.json())
      .then((data: CountryStateData[]) => setCountriesData(data))
      .catch(() => {});
  }, []);

  const setBillingField =
    (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setBilling((b) => ({ ...b, [key]: e.target.value }));

  const setShippingField =
    (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setShipping((s) => ({ ...s, [key]: e.target.value }));

  const handleBillingCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBilling((b) => ({ ...b, country: e.target.value, state: "" }));
  };

  const handleShippingCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShipping((s) => ({ ...s, country: e.target.value, state: "" }));
  };

  const getBillingStates = () =>
    countriesData.find((c) => c.country_code === billing.country)?.states ?? [];

  const getShippingStates = () =>
    countriesData.find((c) => c.country_code === shipping.country)?.states ?? [];

  const buildAddresses = (): { billing: CheckoutAddress; shipping: CheckoutAddress } => {
    const billingFull: CheckoutAddress = {
      first_name: billing.first_name,
      last_name: billing.last_name,
      address_1: billing.address_1,
      address_2: billing.address_2,
      city: billing.city,
      state: billing.state,
      postcode: billing.postcode,
      country: billing.country,
      email: billing.email,
      phone: billing.phone,
    };
    const shippingFull: CheckoutAddress = sameAsBilling
      ? {
          first_name: billing.first_name,
          last_name: billing.last_name,
          address_1: billing.address_1,
          address_2: billing.address_2,
          city: billing.city,
          state: billing.state,
          postcode: billing.postcode,
          country: billing.country,
        }
      : {
          first_name: shipping.first_name,
          last_name: shipping.last_name,
          address_1: shipping.address_1,
          address_2: shipping.address_2,
          city: shipping.city,
          state: shipping.state,
          postcode: shipping.postcode,
          country: shipping.country,
        };
    return { billing: billingFull, shipping: shippingFull };
  };

  const payWithRazorpay = async (
    lineItems: CheckoutLineItem[],
    billingAddr: CheckoutAddress,
    shippingAddr: CheckoutAddress,
    customer_id?: number
  ) => {
    const scriptOk = await loadRazorpayScript();
    if (!scriptOk || !window.Razorpay) {
      setError("Payment gateway failed to load. Please check your connection and try again.");
      setLoading(false);
      return;
    }

    const orderRes = await createRazorpayOrder({
      items: lineItems,
      billing: billingAddr,
      shipping: shippingAddr,
      customer_id,
    });

    if (!orderRes.success || !orderRes.rp_order_id || !orderRes.key_id) {
      setError(orderRes.error ?? "Could not start payment. Please try again.");
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: orderRes.key_id,
      amount: orderRes.amount!,
      currency: orderRes.currency ?? "INR",
      name: "Fleeto",
      description: "Order Payment",
      order_id: orderRes.rp_order_id,
      prefill: {
        name: `${billingAddr.first_name} ${billingAddr.last_name}`.trim(),
        email: billingAddr.email ?? "",
        contact: billingAddr.phone ?? "",
      },
      theme: { color: colors.primary },
      handler: async (resp) => {
        try {
          const verifyRes = await verifyRazorpayPayment({
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
            items: lineItems,
            billing: billingAddr,
            shipping: shippingAddr,
            customer_id,
          });
          if (verifyRes.success && verifyRes.wc_order_id) {
            setOrderId(verifyRes.wc_order_id);
            clearCart();
          } else {
            const ref = verifyRes.payment_id ? ` Reference: ${verifyRes.payment_id}` : "";
            setError(
              (verifyRes.error ?? "Payment verification failed. Please contact support.") +
                ref
            );
          }
        } catch {
          setError(
            `Payment was captured but verification failed. Please contact support with payment ID: ${resp.razorpay_payment_id}`
          );
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setError("Payment cancelled. Your cart is still saved.");
          setLoading(false);
        },
      },
    });

    rzp.on("payment.failed", (resp) => {
      setError(resp?.error?.description ?? "Payment failed. Please try again.");
      setLoading(false);
    });

    rzp.open();
  };

  const placeCodOrder = async (
    lineItems: CheckoutLineItem[],
    billingAddr: CheckoutAddress,
    shippingAddr: CheckoutAddress,
    customer_id?: number
  ) => {
    const payload = {
      payment_method: "cod",
      payment_method_title: "Cash on Delivery",
      set_paid: false,
      billing: billingAddr,
      shipping: shippingAddr,
      line_items: lineItems.map((i) => ({
        product_id: i.product_id,
        ...(i.variation_id > 0 ? { variation_id: i.variation_id } : {}),
        quantity: i.quantity,
      })),
      ...(customer_id ? { customer_id } : {}),
    };
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.error || data?.code) {
        setError(
          data.message ?? data.error ?? "Failed to place order. Please try again."
        );
      } else if (data?.id) {
        setOrderId(data.id);
        clearCart();
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    const { billing: billingAddr, shipping: shippingAddr } = buildAddresses();
    const lineItems: CheckoutLineItem[] = items.map((item) => ({
      product_id: item.product_id,
      variation_id: item.variation_id,
      quantity: item.quantity,
    }));

    if (paymentMethod === "razorpay") {
      await payWithRazorpay(lineItems, billingAddr, shippingAddr, user?.user_id);
    } else {
      await placeCodOrder(lineItems, billingAddr, shippingAddr, user?.user_id);
    }
  };

  // ─── Success screen ─────────────────────────────────────────────────────────
  if (orderId !== null) {
    return (
      <>
        <InnerPageBanner
          title="Order Placed!"
          subtitle="Your order has been confirmed"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Order Confirmed" },
          ]}
          icon={<CheckCircle2 size={22} style={{ color: colors.primary }} />}
        />
        <main className="pb-20 pt-10 px-4" style={{ backgroundColor: "#F7F7F7" }}>
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-10 shadow-sm">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <CheckCircle2 size={38} style={{ color: colors.primary }} />
            </div>
            <h2
              className="text-3xl mb-2"
              style={{ ...styles.headingFont, color: "#010101" }}
            >
              Thank You!
            </h2>
            <p
              className="text-gray-400 text-sm leading-relaxed mb-2"
              style={{ fontFamily: fonts.body }}
            >
              Your order has been placed successfully.
            </p>
            <p
              className="text-sm font-semibold mb-8"
              style={{ color: colors.primary, fontFamily: fonts.body }}
            >
              Order #{orderId}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  fontFamily: fonts.body,
                  ...styles.redButtonShadow,
                }}
              >
                View My Orders <ArrowUpRight size={15} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors"
                style={{ fontFamily: fonts.body }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ─── Checkout form ──────────────────────────────────────────────────────────
  return (
    <>
      {showLoginModal && (
        <LoginModal
          onSuccess={() => setShowLoginModal(false)}
          onClose={() => router.replace("/cart")}
        />
      )}

      <InnerPageBanner
        title="Checkout"
        subtitle="Complete your order"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
        icon={<CreditCard size={22} style={{ color: colors.primary }} />}
      />

      <main className="pb-16 pt-8 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-6xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6"
          >
            {/* ── Left: billing + shipping ── */}
            <div className="space-y-5">

              {/* Billing details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2
                  className="text-lg mb-5 flex items-center gap-2"
                  style={{ ...styles.headingFont, color: "#010101" }}
                >
                  <CreditCard size={18} style={{ color: colors.primary }} />
                  Billing Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      value={billing.first_name}
                      onChange={setBillingField("first_name")}
                      required
                      className={inputClass}
                      style={{ fontFamily: fonts.body }}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={billing.last_name}
                      onChange={setBillingField("last_name")}
                      required
                      className={inputClass}
                      style={{ fontFamily: fonts.body }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={billing.email}
                      onChange={setBillingField("email")}
                      required
                      className={inputClass}
                      style={{ fontFamily: fonts.body }}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={billing.phone}
                      onChange={setBillingField("phone")}
                      required
                      className={inputClass}
                      style={{ fontFamily: fonts.body }}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      Country *
                    </label>
                    <select
                      value={billing.country}
                      onChange={handleBillingCountryChange}
                      required
                      className={selectClass}
                      style={{ fontFamily: fonts.body }}
                    >
                      <option value="">Select Country</option>
                      {countriesData.map((c) => (
                        <option key={c.country_code} value={c.country_code}>
                          {c.country_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      placeholder="Street address, house number"
                      value={billing.address_1}
                      onChange={setBillingField("address_1")}
                      required
                      className={inputClass}
                      style={{ fontFamily: fonts.body }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={billing.address_2}
                      onChange={setBillingField("address_2")}
                      className={inputClass}
                      style={{ fontFamily: fonts.body }}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="Kolkata"
                      value={billing.city}
                      onChange={setBillingField("city")}
                      required
                      className={inputClass}
                      style={{ fontFamily: fonts.body }}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      State *
                    </label>
                    {getBillingStates().length > 0 ? (
                      <select
                        value={billing.state}
                        onChange={setBillingField("state")}
                        required
                        className={selectClass}
                        style={{ fontFamily: fonts.body }}
                      >
                        <option value="">Select State</option>
                        {getBillingStates().map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="State / Province"
                        value={billing.state}
                        onChange={setBillingField("state")}
                        className={inputClass}
                        style={{ fontFamily: fonts.body }}
                      />
                    )}
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: fonts.body }}>
                      Postcode *
                    </label>
                    <input
                      type="text"
                      placeholder="700001"
                      value={billing.postcode}
                      onChange={setBillingField("postcode")}
                      required
                      className={inputClass}
                      style={{ fontFamily: fonts.body }}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2
                    className="text-lg flex items-center gap-2"
                    style={{ ...styles.headingFont, color: "#010101" }}
                  >
                    <Truck size={18} style={{ color: colors.primary }} />
                    Shipping Details
                  </h2>
                  <label
                    className="flex items-center gap-2 cursor-pointer select-none"
                    style={{ fontFamily: fonts.body }}
                  >
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="w-4 h-4 accent-[#AB2323]"
                    />
                    <span className="text-xs text-gray-500">Same as billing</span>
                  </label>
                </div>

                {sameAsBilling ? (
                  <p className="text-sm text-gray-400" style={{ fontFamily: fonts.body }}>
                    Shipping to the same address as billing.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} style={{ fontFamily: fonts.body }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        value={shipping.first_name}
                        onChange={setShippingField("first_name")}
                        required
                        className={inputClass}
                        style={{ fontFamily: fonts.body }}
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: fonts.body }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={shipping.last_name}
                        onChange={setShippingField("last_name")}
                        required
                        className={inputClass}
                        style={{ fontFamily: fonts.body }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} style={{ fontFamily: fonts.body }}>
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        placeholder="Street address, house number"
                        value={shipping.address_1}
                        onChange={setShippingField("address_1")}
                        required
                        className={inputClass}
                        style={{ fontFamily: fonts.body }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} style={{ fontFamily: fonts.body }}>
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment, suite, etc. (optional)"
                        value={shipping.address_2}
                        onChange={setShippingField("address_2")}
                        className={inputClass}
                        style={{ fontFamily: fonts.body }}
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: fonts.body }}>
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="Kolkata"
                        value={shipping.city}
                        onChange={setShippingField("city")}
                        required
                        className={inputClass}
                        style={{ fontFamily: fonts.body }}
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: fonts.body }}>
                        State *
                      </label>
                      {getShippingStates().length > 0 ? (
                        <select
                          value={shipping.state}
                          onChange={setShippingField("state")}
                          required
                          className={selectClass}
                          style={{ fontFamily: fonts.body }}
                        >
                          <option value="">Select State</option>
                          {getShippingStates().map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="State / Province"
                          value={shipping.state}
                          onChange={setShippingField("state")}
                          className={inputClass}
                          style={{ fontFamily: fonts.body }}
                        />
                      )}
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: fonts.body }}>
                        Postcode *
                      </label>
                      <input
                        type="text"
                        placeholder="700001"
                        value={shipping.postcode}
                        onChange={setShippingField("postcode")}
                        required
                        className={inputClass}
                        style={{ fontFamily: fonts.body }}
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: fonts.body }}>
                        Country *
                      </label>
                      <select
                        value={shipping.country}
                        onChange={handleShippingCountryChange}
                        required
                        className={selectClass}
                        style={{ fontFamily: fonts.body }}
                      >
                        <option value="">Select Country</option>
                        {countriesData.map((c) => (
                          <option key={c.country_code} value={c.country_code}>
                            {c.country_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2
                  className="text-lg mb-4"
                  style={{ ...styles.headingFont, color: "#010101" }}
                >
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-colors ${
                      paymentMethod === "razorpay"
                        ? "border-[#AB2323] bg-[#AB2323]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ fontFamily: fonts.body }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-[#AB2323]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Pay Online (Razorpay)
                      </p>
                      <p className="text-xs text-gray-400">
                        Cards, UPI, Netbanking, Wallets — secured by Razorpay
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ── Right: order summary + submit ── */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
                <h2
                  className="text-lg mb-4"
                  style={{ ...styles.headingFont, color: "#010101" }}
                >
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.key} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart size={16} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold text-gray-800 truncate"
                          style={{ fontFamily: fonts.body }}
                        >
                          {item.name}
                        </p>
                        {item.color && (
                          <p
                            className="text-xs text-gray-400 capitalize"
                            style={{ fontFamily: fonts.body }}
                          >
                            {item.color}
                          </p>
                        )}
                        <p
                          className="text-xs text-gray-500"
                          style={{ fontFamily: fonts.body }}
                        >
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p
                        className="text-xs font-bold flex-shrink-0"
                        style={{ color: colors.primary, fontFamily: fonts.body }}
                      >
                        {formatPrice(
                          String(parseInt(item.price, 10) * item.quantity)
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 mb-4" />

                {/* Totals */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between">
                    <span
                      className="text-sm text-gray-500"
                      style={{ fontFamily: fonts.body }}
                    >
                      Subtotal
                    </span>
                    <span
                      className="text-sm font-bold text-gray-900"
                      style={{ fontFamily: fonts.body }}
                    >
                      {totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-sm text-gray-500"
                      style={{ fontFamily: fonts.body }}
                    >
                      Shipping
                    </span>
                    <span
                      className="text-sm text-green-600 font-medium"
                      style={{ fontFamily: fonts.body }}
                    >
                      Free
                    </span>
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between">
                    <span
                      className="text-sm font-semibold text-gray-800"
                      style={{ fontFamily: fonts.body }}
                    >
                      Total
                    </span>
                    <span
                      className="text-base font-bold"
                      style={{ color: colors.primary, fontFamily: fonts.body }}
                    >
                      {totalPrice}
                    </span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p
                    className="text-xs text-red-500 mb-3 text-center"
                    style={{ fontFamily: fonts.body }}
                  >
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-white text-sm font-semibold rounded-full disabled:opacity-60 transition-colors"
                  style={{
                    backgroundColor: colors.primary,
                    fontFamily: fonts.body,
                    ...styles.redButtonShadow,
                  }}
                  onMouseEnter={(e) =>
                    !loading &&
                    (e.currentTarget.style.backgroundColor = "#8A1A1A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primary)
                  }
                >
                  {loading ? (
                    paymentMethod === "razorpay" ? "Processing Payment…" : "Placing Order…"
                  ) : (
                    <>
                      {paymentMethod === "razorpay" ? `Pay ${totalPrice}` : "Place Order"}
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors mt-3"
                  style={{ fontFamily: fonts.body }}
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
