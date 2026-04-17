"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // used for Book Test Ride
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ShoppingCart, CheckCircle, ShieldCheck, X } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";
import { colorNameToHex, formatPrice } from "@/lib/api";
import type { WCProductDetail, ProductVariation, ProductDetailAttribute } from "@/lib/api";
import { useCart } from "@/context/CartContext";

interface Props {
  product: WCProductDetail;
  batteryAttributes?: ProductDetailAttribute[];
  warrantyText?: string;
}

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.55, ease: "easeOut" as const, delay },
});

export default function ProductDetailView({ product, batteryAttributes, warrantyText }: Props) {
  const [selected, setSelected]       = useState<ProductVariation | null>(null);
  const [cartStatus, setCartStatus]   = useState<"idle" | "added">("idle");
  const [activeImage, setActiveImage] = useState(product.image || "/images/hero-scooty.png");
  const [selectedBattery, setSelectedBattery] = useState<string | null>(null);
  const [warrantyPopup, setWarrantyPopup] = useState(false);
  const { addItem } = useCart();

  const warrantyMessage = warrantyText?.trim() || "4 Years Warranty";

  // Extract battery selection attributes
  const batteryStandard = batteryAttributes?.find((a) => a.name === "Battery Selection");
  const batterySmart = batteryAttributes?.find((a) => a.name === "Battery Selection (Smart)");
  const batteryOptions = batteryStandard?.value.split(", ").filter(Boolean) ?? [];
  const batterySmartOptions = batterySmart?.value.split(", ").filter(Boolean) ?? [];

  const hasStandard = batteryOptions.length > 0;
  const hasSmart    = batterySmartOptions.length > 0;
  const [batteryTab, setBatteryTab] = useState<"standard" | "smart">(
    hasStandard ? "standard" : "smart"
  );

  const handleSelectSmartBattery = (opt: string) => {
    setSelectedBattery(opt);
    setWarrantyPopup(true);
  };

  useEffect(() => {
    if (!warrantyPopup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWarrantyPopup(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [warrantyPopup]);

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
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10 items-start">

            {/* ── Left: product image ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:sticky lg:top-24"
            >
              <div
                className="relative w-full rounded-2xl overflow-hidden"
                style={{ height: "360px", backgroundColor: "#FFF5F5", border: "1px solid #F0E0E0" }}
              >
                <Image
                  src={activeImage}
                  alt={product.title || "Product image"}
                  fill
                  className="object-contain object-center p-6 drop-shadow-md"
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
                      className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all"
                      style={{
                        borderColor:     selected?.variation_id === v.variation_id ? colors.primary : "#E6E6E6",
                        backgroundColor: "#FFF5F5",
                      }}
                    >
                      <Image
                        src={v.image || product.image}
                        alt={Object.values(v.attributes)[0] || "variant"}
                        width={48}
                        height={48}
                        className="object-contain w-full h-full p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Right: product info ── */}
            <div className="flex flex-col gap-4">

              {/* Title + Price in one header row */}
              <motion.div
                {...fadeUp(0.15)}
                className="flex items-start justify-between gap-4"
              >
                <h2
                  className="text-2xl md:text-3xl leading-tight"
                  style={{ ...styles.headingFont, color: colors.black }}
                >
                  {product.title}
                </h2>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-xl md:text-2xl font-bold leading-none"
                    style={{ color: colors.primary, fontFamily: fonts.body }}
                  >
                    {formatPrice(selected?.price ?? product.price)}
                  </div>
                  <div
                    className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider"
                    style={{ fontFamily: fonts.body }}
                  >
                    onwards
                  </div>
                </div>
              </motion.div>

              {/* Specs (desc is an HTML <ul> list) */}
              {product.desc && (
                <motion.div
                  {...fadeUp(0.2)}
                  className="
                    text-xs text-gray-500
                    [&_ul]:flex [&_ul]:flex-wrap [&_ul]:gap-1.5 [&_ul]:p-0 [&_ul]:m-0
                    [&_li]:list-none [&_li]:rounded-full [&_li]:px-2.5 [&_li]:py-1
                    [&_li]:text-xs [&_li]:font-medium
                  "
                  style={{ fontFamily: fonts.body }}
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

              {/* Colour picker — compact swatches with shared label */}
              {product.variations?.length > 0 && (
                <motion.div {...fadeUp(0.24)}>
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
                      style={{ fontFamily: fonts.body }}
                    >
                      Choose Colour
                    </p>
                    {selected && (
                      <p
                        className="text-[11px] text-gray-500 font-medium capitalize"
                        style={{ fontFamily: fonts.body }}
                      >
                        {Object.values(selected.attributes)[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variations.map((v) => {
                      const colorName = Object.values(v.attributes)[0] ?? "";
                      const hex       = colorNameToHex(colorName);
                      const isActive  = selected?.variation_id === v.variation_id;
                      return (
                        <button
                          key={v.variation_id}
                          onClick={() => handleSelect(v)}
                          title={colorName}
                          aria-label={colorName}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                          style={{
                            boxShadow: isActive
                              ? `0 0 0 2px #fff inset, 0 0 0 2px ${colors.primary}`
                              : `0 0 0 1px #E5E7EB`,
                          }}
                        >
                          <span
                            className="w-full h-full rounded-full border border-gray-100"
                            style={{ backgroundColor: hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Battery Selection — tabbed Standard/Smart */}
              {(hasStandard || hasSmart) && (
                <>
                  <div className="h-px bg-gray-100" />
                  <motion.div {...fadeUp(0.27)}>
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
                        style={{ fontFamily: fonts.body }}
                      >
                        Battery
                      </p>
                      {selectedBattery && (
                        <p
                          className="text-[11px] text-gray-500 font-medium truncate max-w-[60%]"
                          style={{ fontFamily: fonts.body }}
                          title={selectedBattery}
                        >
                          {selectedBattery}
                        </p>
                      )}
                    </div>

                    {/* Segmented tabs */}
                    {hasStandard && hasSmart && (
                      <div className="relative inline-flex p-0.5 rounded-full bg-gray-100 mb-2.5">
                        {(["standard", "smart"] as const).map((tab) => {
                          const active = batteryTab === tab;
                          return (
                            <button
                              key={tab}
                              onClick={() => setBatteryTab(tab)}
                              className="relative px-4 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors"
                              style={{
                                color: active ? "#fff" : "#6B7280",
                                fontFamily: fonts.body,
                              }}
                            >
                              {active && (
                                <motion.span
                                  layoutId="battery-tab-pill"
                                  className="absolute inset-0 rounded-full"
                                  style={{ backgroundColor: colors.primary }}
                                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                />
                              )}
                              <span className="relative">{tab}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Chip grid for active tab */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {(batteryTab === "standard" ? batteryOptions : batterySmartOptions).map((opt) => {
                        const isActive = selectedBattery === opt;
                        const onClick  =
                          batteryTab === "smart"
                            ? () => handleSelectSmartBattery(opt)
                            : () => setSelectedBattery(opt);
                        return (
                          <button
                            key={opt}
                            onClick={onClick}
                            className="px-2.5 py-1.5 rounded-lg border transition-all text-[11px] font-medium text-left truncate"
                            style={{
                              borderColor: isActive ? colors.primary : "#E5E7EB",
                              backgroundColor: isActive ? `${colors.primary}10` : "#fff",
                              fontFamily: fonts.body,
                              color: isActive ? colors.primary : "#374151",
                            }}
                            title={opt}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}

              <div className="h-px bg-gray-100" />

              {/* Action buttons */}
              <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-2.5">
                {cartStatus === "added" ? (
                  <div
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: "#22c55e15", color: "#16a34a", fontFamily: fonts.body }}
                  >
                    <CheckCircle size={16} />
                    Added to Cart!
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={!selected}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-white text-sm font-semibold rounded-xl btn-red-inner-shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                    onMouseEnter={(e) => { if (selected) e.currentTarget.style.backgroundColor = colors.primaryDark; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primary; }}
                  >
                    <ShoppingCart size={15} />
                    {selected ? "Add to Cart" : "Select a Colour"}
                  </button>
                )}
                <Link
                  href="/book-test-ride"
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl border-2 transition-all"
                  style={{ borderColor: colors.primary, color: colors.primary, fontFamily: fonts.body }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${colors.primary}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  Book Test Ride
                  <ArrowUpRight size={14} />
                </Link>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Smart Battery Warranty Popup ── */}
      <AnimatePresence>
        {warrantyPopup && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setWarrantyPopup(false)}
            />

            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="warranty-title"
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Accent bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryDark})`,
                }}
              />

              <button
                aria-label="Close warranty dialog"
                onClick={() => setWarrantyPopup(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="px-8 pt-10 pb-8 text-center">
                {/* Icon */}
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: `${colors.primary}12` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.1 }}
                >
                  <ShieldCheck size={38} style={{ color: colors.primary }} />
                </motion.div>

                <h3
                  id="warranty-title"
                  className="text-2xl md:text-3xl mb-2"
                  style={{ ...styles.headingFont, color: colors.black }}
                >
                  {warrantyMessage}
                </h3>

                {selectedBattery && (
                  <p
                    className="text-sm text-gray-500 mb-5"
                    style={{ fontFamily: fonts.body }}
                  >
                    on Smart Lithium battery
                    <span className="block text-gray-700 font-medium mt-1">
                      {selectedBattery}
                    </span>
                  </p>
                )}

                <p
                  className="text-sm text-gray-500 leading-relaxed mb-7"
                  style={{ fontFamily: fonts.body }}
                >
                  You&apos;ve chosen our Smart Lithium battery — it comes backed by a{" "}
                  <span className="font-semibold" style={{ color: colors.primary }}>
                    {warrantyMessage.toLowerCase()}
                  </span>{" "}
                  for complete peace of mind.
                </p>

                <button
                  onClick={() => setWarrantyPopup(false)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 text-white text-sm font-semibold rounded-full btn-red-inner-shadow transition-colors"
                  style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
