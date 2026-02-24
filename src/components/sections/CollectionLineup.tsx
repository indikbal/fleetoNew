"use client";

import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { ArrowUpRight, Battery, Zap, Gauge } from "lucide-react";
import { colors, styles } from "@/config/theme";

// @ts-ignore — Swiper CSS
import "swiper/css";

// ─── Product data ─────────────────────────────────────────────────────────────
const products = [
  {
    id: "aayan-smart",
    name: "Aayan-SMART",
    price: "₹57,106",
    sale: "15%",
    image: "/images/hero-scooty.png",
    colors: ["#4A7FEB", "#E05555", "#010101"],
    range: "150 Kms",
    voltage: "60 - 72 Volts",
    speed: "65 kmph",
  },
  {
    id: "udaan",
    name: "Udaan",
    price: "₹57,106",
    sale: null,
    image: "/images/hero-scooty.png",
    colors: ["#4A7FEB", "#E05555", "#010101"],
    range: "150 Kms",
    voltage: "60 - 72 Volts",
    speed: "65 kmph",
  },
  {
    id: "wolf-lite",
    name: "Wolf Lite",
    price: "₹57,106",
    sale: null,
    image: "/images/hero-scooty.png",
    colors: ["#F4A0A0", "#010101", "#333333"],
    range: "150 Kms",
    voltage: "60 - 72 Volts",
    speed: "65 kmph",
  },
  {
    id: "fleeto-x1",
    name: "Fleeto X1",
    price: "₹62,000",
    sale: "10%",
    image: "/images/hero-scooty.png",
    colors: ["#4A7FEB", "#4AAB5E", "#010101"],
    range: "120 Kms",
    voltage: "48 - 72 Volts",
    speed: "70 kmph",
  },
  {
    id: "fleeto-pro",
    name: "Fleeto Pro",
    price: "₹72,500",
    sale: null,
    image: "/images/hero-scooty.png",
    colors: ["#010101", "#AB2323", "#4A7FEB"],
    range: "180 Kms",
    voltage: "72 Volts",
    speed: "80 kmph",
  },
];

// ─── Card component ───────────────────────────────────────────────────────────
function ProductCard({ product, isActive }: { product: typeof products[0]; isActive: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 group"
      style={{ background: "#ffffff", border: "1px solid #E6E6E6" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "linear-gradient(to top, #FFE0E0 0%, #ffffff 55%)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "#ffffff";
      }}
    >
      {/* Image area — bigger, relative so colour bar can overlay */}
      <div className="relative px-4 pt-5 pb-0">

        {/* Sale badge */}
        {product.sale && (
          <span
            className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full z-10"
            style={{
              border: `1px solid ${colors.primary}`,
              color: colors.primary,
              backgroundColor: "#fff",
            }}
          >
            Sale : {product.sale}
          </span>
        )}

        {/* Circle glow — solid 80×80 by default, blurs on card hover */}
        <div
          className="absolute top-1/2 right-10 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500 group-hover:blur-2xl"
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "rgba(171,35,35,0.22)",
          }}
        />

        {/* Scooter image */}
        <div className="relative w-full h-64">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain object-center drop-shadow-md"
          />
        </div>

        {/* Available colour — absolute, overlaid at bottom of image, glass effect */}
        <div
          className="absolute bottom-3 left-4 right-4 flex items-center justify-between px-3 py-2.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(122, 122, 122, 0.1)",
          }}
        >
          <span className="text-gray-900 whitespace-nowrap font-semibold" style={{ fontSize: "14px" }}>Available Colour</span>
          <div className="flex gap-1.5">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full border border-white shadow-sm inline-block flex-shrink-0"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="px-4 pt-3 pb-5 flex flex-col gap-3 flex-1">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="leading-tight text-[#010101] font-bold"
            style={{ fontSize: "clamp(18px, 2vw, 20px)", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {product.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <p className="text-[14px] text-gray-400 leading-none mb-0.5">From</p>
            <p className="font-bold leading-none" style={{ color: colors.primary, fontSize: "clamp(18px, 2vw, 20px)" }}>
              {product.price}
            </p>
          </div>
        </div>

        {/* Divider between name/price and specs */}
        <div className="h-px bg-gray-100" />

        {/* Specs */}
        <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
          <span className="flex items-center gap-1">
            <Battery size={13} className="text-green-500 flex-shrink-0" />
            Upto {product.range}
          </span>
          <span className="flex items-center gap-1">
            <Zap size={13} className="text-green-500 flex-shrink-0" />
            {product.voltage}
          </span>
          <span className="flex items-center gap-1">
            <Gauge size={13} className="text-green-500 flex-shrink-0" />
            {product.speed}
          </span>
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="self-start inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg mt-auto btn-red-inner-shadow transition-colors"
          style={{ backgroundColor: colors.primary }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
        >
          Select Option
          <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function CollectionLineup() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section id="products" className="py-20 md:py-28" style={{ backgroundColor: "#F0F0F0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <h2
          className="text-center text-4xl md:text-5xl mb-14 text-[#010101]"
          style={styles.headingFont}
        >
          <span style={{ color: colors.primary }}>Fleeto</span> Collection Lineup
        </h2>

        {/* Slider + custom arrows */}
        <div className="flex items-center gap-4">

          {/* Prev arrow */}
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className="flex-shrink-0 transition-opacity hover:opacity-70 active:scale-95"
            aria-label="Previous"
          >
            <Image src="/images/left-arrow.svg" alt="Previous" width={57} height={57} className="w-8 h-8 sm:w-10 sm:h-10 md:w-[57px] md:h-[57px]" />
          </button>

          {/* Swiper */}
          <div className="flex-1 min-w-0">
            <Swiper
              onSwiper={setSwiperInstance}
              slidesPerView={3}
              spaceBetween={20}
              centeredSlides
              loop
              breakpoints={{
                0:   { slidesPerView: 1, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 16 },
                1024:{ slidesPerView: 3, spaceBetween: 20 },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="!h-auto">
                  {({ isActive }) => (
                    <ProductCard product={product} isActive={isActive} />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Next arrow */}
          <button
            onClick={() => swiperInstance?.slideNext()}
            className="flex-shrink-0 transition-opacity hover:opacity-70 active:scale-95"
            aria-label="Next"
          >
            <Image src="/images/right-arrow.svg" alt="Next" width={57} height={57} className="w-8 h-8 sm:w-10 sm:h-10 md:w-[57px] md:h-[57px]" />
          </button>

        </div>
      </div>
    </section>
  );
}
