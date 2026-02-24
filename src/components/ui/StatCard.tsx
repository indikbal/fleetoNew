"use client";

import { cn } from "@/lib/utils";
import GlassCard from "./GlassCard";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  variant?: "default" | "light" | "dark";
  className?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  variant = "light",
  className,
}: StatCardProps) {
  return (
    <GlassCard variant={variant} className={cn("text-center", className)}>
      <div className="flex justify-center mb-3 text-fleeto-red">{icon}</div>
      <p className="font-display text-2xl md:text-3xl mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </GlassCard>
  );
}
