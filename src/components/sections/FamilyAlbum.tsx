"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { colors, fonts } from "@/config/theme";
import type { ExploreAlbumItem } from "@/lib/api";

interface Props {
  title: string;
  items: ExploreAlbumItem[];
}

const GAP = 14;

export default function FamilyAlbum({ title, items }: Props) {
  const [imgW, setImgW] = useState(420);

  useEffect(() => {
    const update = () => setImgW(window.innerWidth < 640 ? 260 : 420);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Duplicate for seamless loop
  const images = [...items, ...items];
  const trackWidth = images.length * (imgW + GAP);
  const half       = trackWidth / 2;

  return (
    <section className="bg-white pt-8 pb-16 overflow-hidden">
      <div className="relative">

        {/* ── Sunrise watermark ── */}
        <motion.div
          className="absolute top-0 inset-x-0 pointer-events-none select-none"
          style={{ zIndex: 0 }}
          initial={{ y: "8vw", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <svg
            viewBox="0 0 1200 160"
            width="100%"
            aria-hidden="true"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="albumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <text
              x="600"
              y="145"
              textAnchor="middle"
              fill="none"
              stroke="url(#albumGrad)"
              strokeWidth="1"
              fontSize="120"
              style={{ fontFamily: fonts.display }}
            >
              {title}
            </text>
          </svg>
        </motion.div>

        {/* ── Marquee strip ── */}
        <div className="relative z-10" style={{ paddingTop: "11%" }}>
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              style={{ width: `${trackWidth}px` }}
              animate={{ x: [0, -half] }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                },
              }}
            >
              {images.map((item, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 rounded-2xl overflow-hidden h-[180px] sm:h-[300px]"
                  style={{
                    width: `${imgW}px`,
                    marginRight: `${GAP}px`,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={`Family album photo ${(i % items.length) + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
