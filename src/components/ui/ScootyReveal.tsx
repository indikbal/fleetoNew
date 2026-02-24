"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

export default function ScootyReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    /* Outer div: pure CSS positioning — no transforms, so useInView detects it correctly */
    <div
      ref={ref}
      className="absolute left-0 pointer-events-none select-none hidden sm:block"
      style={{
        zIndex: 30,
        top: "500px",
        width: "clamp(120px, 11vw, 180px)",
      }}
    >
      {/* Inner motion.div: only handles the slide-in x animation */}
      <motion.div
        initial={{ x: -220 }}
        animate={{ x: isInView ? 0 : -220 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/images/calculator-scooty.png"
          alt="Fleeto scooter"
          width={200}
          height={200}
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </div>
  );
}
