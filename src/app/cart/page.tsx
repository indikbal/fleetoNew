"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowUpRight, PackageOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchMyCart, formatPrice, type CartItem } from "@/lib/api";
import { colors, fonts, styles } from "@/config/theme";

export default function CartPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/login");
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!user) return;
    fetchMyCart(user.user_id)
      .then(setItems)
      .catch(() => setError("Could not load your cart. Please try again."))
      .finally(() => setIsFetching(false));
  }, [user]);

  const cartTotal = items.reduce((sum, item) => {
    const num = parseInt(item.total ?? item.price, 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

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
            <ShoppingCart size={18} style={{ color: colors.primary }} />
          </div>
          <h1 className="text-2xl" style={{ ...styles.headingFont, color: "#010101" }}>
            My Cart
          </h1>
        </div>

        {/* Loading skeleton */}
        {isFetching && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-white animate-pulse" />
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
        {!isFetching && !error && items.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <PackageOpen size={48} className="mx-auto mb-4 text-gray-300" />
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
        {!isFetching && !error && items.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item, i) => (
                <div key={item.product_id ?? i} className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  {/* Product image */}
                  {item.image ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart size={20} className="text-gray-300" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: fonts.body }}>
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: fonts.body }}>
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-semibold flex-shrink-0" style={{ color: colors.primary, fontFamily: fonts.body }}>
                    {formatPrice(item.total ?? item.price)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-white rounded-2xl p-5 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: fonts.body }}>
                Total
              </span>
              <span className="text-lg font-bold" style={{ color: "#010101", fontFamily: fonts.body }}>
                {formatPrice(String(cartTotal))}
              </span>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
