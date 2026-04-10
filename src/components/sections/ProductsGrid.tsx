"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";
import { formatPrice, colorNameToHex } from "@/lib/api";
import type { ShopPageData, WCProduct } from "@/lib/api";
import SelectOptionModal from "@/components/ui/SelectOptionModal";

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index, onSelect }: { product: WCProduct; index: number; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  const imageUrl     = product.images[0]?.src ?? "/images/hero-scooty.png";
  // Use actual variation colors (accurate) — fall back to attribute options
  const colorOptions =
    product.variation_colors.length > 0
      ? product.variation_colors
      : product.attributes.find(
          (a) => a.name.toLowerCase() === "color" || a.name.toLowerCase() === "colour"
        )?.options ?? [];
  const hasSale      = !!product.sale_price && product.sale_price !== product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500"
      style={{
        background: hovered
          ? "linear-gradient(to top, #FFE0E0 0%, #ffffff 55%)"
          : "#ffffff",
        border: "1px solid #E6E6E6",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="relative px-4 pt-5 pb-0">

        {/* Sale badge */}
        {hasSale && (
          <span
            className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full z-10"
            style={{
              border: `1px solid ${colors.primary}`,
              color: colors.primary,
              backgroundColor: "#fff",
              fontFamily: fonts.body,
            }}
          >
            Sale
          </span>
        )}
 
        {/* Glow circle */}
        <div
          className="absolute top-1/2 right-10 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500"
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "rgba(171,35,35,0.18)",
            filter: hovered ? "blur(20px)" : "none",
          }}
        />

        {/* Scooter image — links to product detail page */}
        <Link href={`/products/${product.id}`} className="relative w-full h-56 block">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain object-center drop-shadow-md"
          />
        </Link>

        {/* Colour bar */}
        {colorOptions.length > 0 && (
          <div
            className="absolute bottom-3 left-4 right-4 flex items-center justify-between px-3 py-2.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(122,122,122,0.1)",
            }}
          >
            <span
              className="text-gray-900 whitespace-nowrap font-semibold"
              style={{ fontSize: "13px", fontFamily: fonts.body }}
            >
              Available Colour
            </span>
            <div className="flex gap-1.5">
              {colorOptions.map((c, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-full border border-white shadow-sm inline-block flex-shrink-0"
                  style={{ backgroundColor: colorNameToHex(c) }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="px-4 pt-3 pb-5 flex flex-col gap-3 flex-1">

        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`}>
            <h3
              className="leading-tight font-bold hover:underline"
              style={{ fontSize: "18px", color: colors.black, fontFamily: fonts.body }}
            >
              {product.name}
            </h3>
          </Link>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400 leading-none mb-0.5" style={{ fontFamily: fonts.body }}>From</p>
            <p className="font-bold leading-none" style={{ color: colors.primary, fontSize: "18px", fontFamily: fonts.body }}>
              {formatPrice(product.price)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* CTA */}
        <button
          onClick={onSelect}
          className="self-start inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg mt-auto btn-red-inner-shadow transition-colors"
          style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
        >
          Select Option
          <ArrowUpRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

interface Props {
  shopData: ShopPageData;
  products: WCProduct[];
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ProductsGrid({ shopData, products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<WCProduct | null>(null);

  return (
    <>
      <section
        className="relative overflow-hidden pt-20 md:pt-24 pb-16 md:pb-24"
        style={{ backgroundColor: "#FFF5F5" }}
      >
        {/* ── SVG sunrise title ── */}
        <motion.div
          className="absolute inset-x-0 pointer-events-none select-none"
          style={{ zIndex: 0, top: "5rem" }}
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
              <linearGradient id="productsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="100%" stopColor="#FFF5F5" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <text
              x="600" y="145"
              textAnchor="middle"
              fill="none"
              stroke="url(#productsGrad)"
              strokeWidth="1"
              fontSize="120"
              style={{ fontFamily: fonts.display }}
            >
              {shopData.banner_section_title}
            </text>
          </svg>
        </motion.div>

        {/* ── Content ── */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: "12%" }}
        >
          {/* Heading */}
          <div className="mb-10">
            <motion.p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: colors.primary, fontFamily: fonts.body }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {shopData.our_collection_section_title}
            </motion.p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <motion.h1
                className="text-4xl md:text-5xl"
                style={{ ...styles.headingFont, color: colors.black }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
              >
                <span style={{ color: colors.primary }}>{shopData.our_collection_section_sub_title_1}</span>{" "}
                {shopData.our_collection_section_sub_title_2}
              </motion.h1>
              <motion.p
                className="text-gray-400 text-sm"
                style={{ fontFamily: fonts.body }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {products.length} models available
              </motion.p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onSelect={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p
              className="text-gray-500 text-sm mb-4"
              style={{ fontFamily: fonts.body }}
            >
              {shopData.cant_decide_section_title}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white text-sm font-semibold rounded-full btn-red-inner-shadow transition-colors"
              style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              Talk to an Expert
              <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Select Option Modal ── */}
      {selectedProduct && (
        <SelectOptionModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
