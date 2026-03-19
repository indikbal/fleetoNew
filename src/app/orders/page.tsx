"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, PackageOpen, ChevronDown, ChevronUp, ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchMyOrders, downloadInvoice, formatPrice, type Order } from "@/lib/api";
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

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl overflow-hidden border border-transparent hover:border-gray-100 transition-colors"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                  >
                    {/* Order row */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Order icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}12` }}
                      >
                        <ShoppingBag size={15} style={{ color: colors.primary }} />
                      </div>

                      {/* Order # + date */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: fonts.body }}>
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: fonts.body }}>
                          {formatDate(order.date_created)}
                        </p>
                      </div>

                      {/* Status badge */}
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full capitalize flex-shrink-0 hidden sm:flex"
                        style={{ backgroundColor: bg, color: text, fontFamily: fonts.body }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                        {order.status}
                      </span>

                      {/* Total */}
                      <span className="text-sm font-bold flex-shrink-0" style={{ color: "#010101", fontFamily: fonts.body }}>
                        {formatPrice(order.total)}
                      </span>

                      {/* Chevron */}
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

                    {/* Expanded line items */}
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3" style={{ fontFamily: fonts.body }}>
                          Items
                        </p>
                        <div className="space-y-3">
                          {(order.line_items ?? []).map((item, i) => (
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
                        {/* Order total row */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: fonts.body }}>Order Total</span>
                          <span className="text-base font-bold" style={{ color: "#010101", fontFamily: fonts.body }}>{formatPrice(order.total)}</span>
                        </div>

                        {/* Download Invoice */}
                        <div className="mt-4">
                          <button
                            onClick={async () => {
                              if (!user) return;
                              setIsDownloading(true);
                              try {
                                await downloadInvoice(user.user_id, order.id);
                              } catch (e) {
                                console.error(e);
                              } finally {
                                setIsDownloading(false);
                              }
                            }}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors disabled:opacity-60"
                            style={{
                              borderColor: colors.primary,
                              color: colors.primary,
                              fontFamily: fonts.body,
                              backgroundColor: `${colors.primary}08`,
                            }}
                          >
                            <Download size={13} />
                            {isDownloading ? "Downloading…" : "Download Invoice"}
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
