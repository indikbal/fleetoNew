"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  text: string;
  highlightWord?: string;
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  text,
  highlightWord,
  className,
  light = false,
}: SectionHeadingProps) {
  if (!highlightWord) {
    return (
      <h2
        className={cn(
          "font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight",
          light ? "text-white" : "text-fleeto-black",
          className
        )}
      >
        {text}
      </h2>
    );
  }

  const parts = text.split(new RegExp(`(${highlightWord})`, "i"));

  return (
    <h2
      className={cn(
        "font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight",
        light ? "text-white" : "text-fleeto-black",
        className
      )}
    >
      {parts.map((part, i) =>
        part.toLowerCase() === highlightWord.toLowerCase() ? (
          <span key={i} className="text-fleeto-red">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </h2>
  );
}
