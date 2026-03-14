"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { colors, fonts } from "@/config/theme";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is the range of Fleeto electric scooters?",
        a: "Fleeto scooters offer a range of up to 120 km on a single charge depending on the model, riding conditions, and battery capacity. The Aayan-SMART offers ~80 km and the Aayan-PRO offers ~120 km.",
      },
      {
        q: "How long does it take to charge the battery?",
        a: "A full charge takes approximately 4–6 hours using the standard charger. Fast charging options can reduce this to 2–3 hours. We recommend charging overnight for daily use.",
      },
      {
        q: "Do I need a driving licence to ride a Fleeto scooter?",
        a: "Yes, a valid driving licence is required to operate any Fleeto electric scooter on public roads in India. Please ensure the vehicle is registered with your local RTO.",
      },
    ],
  },
  {
    category: "Purchase & Delivery",
    questions: [
      {
        q: "How can I buy a Fleeto scooter?",
        a: "You can purchase online through our website or visit one of our authorised dealerships. We offer home delivery in select cities. Book a test ride first to experience the scooter before buying.",
      },
      {
        q: "What is the delivery timeline?",
        a: "Delivery typically takes 7–14 business days after order confirmation depending on your location and variant availability. You will receive tracking updates via SMS and email.",
      },
      {
        q: "Are EMI options available?",
        a: "Yes, we offer flexible EMI options starting from low monthly installments through our partner financial institutions. Visit our Finance section or contact our sales team for more details.",
      },
    ],
  },
  {
    category: "Service & Warranty",
    questions: [
      {
        q: "What warranty does Fleeto provide?",
        a: "All Fleeto scooters come with a 2-year or 30,000 km manufacturer warranty (whichever comes first) on the vehicle frame and motor. The battery has a separate 3-year warranty.",
      },
      {
        q: "Where can I service my Fleeto scooter?",
        a: "We have authorised service centres across major cities. You can also schedule a doorstep service request through our website or customer care. Always use genuine Fleeto spare parts.",
      },
      {
        q: "What is covered under warranty?",
        a: "The warranty covers manufacturing defects in the motor, controller, and battery. It does not cover damage due to accidents, misuse, unauthorised modifications, or normal wear and tear.",
      },
    ],
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {faqs.map((section) => (
        <div key={section.category}>
          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-4 px-1"
            style={{ color: colors.primary, fontFamily: fonts.body }}
          >
            {section.category}
          </h2>
          <div className="space-y-2">
            {section.questions.map((faq) => {
              const isOpen = open === faq.q;
              return (
                <div key={faq.q} className="bg-white rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : faq.q)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900" style={{ fontFamily: fonts.body }}>
                      {faq.q}
                    </span>
                    {isOpen
                      ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                      : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                    }
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <p className="text-sm text-gray-500 leading-relaxed pt-4" style={{ fontFamily: fonts.body }}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: `${colors.primary}08`, border: `1px solid ${colors.primary}20` }}
      >
        <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: fonts.body }}>
          Still have questions?
        </p>
        <a
          href="/contact"
          className="text-sm font-semibold"
          style={{ color: colors.primary, fontFamily: fonts.body }}
        >
          Contact our support team →
        </a>
      </div>
    </div>
  );
}
