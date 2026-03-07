"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ArrowUpRight, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, fonts, styles } from "@/config/theme";
import { colorNameToHex, formatPrice } from "@/lib/api";
import type { WCProduct, WCVariation } from "@/lib/api";
import Link from "next/link";

interface Props {
  product: WCProduct;
  onClose: () => void;
}

type Status = "idle" | "loading-vars" | "ready" | "submitting" | "success" | "error";

export default function SelectOptionModal({ product, onClose }: Props) {
  const [variations, setVariations] = useState<WCVariation[]>([]);
  const [selected, setSelected]     = useState<WCVariation | null>(null);
  const [status, setStatus]         = useState<Status>("loading-vars");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Fetch variations
  useEffect(() => {
    fetch(`/api/variations/${product.id}`)
      .then((r) => r.json())
      .then((data: WCVariation[]) => {
        setVariations(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => {
        setVariations([]);
        setStatus("ready");
      });
  }, [product.id]);

  const handleAddToCart = useCallback(async () => {
    if (!selected) return;
    setStatus("submitting");

    try {
      const res  = await fetch("/api/cart", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ product_id: product.id, variation_id: selected.id, quantity: 1 }),
      });
      const data = await res.json() as { error?: string };

      if (!data.error) {
        setStatus("success");
      } else {
        // API not ready yet — redirect user to WooCommerce product page with colour pre-selected
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [product.id, selected]);

  const imageUrl  = product.images[0]?.src ?? "/images/hero-scooty.png";
  const isLoading = status === "loading-vars" || status === "submitting";

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      >
        {/* Modal panel */}
        <motion.div
          key="panel"
          className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: "#fff" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
          >
            <X size={16} />
          </button>

          {/* ── Success state ── */}
          {status === "success" && (
            <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
              <CheckCircle size={52} style={{ color: colors.primary }} />
              <h3 className="text-xl font-bold" style={{ ...styles.headingFont, color: colors.black }}>
                Added to Cart!
              </h3>
              <p className="text-gray-500 text-sm" style={{ fontFamily: fonts.body }}>
                {product.name} ({selected?.attributes[0]?.option}) has been added to your cart.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-7 py-3 text-white text-sm font-semibold rounded-full btn-red-inner-shadow"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
              >
                Continue Browsing
              </button>
            </div>
          )}

          {/* ── Error state: redirect to store ── */}
          {status === "error" && (
            <div className="flex flex-col items-center justify-center gap-5 p-10 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <ArrowUpRight size={28} style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ ...styles.headingFont, color: colors.black }}>
                  One more step!
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: fonts.body }}>
                  Complete your purchase for the{" "}
                  <span style={{ color: colors.primary, fontWeight: 600 }}>
                    {selected?.attributes[0]?.option} {product.name}
                  </span>{" "}
                  on our store.
                </p>
              </div>
              <div className="flex flex-col w-full gap-3">
                {selected?.permalink && (
                  <a
                    href={selected.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-white text-sm font-semibold rounded-xl btn-red-inner-shadow"
                    style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                  >
                    Complete Purchase
                    <ArrowUpRight size={15} />
                  </a>
                )}
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="w-full flex items-center justify-center py-3.5 text-sm font-semibold rounded-xl border"
                  style={{ borderColor: "#E5E7EB", color: "#6B7280", fontFamily: fonts.body }}
                >
                  Talk to an Expert
                </Link>
              </div>
            </div>
          )}

          {/* ── Normal state ── */}
          {status !== "success" && status !== "error" && (
            <>
              {/* Product image */}
              <div
                className="relative w-full h-48 flex items-center justify-center"
                style={{ backgroundColor: "#FFF5F5" }}
              >
                <Image
                  src={selected?.image?.src ?? imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain object-center p-6 drop-shadow-md"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-5">

                {/* Name + price */}
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-xl font-bold leading-tight"
                    style={{ color: colors.black, fontFamily: fonts.body }}
                  >
                    {product.name}
                  </h3>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400" style={{ fontFamily: fonts.body }}>From</p>
                    <p className="font-bold text-lg" style={{ color: colors.primary, fontFamily: fonts.body }}>
                      {formatPrice(selected?.price ?? product.price)}
                    </p>
                  </div>
                </div>

                {/* Color picker */}
                {status === "loading-vars" ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm" style={{ fontFamily: fonts.body }}>
                    <Loader2 size={16} className="animate-spin" />
                    Loading options…
                  </div>
                ) : variations.length > 0 ? (
                  <div>
                    <p
                      className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider"
                      style={{ fontFamily: fonts.body }}
                    >
                      Choose Colour
                      {selected && (
                        <span className="ml-2 normal-case text-gray-400">
                          — {selected.attributes[0]?.option}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {variations.map((v) => {
                        const colorName = v.attributes[0]?.option ?? "";
                        const hex       = colorNameToHex(colorName);
                        const isActive  = selected?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelected(v)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all text-sm font-medium"
                            style={{
                              borderColor:     isActive ? colors.primary : "#E5E7EB",
                              backgroundColor: isActive ? `${colors.primary}10` : "#fff",
                              fontFamily:      fonts.body,
                              color:           isActive ? colors.primary : "#374151",
                            }}
                          >
                            <span
                              className="w-4 h-4 rounded-full flex-shrink-0 border border-white shadow-sm"
                              style={{ backgroundColor: hex }}
                            />
                            {colorName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400" style={{ fontFamily: fonts.body }}>
                    No colour variants available.
                  </p>
                )}

                {/* Divider */}
                <div className="h-px bg-gray-100" />

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selected || isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-white text-sm font-semibold rounded-xl btn-red-inner-shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                    onMouseEnter={(e) => { if (!isLoading && selected) e.currentTarget.style.backgroundColor = colors.primaryDark; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primary; }}
                  >
                    {status === "submitting" ? (
                      <><Loader2 size={16} className="animate-spin" /> Adding…</>
                    ) : (
                      <>Add to Cart <ArrowUpRight size={15} /></>
                    )}
                  </button>

                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="w-full flex items-center justify-center py-3.5 text-sm font-semibold rounded-xl border"
                    style={{ borderColor: "#E5E7EB", color: "#6B7280", fontFamily: fonts.body }}
                  >
                    Talk to an Expert
                  </Link>
                </div>

              </div>
            </>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
