"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link"; // used for Book Test Ride
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ShoppingCart, CheckCircle, ShieldCheck, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { colors, fonts, styles } from "@/config/theme";
import { colorNameToHex, formatPrice, getVariationColor, prettifyColorName } from "@/lib/api";
import type {
  WCProductDetail,
  ProductVariation,
  ProductDetailAttribute,
  ProductDetailAttributeValue,
  ProductDetailVariation,
} from "@/lib/api";
import { useCart } from "@/context/CartContext";

interface Props {
  product: WCProductDetail;
  batteryAttributes?: ProductDetailAttribute[];
  warrantyText?: string;
  detailVariations?: ProductDetailVariation[];
}

// WordPress slugifies "Lithium: 60V 34Ah SMART" → "lithium-60v-34ah-smart"
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.55, ease: "easeOut" as const, delay },
});

export default function ProductDetailView({
  product,
  batteryAttributes,
  warrantyText,
  detailVariations = [],
}: Props) {
  const [selected, setSelected]       = useState<ProductVariation | null>(null);
  const [cartStatus, setCartStatus]   = useState<"idle" | "added">("idle");
  const [activeImage, setActiveImage] = useState(product.image || "/images/hero-scooty.png");
  const [selectedBattery, setSelectedBattery] = useState<ProductDetailAttributeValue | null>(null);
  const [warrantyPopup, setWarrantyPopup] = useState(false);
  const [popupTab, setPopupTab] = useState<"standard" | "smart">("standard");
  const { addItem } = useCart();

  const fallbackWarranty = warrantyText?.trim() || "4 Years Warranty";

  // Extract battery selection attributes
  const batteryStandard = batteryAttributes?.find((a) => a.attribute_name === "Battery Selection");
  const batterySmart    = batteryAttributes?.find((a) => a.attribute_name === "Battery Selection (Smart)");
  const batteryOptions      = batteryStandard?.values ?? [];
  const batterySmartOptions = batterySmart?.values ?? [];

  const hasStandard = batteryOptions.length > 0;
  const hasSmart    = batterySmartOptions.length > 0;
  const [batteryTab, setBatteryTab] = useState<"standard" | "smart">(
    hasStandard ? "standard" : "smart"
  );

  const isLithium = (opt: ProductDetailAttributeValue) =>
    /lithium/i.test(opt.name);

  // Parse product.desc (<ul><li>…</li></ul>) into plain-text pills
  const basePills = useMemo<string[]>(() => {
    if (!product.desc) return [];
    return (product.desc.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) ?? []).map((li) =>
      li.replace(/<\/?[^>]+>/g, "").replace(/&nbsp;/g, " ").trim()
    );
  }, [product.desc]);

  // For the currently picked battery, find any variation that uses it. The new
  // product-details endpoint puts the per-battery range (e.g. "85-90 Kms") on
  // variations[].description, not on the attribute value. Match by slug.
  const variationForBattery = useMemo<ProductDetailVariation | null>(() => {
    if (!selectedBattery || detailVariations.length === 0) return null;
    const targetSlug = slugify(selectedBattery.name);
    // Prefer one matching the currently selected color, else the first match.
    const selectedColor = selected ? getVariationColor(selected.attributes) : "";
    const colorSlug = selectedColor ? slugify(selectedColor) : null;
    const matches = detailVariations.filter((v) =>
      Object.entries(v.attributes).some(
        ([k, val]) => k.includes("battery-selection") && val === targetSlug
      )
    );
    if (matches.length === 0) return null;
    if (colorSlug) {
      const colored = matches.find((v) =>
        Object.entries(v.attributes).some(
          ([k, val]) => k.includes("color") && val === colorSlug
        )
      );
      if (colored) return colored;
    }
    return matches[0];
  }, [selectedBattery, detailVariations, selected]);

  // Pills shown under the title — swap Kms / Volts / Kmph based on selected battery
  const displayPills = useMemo<string[]>(() => {
    if (!selectedBattery) return basePills;
    const voltsMatch = selectedBattery.name.match(/(\d+)\s*V\b/i);
    const voltsPill = voltsMatch ? `${voltsMatch[1]} Volts` : null;
    const kmsPill =
      variationForBattery?.description?.trim() ||
      selectedBattery.description?.trim() ||
      null;
    // Backend returns per-battery top speed on `weight` (legacy field name).
    const rawWeight = variationForBattery?.weight?.trim();
    const kmphPill = rawWeight
      ? /kmph/i.test(rawWeight)
        ? rawWeight
        : `${rawWeight} kmph`
      : null;
    return basePills.map((pill) => {
      if (/kmph/i.test(pill) && kmphPill) return kmphPill;
      if (/\bkms?\b/i.test(pill) && kmsPill) return kmsPill;
      if (/volts?\b/i.test(pill) && voltsPill) return voltsPill;
      return pill;
    });
  }, [basePills, selectedBattery, variationForBattery]);

  // Per-battery price (falls back to colour-variation or product price)
  const displayPrice = useMemo(() => {
    if (variationForBattery?.price) return String(variationForBattery.price);
    return selected?.price ?? product.price;
  }, [variationForBattery, selected, product.price]);

  const handleSelectBattery = (opt: ProductDetailAttributeValue, tab: "standard" | "smart") => {
    setSelectedBattery(opt);
    if (isLithium(opt)) {
      setPopupTab(tab);
      setWarrantyPopup(true);
    }
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
    const colorName = prettifyColorName(getVariationColor(selected.attributes));
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
              className="lg:sticky lg:top-24 min-w-0"
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
                <ThumbnailSlider
                  variations={product.variations}
                  fallbackImage={product.image}
                  selectedId={selected?.variation_id ?? null}
                  onSelect={handleSelect}
                />
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
                    {formatPrice(displayPrice)}
                  </div>
                  <div
                    className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider"
                    style={{ fontFamily: fonts.body }}
                  >
                    onwards
                  </div>
                </div>
              </motion.div>

              {/* Specs — reactive pills that swap with selected battery */}
              {displayPills.length > 0 && (
                <motion.div
                  {...fadeUp(0.2)}
                  className="text-xs text-gray-500"
                  style={{ fontFamily: fonts.body }}
                >
                  <ul className="flex flex-wrap gap-1.5 p-0 m-0">
                    {displayPills.map((pill, i) => (
                      <motion.li
                        key={`${i}-${pill}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="list-none rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          background: "#FFF5F5",
                          border: "1px solid #F0E0E0",
                          color: "#374151",
                        }}
                      >
                        {pill}
                      </motion.li>
                    ))}
                  </ul>
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
                        {prettifyColorName(getVariationColor(selected.attributes))}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variations.map((v) => {
                      const colorName = getVariationColor(v.attributes);
                      const label     = prettifyColorName(colorName);
                      const hex       = colorNameToHex(colorName);
                      const isActive  = selected?.variation_id === v.variation_id;
                      return (
                        <button
                          key={v.variation_id}
                          onClick={() => handleSelect(v)}
                          title={label}
                          aria-label={label}
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
                          title={selectedBattery.name}
                        >
                          {selectedBattery.name}
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
                        const isActive = selectedBattery?.name === opt.name;
                        return (
                          <button
                            key={opt.name}
                            onClick={() => handleSelectBattery(opt, batteryTab)}
                            className="px-2.5 py-1.5 rounded-lg border transition-all text-[11px] font-medium text-left truncate"
                            style={{
                              borderColor: isActive ? colors.primary : "#E5E7EB",
                              backgroundColor: isActive ? `${colors.primary}10` : "#fff",
                              fontFamily: fonts.body,
                              color: isActive ? colors.primary : "#374151",
                            }}
                            title={opt.name}
                          >
                            {opt.name}
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

                {(() => {
                  const warrantyMessage =
                    selectedBattery?.warranty?.trim() || fallbackWarranty;
                  const batteryKind =
                    popupTab === "smart" ? "Smart Lithium" : "Lithium";
                  return (
                    <>
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
                          on {batteryKind} battery
                          <span className="block text-gray-700 font-medium mt-1">
                            {selectedBattery.name}
                          </span>
                          {selectedBattery.description && (
                            <span className="block text-gray-500 text-xs mt-0.5">
                              {selectedBattery.description}
                            </span>
                          )}
                        </p>
                      )}

                      <p
                        className="text-sm text-gray-500 leading-relaxed mb-7"
                        style={{ fontFamily: fonts.body }}
                      >
                        You&apos;ve chosen our {batteryKind} battery — it comes backed by a{" "}
                        <span className="font-semibold" style={{ color: colors.primary }}>
                          {warrantyMessage.toLowerCase()}
                        </span>{" "}
                        for complete peace of mind.
                      </p>
                    </>
                  );
                })()}

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

/* ─── Thumbnail slider (Swiper) ────────────────────────────────────────── */
function ThumbnailSlider({
  variations,
  fallbackImage,
  selectedId,
  onSelect,
}: {
  variations: ProductVariation[];
  fallbackImage: string;
  selectedId: number | null;
  onSelect: (v: ProductVariation) => void;
}) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [needsNav, setNeedsNav] = useState(false);

  // Keep active thumbnail in view when colour is changed from the swatches
  useEffect(() => {
    if (selectedId == null || !swiperRef.current) return;
    const idx = variations.findIndex((v) => v.variation_id === selectedId);
    if (idx >= 0) {
      swiperRef.current.slideTo(idx, 400);
    }
  }, [selectedId, variations]);

  const refreshState = useCallback((sw: SwiperClass) => {
    setIsBeginning(sw.isBeginning);
    setIsEnd(sw.isEnd);
    // needsNav is true when slides don't all fit the visible area.
    const container = sw.el;
    const wrapper = sw.wrapperEl;
    if (container && wrapper) {
      setNeedsNav(wrapper.scrollWidth > container.clientWidth + 2);
    }
  }, []);

  return (
    <div className="relative mt-3 w-full min-w-0 overflow-hidden">
      <Swiper
        modules={[Navigation, FreeMode]}
        slidesPerView="auto"
        spaceBetween={8}
        freeMode={{ enabled: true, momentum: true }}
        onSwiper={(sw) => {
          swiperRef.current = sw;
          refreshState(sw);
          // Re-measure after images load so needsNav reflects final layout.
          requestAnimationFrame(() => refreshState(sw));
          setTimeout(() => refreshState(sw), 300);
        }}
        onSlideChange={refreshState}
        onReachBeginning={refreshState}
        onReachEnd={refreshState}
        onFromEdge={refreshState}
        onResize={refreshState}
        className="thumbnail-swiper"
      >
        {variations.map((v) => (
          <SwiperSlide key={v.variation_id} style={{ width: 48 }}>
            <button
              onClick={() => onSelect(v)}
              className="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all block"
              style={{
                borderColor: selectedId === v.variation_id ? colors.primary : "#E6E6E6",
                backgroundColor: "#FFF5F5",
              }}
            >
              <Image
                src={v.image || fallbackImage}
                alt={prettifyColorName(getVariationColor(v.attributes)) || "variant"}
                width={48}
                height={48}
                className="object-contain w-full h-full p-1"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {needsNav && !isBeginning && (
        <button
          type="button"
          aria-label="Scroll thumbnails left"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:shadow-lg transition-all"
        >
          <ChevronLeft size={16} />
        </button>
      )}
      {needsNav && !isEnd && (
        <button
          type="button"
          aria-label="Scroll thumbnails right"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:shadow-lg transition-all"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Fade edges */}
      {needsNav && !isBeginning && (
        <div
          className="absolute left-0 top-0 bottom-0 w-10 pointer-events-none z-[1]"
          style={{ background: "linear-gradient(to right, #ffffff, rgba(255,255,255,0))" }}
        />
      )}
      {needsNav && !isEnd && (
        <div
          className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none z-[1]"
          style={{ background: "linear-gradient(to left, #ffffff, rgba(255,255,255,0))" }}
        />
      )}
    </div>
  );
}
