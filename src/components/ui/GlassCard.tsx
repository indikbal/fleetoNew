"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  variant?: "default" | "light" | "dark";
  className?: string;
  children: React.ReactNode;
}

export default function GlassCard({
  variant = "default",
  className,
  children,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        {
          glass: variant === "default",
          "glass-light": variant === "light",
          "glass-dark": variant === "dark",
        },
        className
      )}
    >
      {children}
    </div>
  );
}
