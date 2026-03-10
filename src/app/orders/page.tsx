"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, PackageOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchMyOrders, formatPrice, type Order } from "@/lib/api";
import { colors, fonts, styles } from "@/config/theme";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  completed:  { bg: "#F0FDF4", text: "#15803D" },
  processing: { bg: "#EFF6FF", text: "#1D4ED8" },
  pending:    { bg: "#FFFBEB", text: "#B45309" },
  cancelled:  { bg: "#FEF2F2", text: "#DC2626" },
  refunded:   { bg: "#F5F3FF", text: "#7C3AED" },
  "on-hold":  { bg: "#F9FAFB", text: "#6B7280" },
};

function statusStyle(status: string) {
  return STATUS_STYLES[status.toLowerCase()] ?? { bg: "#F3F4F6", text: "#374151" };
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
    <main className="min-h-screen pt-24 pb-16 px-4" style={{ backgroundColor: "#F7F7F7" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <ShoppingBag size={18} style={{ color: colors.primary }} />
          </div>
          <h1 className="text-2xl" style={{ ...styles.headingFont, color: "#010101" }}>
            My Orders
          </h1>
        </div>

        {/* Loading skeleton */}
        {isFetching && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-white animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!isFetching && error && (
          <div className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl text-sm" style={{ fontFamily: fonts.body }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!isFetching && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <PackageOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm" style={{ fontFamily: fonts.body }}>
              You haven&apos;t placed any orders yet.
            </p>
          </div>
        )}

        {/* Orders list */}
        {!isFetching && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const { bg, text } = statusStyle(order.status);
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className="bg-white rounded-2xl overflow-hidden">

                  {/* Order row */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    {/* Order # */}
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
                      className="text-xs font-medium px-3 py-1 rounded-full capitalize flex-shrink-0"
                      style={{ backgroundColor: bg, color: text, fontFamily: fonts.body }}
                    >
                      {order.status}
                    </span>

                    {/* Total */}
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: "#010101", fontFamily: fonts.body }}>
                      {formatPrice(order.total)} <span className="text-xs font-normal text-gray-400">{order.currency}</span>
                    </span>

                    {/* Chevron */}
                    {isOpen ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                  </button>

                  {/* Expanded line items */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-3">
                      {(order.line_items ?? []).map((item, i) => (
                        <div key={item.product_id ?? i} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-800" style={{ fontFamily: fonts.body }}>{item.name}</p>
                            <p className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium" style={{ color: colors.primary, fontFamily: fonts.body }}>
                            {formatPrice(item.total)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
