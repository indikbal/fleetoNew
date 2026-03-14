"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { colors, fonts, styles } from "@/config/theme";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  icon?: React.ReactNode;
}

export default function InnerPageBanner({ title, subtitle, breadcrumbs, icon }: Props) {
  return (
    <div className="w-full">

      {/* Spacer = navbar height, so banner starts right below it */}
      <div className="h-16 md:h-20" />

      {/* Red separator line — sits exactly at navbar bottom edge */}
      <div className="h-[1px] w-full" style={{ backgroundColor: colors.primary }} />

      {/* White banner content */}
      <section className="w-full bg-white border-b border-gray-100 px-4 py-8">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-3" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    style={{ fontFamily: fonts.body }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="text-xs font-medium"
                    style={{ fontFamily: fonts.body, color: colors.primary }}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Title row */}
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}12` }}
              >
                {icon}
              </div>
            )}
            <div>
              <h1
                className="text-3xl sm:text-4xl leading-none"
                style={{ ...styles.headingFont, color: "#010101" }}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-sm text-gray-400" style={{ fontFamily: fonts.body }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Red accent underline */}
          <div
            className="mt-5 h-[2px] w-12 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />

        </div>
      </section>

    </div>
  );
}
