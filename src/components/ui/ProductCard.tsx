"use client";

import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-fleeto-red",
        className
      )}
    >
      <div className="relative h-56 md:h-64 bg-fleeto-gray overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl uppercase mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3">{product.tagline}</p>
        <div className="flex gap-4 text-sm">
          <span className="text-fleeto-red font-semibold">{product.speed}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">{product.range}</span>
        </div>
      </div>
    </div>
  );
}
