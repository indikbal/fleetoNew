"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

export default function Accessories() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "580px" }}>

      {/* Background image */}
      <Image
        src="/images/scooty-with-accessories.jpg"
        alt="Fleeto with accessories"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay: right red → left transparent */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to left, rgba(120,10,10,0.97) 0%, rgba(80,5,5,0.75) 40%, rgba(20,0,0,0.25) 65%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex justify-end items-center min-h-[480px]">

        {/* Glass card — right side */}
        <div
          className="w-full max-w-sm rounded-2xl p-8 md:p-10 flex flex-col gap-6"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(4px) saturate(1.5)",
            WebkitBackdropFilter: "blur(4px) saturate(1.6)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderLeft: "1px solid rgba(255,255,255,0.10)",
            borderRight: "1px solid rgba(255,255,255,0.10)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 40px rgba(0,0,0,0.3)",
          }}
        >
          {/* Heading */}
          <h2
            className="text-white text-3xl md:text-4xl leading-tight text-center"
            style={styles.headingFont}
          >
            Accessories your Fleeto
          </h2>

          {/* Description */}
          <p
            className="text-white/70 text-sm leading-relaxed text-center"
            style={{ fontFamily: fonts.body }}
          >
            Get the accessories you and your family want for your newest family
            member. More storage, a touch of style, a better ride experience.
            We&apos;ve got it all.
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <a
              href="#contact"
              className="glass-btn inline-flex items-center gap-3 px-6 py-3 text-white text-sm font-semibold"
            >
              Shop Now
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
