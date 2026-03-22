"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, PackageOpen, ChevronDown, ChevronUp, ArrowUpRight, Download, MapPin, CreditCard, Truck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchMyOrders, fetchOrderDetails, downloadInvoice, formatPrice, type OrderSummary, type OrderDetails, type OrderAddress } from "@/lib/api";
import { colors, fonts, styles } from "@/config/theme";
import InnerPageBanner from "@/components/ui/InnerPageBanner";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  completed:  { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  processing: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  pending:    { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  cancelled:  { bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444" },
  refunded:   { bg: "#F5F3FF", text: "#7C3AED", dot: "#A855F7" },
  "on-hold":  { bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
};

function statusStyle(status: string) {
  return STATUS_STYLES[status.toLowerCase()] ?? { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" };
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatAddr(addr: OrderAddress | undefined) {
  if (!addr || !addr.address_1) return null;
  const name = [addr.first_name, addr.last_name].filter(Boolean).join(" ");
  const line1 = [addr.address_1, addr.address_2].filter(Boolean).join(", ");
  const line2 = [addr.city, addr.state, addr.postcode].filter(Boolean).join(", ");
  return { name, line1, line2, country: addr.country, phone: addr.phone, email: addr.email };
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Cache of fetched order details keyed by order id
  const [detailsCache, setDetailsCache] = useState<Record<number, OrderDetails>>({});
  const [detailsLoading, setDetailsLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/login");
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!user) return;
    fetchMyOrders(user.user_id)
      .then(setOrders)
      .catch(() => setError("Could not load your orders. Please try again."))
      .finally(() => setIsFetching(false));
  }, [user]);

  const handleExpand = useCallback(async (orderId: number) => {
    // Collapse if already open
    if (expanded === orderId) {
      setExpanded(null);
      return;
    }

    setExpanded(orderId);

    // Fetch details if not cached
    if (!detailsCache[orderId]) {
      setDetailsLoading(orderId);
      try {
        const details = await fetchOrderDetails(orderId);
        if (details) {
          setDetailsCache((prev) => ({ ...prev, [orderId]: details }));
        }
      } catch {
        // Silently fail — we'll still show line items from the summary
      } finally {
        setDetailsLoading(null);
      }
    }
  }, [expanded, detailsCache]);

  if (isLoading || (!isLoggedIn && !isFetching)) return null;

  return (
    <>
      <InnerPageBanner
        title="My Orders"
        subtitle="Track and view your order history"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Orders" }]}
        icon={<ShoppingBag size={22} style={{ color: colors.primary }} />}
      />

      <main className="pb-16 px-4 pt-8" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">

          {/* Loading skeleton */}
          {isFetching && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-white animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {!isFetching && error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-sm" style={{ fontFamily: fonts.body }}>
              {error}
            </div>
          )}

          {/* Empty state */}
          {!isFetching && !error && orders.length === 0 && (
            <div className="bg-white rounded-2xl p-14 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                <PackageOpen size={28} style={{ color: colors.primary }} />
              </div>
              <h3 className="text-lg mb-2" style={{ ...styles.headingFont, color: "#010101" }}>
                No Orders Yet
              </h3>
              <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: fonts.body }}>
                You haven&apos;t placed any orders yet. Start shopping!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}
              >
                Browse Products <ArrowUpRight size={15} />
              </Link>
            </div>
          )}

          {/* Orders list */}
          {!isFetching && !error && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => {
                const { bg, text, dot } = statusStyle(order.status);
                const isOpen = expanded === order.id;
                const details = detailsCache[order.id];
                const isLoadingDetails = detailsLoading === order.id;

                // Use details data when available, fallback to summary
                const lineItems = details?.line_items ?? order.line_items ?? [];
                const billing = details ? formatAddr(details.billing) : null;
                const shipping = details ? formatAddr(details.shipping) : null;
                const hasDiscount = details && parseFloat(details.discount) > 0;
                const hasShipping = details && parseFloat(details.shipping_cost) > 0;
                const hasTax = details && parseFloat(details.tax) > 0;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl overflow-hidden border border-transparent hover:border-gray-100 transition-colors"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                  >
                    {/* Order row */}
                    <button
                      onClick={() => handleExpand(order.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/60 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}12` }}
                      >
                        <ShoppingBag size={15} style={{ color: colors.primary }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: fonts.body }}>
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: fonts.body }}>
                          {formatDate(order.date_created)}
                        </p>
                      </div>

                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full capitalize flex-shrink-0 hidden sm:flex"
                        style={{ backgroundColor: bg, color: text, fontFamily: fonts.body }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                        {order.status}
                      </span>

                      <span className="text-sm font-bold flex-shrink-0" style={{ color: "#010101", fontFamily: fonts.body }}>
                        {formatPrice(order.total)}
                      </span>

                      <span className="text-gray-300 flex-shrink-0">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </button>

                    {/* Mobile status */}
                    <div className="px-5 pb-2 sm:hidden">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full capitalize"
                        style={{ backgroundColor: bg, color: text, fontFamily: fonts.body }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot }} />
                        {order.status}
                      </span>
                    </div>

                    {/* Expanded order details */}
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 pb-5 pt-4">

                        {/* Loading indicator for details */}
                        {isLoadingDetails && (
                          <div className="flex items-center justify-center gap-2 py-4 text-gray-400">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-xs" style={{ fontFamily: fonts.body }}>Loading order details…</span>
                          </div>
                        )}

                        {/* Items */}
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3" style={{ fontFamily: fonts.body }}>
                          Items
                        </p>
                        <div className="space-y-3">
                          {lineItems.map((item, i) => (
                            <div key={item.product_id ?? i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                              <div>
                                <p className="text-sm font-medium text-gray-800" style={{ fontFamily: fonts.body }}>{item.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: fonts.body }}>Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: fonts.body }}>
                                {formatPrice(item.total)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Price breakdown — only shown after details loaded */}
                        {details && (
                          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                            {hasDiscount && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>Discount</span>
                                <span className="text-xs font-medium text-green-600" style={{ fontFamily: fonts.body }}>-{formatPrice(details.discount)}</span>
                              </div>
                            )}
                            {hasShipping && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>Shipping</span>
                                <span className="text-xs font-medium text-gray-600" style={{ fontFamily: fonts.body }}>{formatPrice(details.shipping_cost)}</span>
                              </div>
                            )}
                            {hasTax && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>Tax</span>
                                <span className="text-xs font-medium text-gray-600" style={{ fontFamily: fonts.body }}>{formatPrice(details.tax)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Order total */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: fonts.body }}>Order Total</span>
                          <span className="text-base font-bold" style={{ color: "#010101", fontFamily: fonts.body }}>{formatPrice(order.total)}</span>
                        </div>

                        {/* Payment method — only after details loaded */}
                        {details?.payment_method && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                              <CreditCard size={13} className="text-gray-400" />
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest" style={{ fontFamily: fonts.body }}>Payment Method</span>
                            </div>
                            <p className="text-sm text-gray-700 ml-5" style={{ fontFamily: fonts.body }}>{details.payment_method}</p>
                          </div>
                        )}

                        {/* Billing & Shipping addresses — only after details loaded */}
                        {details && (billing || shipping) && (
                          <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {billing && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin size={13} className="text-gray-400" />
                                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest" style={{ fontFamily: fonts.body }}>Billing Address</span>
                                </div>
                                <div className="ml-5 space-y-0.5">
                                  <p className="text-sm font-medium text-gray-800" style={{ fontFamily: fonts.body }}>{billing.name}</p>
                                  <p className="text-xs text-gray-500" style={{ fontFamily: fonts.body }}>{billing.line1}</p>
                                  <p className="text-xs text-gray-500" style={{ fontFamily: fonts.body }}>{billing.line2}</p>
                                  {billing.phone && <p className="text-xs text-gray-500" style={{ fontFamily: fonts.body }}>Phone: {billing.phone}</p>}
                                  {billing.email && <p className="text-xs text-gray-500" style={{ fontFamily: fonts.body }}>{billing.email}</p>}
                                </div>
                              </div>
                            )}
                            {shipping && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Truck size={13} className="text-gray-400" />
                                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest" style={{ fontFamily: fonts.body }}>Shipping Address</span>
                                </div>
                                <div className="ml-5 space-y-0.5">
                                  <p className="text-sm font-medium text-gray-800" style={{ fontFamily: fonts.body }}>{shipping.name}</p>
                                  <p className="text-xs text-gray-500" style={{ fontFamily: fonts.body }}>{shipping.line1}</p>
                                  <p className="text-xs text-gray-500" style={{ fontFamily: fonts.body }}>{shipping.line2}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Download Invoice */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <button
                            onClick={async () => {
                              setDownloadingId(order.id);
                              try {
                                await downloadInvoice(order.id);
                              } catch (e) {
                                console.error(e);
                              } finally {
                                setDownloadingId(null);
                              }
                            }}
                            disabled={downloadingId === order.id}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors disabled:opacity-60"
                            style={{
                              borderColor: colors.primary,
                              color: colors.primary,
                              fontFamily: fonts.body,
                              backgroundColor: `${colors.primary}08`,
                            }}
                          >
                            <Download size={13} />
                            {downloadingId === order.id ? "Downloading\u2026" : "Download Invoice"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
