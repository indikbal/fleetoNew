"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 cursor-pointer",
        {
          "bg-fleeto-red text-white hover:bg-fleeto-red-dark shadow-lg hover:shadow-xl":
            variant === "primary",
          "border-2 border-fleeto-red text-fleeto-red hover:bg-fleeto-red hover:text-white":
            variant === "outline",
          "bg-white text-fleeto-black hover:bg-gray-100":
            variant === "white",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-2.5 text-base": size === "md",
          "px-8 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
