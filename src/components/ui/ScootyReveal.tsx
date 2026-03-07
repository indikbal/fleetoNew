"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface Props {
  image: string;
}

export default function ScootyReveal({ image }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="absolute left-0 pointer-events-none select-none hidden sm:block"
      style={{
        zIndex: 30,
        top: "500px",
        width: "clamp(120px, 11vw, 180px)",
      }}
    >
      <motion.div
        initial={{ x: -220 }}
        animate={{ x: isInView ? 0 : -220 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src={image}
          alt="Fleeto scooter"
          width={200}
          height={200}
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </div>
  );
}
