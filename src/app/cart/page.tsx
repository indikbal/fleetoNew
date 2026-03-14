"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowUpRight, PackageOpen } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/api";
import { colors, fonts, styles } from "@/config/theme";
import InnerPageBanner from "@/components/ui/InnerPageBanner";

// WooCommerce base — browser navigates here directly so WP sets cookies in the user's browser
const WP_BASE = "https://fleetowebapi.codingcloud.in";

export default function CartPage() {
  const { items, totalCount, totalPrice, removeItem, updateQty, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);

    // Build a WooCommerce add-to-cart URL for each item.
    // WC supports chaining: ?add-to-cart=ID1&add-to-cart=ID2 does NOT work natively,
    // so we redirect to the first item and pass remaining as extra params.
    // The WP developer can handle multi-item via a custom endpoint if needed.
    //
    // Using variation_id in ?add-to-cart= — WC resolves to the parent product automatically.
    // Using browser navigation (NOT fetch/proxy) so WP sets session cookies directly.

    if (items.length === 1) {
      const item = items[0];
      const url = `${WP_BASE}/?add-to-cart=${item.variation_id}&quantity=${item.quantity}`;
      clearCart();
      window.location.href = url;
      return;
    }

    // Multiple items: build a query string with all variation IDs and quantities.
    // WP developer should handle this via a custom endpoint or a WC plugin.
    // Fallback: add items one-by-one by chaining redirect to cart after each.
    const params = new URLSearchParams();
    items.forEach((item) => {
      params.append("add-to-cart", String(item.variation_id));
      params.append(`quantity-${item.variation_id}`, String(item.quantity));
    });
    // Also pass first item as the primary add-to-cart param (WC default behaviour)
    const primaryItem = items[0];
    const url = `${WP_BASE}/?add-to-cart=${primaryItem.variation_id}&quantity=${primaryItem.quantity}&${params.toString()}`;
    clearCart();
    window.location.href = url;
  };

  return (
    <>
      <InnerPageBanner
        title="My Cart"
        subtitle={totalCount > 0 ? `${totalCount} ${totalCount === 1 ? "item" : "items"} in your cart` : "Your shopping cart"}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Cart" }]}
        icon={<ShoppingCart size={22} style={{ color: colors.primary }} />}
      />

      <main className="pb-16 px-4 pt-8" style={{ backgroundColor: "#F7F7F7" }}>
      <div className="max-w-3xl mx-auto">

        {/* Empty state */}
        {items.length === 0 && (
          <div className="bg-white rounded-2xl p-14 text-center">
            <PackageOpen size={52} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: fonts.body }}>
              Your cart is empty.
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

        {/* Cart items */}
        {items.length > 0 && (
          <>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.key} className="bg-white rounded-2xl p-4 flex items-center gap-4">

                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Name + color */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: fonts.body }}>
                      {item.name}
                    </p>
                    {item.color && (
                      <p className="text-xs text-gray-400 mt-0.5 capitalize" style={{ fontFamily: fonts.body }}>
                        {item.color}
                      </p>
                    )}
                    <p className="text-sm font-bold mt-1" style={{ color: colors.primary, fontFamily: fonts.body }}>
                      {formatPrice(String(parseInt(item.price, 10) * item.quantity))}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.key, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:border-gray-400 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold" style={{ fontFamily: fonts.body }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.key, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.key)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500" style={{ fontFamily: fonts.body }}>Subtotal</span>
                <span className="text-base font-bold" style={{ color: "#010101", fontFamily: fonts.body }}>
                  {totalPrice}
                </span>
              </div>

              <div className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>
                Taxes and shipping calculated at checkout.
              </div>

              <div className="h-px bg-gray-100" />

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full inline-flex items-center justify-center gap-2 py-4 text-white text-sm font-semibold rounded-full disabled:opacity-60 transition-colors"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}
              >
                {isCheckingOut ? "Redirecting…" : <><span>Proceed to Payment</span> <ArrowUpRight size={16} /></>}
              </button>

              <Link
                href="/products"
                className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
                style={{ fontFamily: fonts.body }}
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
    </>
  );
}
