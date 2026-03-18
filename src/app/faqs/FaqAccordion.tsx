"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { colors, fonts } from "@/config/theme";
import { stripHtml } from "@/lib/api";
import type { FaqItem } from "@/lib/api";

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900" style={{ fontFamily: fonts.body }}>
                {faq.title}
              </span>
              {isOpen
                ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              }
            </button>
            {isOpen && (
              <div className="px-6 pb-5 border-t border-gray-100">
                <p className="text-sm text-gray-500 leading-relaxed pt-4" style={{ fontFamily: fonts.body }}>
                  {stripHtml(faq.details)}
                </p>
              </div>
            )}
          </div>
        );
      })}

      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: `${colors.primary}08`, border: `1px solid ${colors.primary}20` }}
      >
        <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: fonts.body }}>
          Still have questions?
        </p>
        <a href="/contact" className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: fonts.body }}>
          Contact our support team →
        </a>
      </div>
    </div>
  );
}
