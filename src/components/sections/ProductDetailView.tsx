"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link"; // used for Book Test Ride
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingCart, CheckCircle } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";
import { colorNameToHex, formatPrice } from "@/lib/api";
import type { WCProductDetail, ProductVariation } from "@/lib/api";
import { useCart } from "@/context/CartContext";

interface Props {
  product: WCProductDetail;
}

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.55, ease: "easeOut" as const, delay },
});

export default function ProductDetailView({ product }: Props) {
  const [selected, setSelected]       = useState<ProductVariation | null>(null);
  const [cartStatus, setCartStatus]   = useState<"idle" | "added">("idle");
  const [activeImage, setActiveImage] = useState(product.image || "/images/hero-scooty.png");
  const { addItem } = useCart();

  const handleSelect = (v: ProductVariation) => {
    setSelected(v);
    if (v.image) setActiveImage(v.image);
  };

  const handleAddToCart = useCallback(() => {
    if (!selected) return;
    const colorName = Object.values(selected.attributes)[0] ?? "";
    addItem({
      product_id:   product.id,
      variation_id: selected.variation_id,
      name:         product.title,
      color:        colorName,
      price:        selected.price || product.price,
      image:        selected.image || product.image || "",
      permalink:    "",
    });
    setCartStatus("added");
    setTimeout(() => setCartStatus("idle"), 3000);
  }, [product, selected, addItem]);

  return (
    <section
      id="product-detail"
      className="relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-24"
      style={{ backgroundColor: "#FFF5F5" }}
    >
      {/* ── SVG watermark (same style as RideEasy / other sections) ── */}
      <motion.div
        className="absolute top-0 inset-x-0 pointer-events-none select-none"
        style={{ zIndex: 0 }}
        initial={{ y: "8vw", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 1200 160"
          width="100%"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="productDetailGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor="#FFF5F5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <text
            x="600" y="145"
            textAnchor="middle"
            fill="none"
            stroke="url(#productDetailGrad)"
            strokeWidth="1"
            fontSize="120"
            style={{ fontFamily: fonts.display }}
          >
            {product.title || "PRODUCT"}
          </text>
        </svg>
      </motion.div>

      {/* ── Content ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "10%" }}
      >
        {/* ── White card ── */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: product image ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div
                className="relative w-full rounded-2xl overflow-hidden"
                style={{ height: "400px", backgroundColor: "#FFF5F5", border: "1px solid #F0E0E0" }}
              >
                <Image
                  src={activeImage}
                  alt={product.title || "Product image"}
                  fill
                  className="object-contain object-center p-8 drop-shadow-md"
                  priority
                />
              </div>

              {/* Colour-image thumbnails if variations have distinct images */}
              {product.variations?.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {product.variations.map((v) => (
                    <button
                      key={v.variation_id}
                      onClick={() => handleSelect(v)}
                      className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all"
                      style={{
                        borderColor:     selected?.variation_id === v.variation_id ? colors.primary : "#E6E6E6",
                        backgroundColor: "#FFF5F5",
                      }}
                    >
                      <Image
                        src={v.image || product.image}
                        alt={Object.values(v.attributes)[0] || "variant"}
                        width={56}
                        height={56}
                        className="object-contain w-full h-full p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Right: product info ── */}
            <div className="flex flex-col gap-5">

              {/* Title */}
              <motion.h2
                {...fadeUp(0.15)}
                className="text-4xl md:text-5xl leading-tight"
                style={{ ...styles.headingFont, color: colors.black }}
              >
                {product.title}
              </motion.h2>

              {/* Price */}
              <motion.div {...fadeUp(0.2)} className="flex items-baseline gap-2">
                <span
                  className="text-3xl font-bold"
                  style={{ color: colors.primary, fontFamily: fonts.body }}
                >
                  {formatPrice(selected?.price ?? product.price)}
                </span>
                <span className="text-sm text-gray-400" style={{ fontFamily: fonts.body }}>
                  onwards
                </span>
              </motion.div>

              {/* Specs (desc is an HTML <ul> list) */}
              {product.desc && (
                <motion.div
                  {...fadeUp(0.23)}
                  className="
                    text-sm text-gray-500
                    [&_ul]:flex [&_ul]:flex-wrap [&_ul]:gap-2 [&_ul]:p-0 [&_ul]:m-0
                    [&_li]:list-none [&_li]:rounded-full [&_li]:px-3.5 [&_li]:py-1.5
                    [&_li]:text-sm [&_li]:font-medium
                  "
                  style={{
                    fontFamily: fonts.body,
                    // pill styling via inline so Tailwind purge can't strip runtime values
                  }}
                >
                  <style>{`
                    .spec-pills li {
                      background: #FFF5F5;
                      border: 1px solid #F0E0E0;
                      color: #374151;
                    }
                  `}</style>
                  <div
                    className="spec-pills"
                    dangerouslySetInnerHTML={{ __html: product.desc }}
                  />
                </motion.div>
              )}

              <div className="h-px bg-gray-100" />

              {/* Colour picker */}
              {product.variations?.length > 0 && (
                <motion.div {...fadeUp(0.27)}>
                  <p
                    className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider"
                    style={{ fontFamily: fonts.body }}
                  >
                    Choose Colour
                    {selected && (
                      <span className="ml-2 normal-case text-gray-400 font-normal">
                        — {Object.values(selected.attributes)[0]}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variations.map((v) => {
                      const colorName = Object.values(v.attributes)[0] ?? "";
                      const hex       = colorNameToHex(colorName);
                      const isActive  = selected?.variation_id === v.variation_id;
                      return (
                        <button
                          key={v.variation_id}
                          onClick={() => handleSelect(v)}
                          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full border-2 transition-all text-sm font-medium"
                          style={{
                            borderColor:     isActive ? colors.primary : "#E5E7EB",
                            backgroundColor: isActive ? `${colors.primary}10` : "#fff",
                            fontFamily:      fonts.body,
                            color:           isActive ? colors.primary : "#374151",
                          }}
                        >
                          <span
                            className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-200 shadow-sm"
                            style={{ backgroundColor: hex }}
                          />
                          {colorName}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <div className="h-px bg-gray-100" />

              {/* Action buttons */}
              <motion.div {...fadeUp(0.32)} className="flex flex-col sm:flex-row gap-3">
                {cartStatus === "added" ? (
                  <div
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: "#22c55e15", color: "#16a34a", fontFamily: fonts.body }}
                  >
                    <CheckCircle size={18} />
                    Added to Cart!
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={!selected}
                    className="flex-1 flex items-center justify-center gap-2 py-4 text-white text-sm font-semibold rounded-xl btn-red-inner-shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                    onMouseEnter={(e) => { if (selected) e.currentTarget.style.backgroundColor = colors.primaryDark; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primary; }}
                  >
                    <ShoppingCart size={16} />
                    {selected ? "Add to Cart" : "Select a Colour First"}
                  </button>
                )}
                <Link
                  href={product.acf?.book_your_test_ride_button_url || "/book-test-ride"}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-xl border-2 transition-all"
                  style={{ borderColor: colors.primary, color: colors.primary, fontFamily: fonts.body }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${colors.primary}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  Book Test Ride
                  <ArrowUpRight size={15} />
                </Link>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
