"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldCheck, Wrench, FileText } from "lucide-react";
import { colors, fonts } from "@/config/theme";
import type { WarrantyProduct } from "@/lib/api";

interface Props {
  products: WarrantyProduct[];
}

type TabKey = "warranty" | "service" | "document";

export default function WarrantyContent({ products }: Props) {
  const [selectedId, setSelectedId] = useState<number>(
    products[0]?.product_id ?? 0
  );
  const [activeTab, setActiveTab] = useState<TabKey>("warranty");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const current = products.find((p) => p.product_id === selectedId);

  // If the newly selected product has no PDF, snap away from the Document tab.
  useEffect(() => {
    if (activeTab === "document" && !current?.warranty_and_support_section_pdf) {
      setActiveTab("warranty");
    }
  }, [activeTab, current]);

  return (
    <div className="space-y-6">
      {/* ── Product selector + Tab bar ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8">
        {/* Product dropdown */}
        <div className="mb-6">
          <label
            className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
            style={{ fontFamily: fonts.body }}
          >
            Select your model
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-3 rounded-xl px-5 py-3.5 text-left transition-colors"
              style={{
                fontFamily: fonts.body,
                background: "#F7F7F7",
                border: dropdownOpen
                  ? `1px solid ${colors.primary}`
                  : "1px solid rgba(0,0,0,0.08)",
                color: colors.black,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {current?.product_name ?? "Select a product"}
              <ChevronDown
                size={18}
                className="text-gray-400 transition-transform"
                style={{
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute z-20 mt-2 w-full rounded-xl bg-white shadow-lg overflow-hidden"
                  style={{ border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  {products.map((p) => {
                    const isSel = p.product_id === selectedId;
                    return (
                      <li key={p.product_id}>
                        <button
                          onClick={() => {
                            setSelectedId(p.product_id);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-5 py-3 text-sm transition-colors hover:bg-gray-50"
                          style={{
                            fontFamily: fonts.body,
                            fontWeight: isSel ? 600 : 400,
                            color: isSel ? colors.primary : colors.black,
                            backgroundColor: isSel
                              ? "rgba(171,35,35,0.05)"
                              : undefined,
                          }}
                        >
                          {p.product_name}
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "warranty" as TabKey, label: "Warranty", Icon: ShieldCheck },
              { key: "service" as TabKey, label: "Service & Support", Icon: Wrench },
              ...(current?.warranty_and_support_section_pdf
                ? [{ key: "document" as TabKey, label: "Document", Icon: FileText }]
                : []),
            ] as const
          ).map(({ key, label, Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300"
                style={{
                  fontFamily: fonts.body,
                  color: isActive ? "#fff" : colors.black,
                  background: isActive ? colors.primary : "rgba(0,0,0,0.05)",
                  border: isActive ? "none" : "1px solid rgba(0,0,0,0.08)",
                  boxShadow: isActive
                    ? "inset 0px 4px 4px rgba(0,0,0,0.25)"
                    : "none",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content panel ── */}
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={`${selectedId}-${activeTab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl p-6 sm:p-10"
          >
            {/* Section title */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              {activeTab === "warranty" ? (
                <ShieldCheck size={22} style={{ color: colors.primary }} />
              ) : activeTab === "service" ? (
                <Wrench size={22} style={{ color: colors.primary }} />
              ) : (
                <FileText size={22} style={{ color: colors.primary }} />
              )}
              <h2
                className="text-lg sm:text-xl font-semibold"
                style={{ fontFamily: fonts.body, color: colors.black }}
              >
                {current.product_name} —{" "}
                {activeTab === "warranty"
                  ? "Warranty Rules"
                  : activeTab === "service"
                  ? "Service & Support"
                  : "Document Preview"}
              </h2>
            </div>

            {activeTab === "document" ? (
              current.warranty_and_support_section_pdf ? (
                <PdfPreview url={current.warranty_and_support_section_pdf} />
              ) : (
                <p
                  className="text-sm text-gray-400 text-center py-10"
                  style={{ fontFamily: fonts.body }}
                >
                  No document available for this model.
                </p>
              )
            ) : (
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                style={{ fontFamily: fonts.body }}
                dangerouslySetInnerHTML={{
                  __html:
                    activeTab === "warranty"
                      ? current.warranty_rules
                      : current.support_rules,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!current && (
        <div className="bg-white rounded-2xl p-10 text-center">
          <p
            className="text-gray-400 text-sm"
            style={{ fontFamily: fonts.body }}
          >
            No warranty or service information available.
          </p>
        </div>
      )}
    </div>
  );
}

// ── PDF preview (read-only, download/print toolbar hidden) ──────────────────
function PdfPreview({ url }: { url: string }) {
  // Proxy through our own route so the PDF is served with
  // `Content-Disposition: inline` and the source domain isn't exposed via
  // "Save as…". Hash params hide the built-in viewer toolbar / download
  // button in Chromium browsers. No `sandbox` attribute — Chrome's PDF
  // viewer plugin refuses to load inside a sandboxed frame.
  const src = `/api/pdf-proxy?url=${encodeURIComponent(
    url
  )}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border"
      style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#F7F7F7" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={src}
        title="Document preview"
        className="block w-full"
        style={{ height: "80vh", minHeight: 520, border: "none" }}
      />
      <p
        className="text-[11px] text-gray-400 text-center py-2"
        style={{ fontFamily: fonts.body }}
      >
        Preview only — this document cannot be downloaded.
      </p>
    </div>
  );
}
