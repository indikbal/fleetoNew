"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { colors, fonts } from "@/config/theme";

const features = [
  {
    image: "/images/ride2.jpg",
    title: "Frunk",
    desc: "Eco mode for days you want longer range. Zip mode for days you want peppy rides.",
  },
  {
    image: "/images/ride3.jpg",
    title: "Rear Monoshock Suspension",
    desc: "Eco mode for days you want longer range. Zip mode for days you want peppy rides.",
  },
  {
    image: "/images/ride4.jpg",
    title: "Brakes",
    desc: "Eco mode for days you want longer range. Zip mode for days you want peppy rides.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

export default function RideEasy() {
  return (
    <section className="bg-white pt-8 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Title + main image overlap ── */}
        <div className="relative">

          {/* "Ride Easy" — sunrise: starts hidden behind card, rises up slowly */}
          <motion.div
            className="absolute top-0 inset-x-0 pointer-events-none select-none flex justify-center"
            style={{ zIndex: 0 }}
            initial={{ y: "8vw", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <svg
              viewBox="0 0 1000 160"
              width="100%"
              aria-hidden="true"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="rideEasyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <text
                x="500"
                y="148"
                textAnchor="middle"
                fill="none"
                stroke="url(#rideEasyGrad)"
                strokeWidth="1"
                fontSize="120"
                style={{ fontFamily: fonts.display }}
              >
                Ride Easy
              </text>
            </svg>
          </motion.div>

          {/* Main banner image — sits on top, allowing title to peek above */}
          <motion.div
            {...fadeUp(0.1)}
            className="relative z-10"
            style={{ paddingTop: "14%" }}
          >
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/7" }}>
              <Image
                src="/images/ride1.jpg"
                alt="Ride Easy — Fleeto Electric Scooter"
                fill
                className="object-cover object-center"
              />
            </div>
          </motion.div>

        </div>

        {/* ── 3 feature cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp(0.1 + i * 0.08)}>
              {/* Image */}
              <div className="relative w-full overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={f.image}
                  alt={f.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
              {/* Label */}
              <h3
                className="font-bold mb-1.5"
                style={{ fontFamily: fonts.body, fontSize: "16px", color: colors.black }}
              >
                {f.title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: fonts.body }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
