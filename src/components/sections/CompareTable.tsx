"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  X,
  Palette,
  IndianRupee,
  Gauge,
} from "lucide-react";
import { colors, fonts } from "@/config/theme";
import { formatPrice, colorNameToHex, type WCProduct } from "@/lib/api";

interface CompareTableProps {
  products: WCProduct[];
}

export default function CompareTable({ products }: CompareTableProps) {
  const [idA, setIdA] = useState<number | null>(products[0]?.id ?? null);
  const [idB, setIdB] = useState<number | null>(
    products[1]?.id ?? products[0]?.id ?? null
  );

  const productA = useMemo(
    () => products.find((p) => p.id === idA) ?? null,
    [products, idA]
  );
  const productB = useMemo(
    () => products.find((p) => p.id === idB) ?? null,
    [products, idB]
  );

  const selected: (WCProduct | null)[] = [productA, productB];
  const activeCount = selected.filter(Boolean).length;

  const attrRows = useMemo(() => {
    const names = new Set<string>();
    [productA, productB]
      .filter((p): p is WCProduct => Boolean(p))
      .forEach((p) =>
        p.attributes
          .filter((a) => !["color", "colour"].includes(a.name.toLowerCase()))
          .forEach((a) => names.add(a.name))
      );
    return Array.from(names);
  }, [productA, productB]);

  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* ─── Selector card ──────────────────────────────────────────────── */}
      <div
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #FFF5F5 100%)",
          borderColor: "#F2D4D4",
        }}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: colors.primary }}
          >
            <Gauge size={16} className="text-white sm:hidden" />
            <Gauge size={18} className="text-white hidden sm:block" />
          </div>
          <div className="min-w-0">
            <h3
              className="text-sm sm:text-lg font-bold leading-tight"
              style={{ color: colors.black, fontFamily: fonts.body }}
            >
              Pick two models to compare
            </h3>
            <p
              className="text-[11px] sm:text-xs text-gray-500"
              style={{ fontFamily: fonts.body }}
            >
              See every spec side by side
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-end">
          <ModelSelect
            label="Model A"
            value={idA}
            onChange={setIdA}
            products={products}
            disabledId={idB}
          />
          <div className="flex items-center justify-center pb-2 sm:pb-3">
            <span
              className="inline-flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full text-white text-[11px] sm:text-sm font-bold shadow-md"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                fontFamily: fonts.display,
              }}
            >
              VS
            </span>
          </div>
          <ModelSelect
            label="Model B"
            value={idB}
            onChange={setIdB}
            products={products}
            disabledId={idA}
          />
        </div>
      </div>

      {/* ─── Hero product cards ─────────────────────────────────────────── */}
      {activeCount > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 relative">
          {selected.map((p, idx) => (
            <ProductHeroCard key={idx} product={p} index={idx} />
          ))}

          {/* Floating VS badge overlap */}
          {activeCount === 2 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex pointer-events-none z-10">
              <span
                className="inline-flex items-center justify-center w-9 h-9 sm:w-14 sm:h-14 rounded-full text-white text-[11px] sm:text-sm font-bold shadow-xl ring-2 sm:ring-4 ring-white"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  fontFamily: fonts.display,
                  letterSpacing: "1px",
                }}
              >
                VS
              </span>
            </div>
          )}
        </div>
      )}

      {/* ─── Spec comparison ────────────────────────────────────────────── */}
      {activeCount > 0 && (
        <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div
            className="px-4 sm:px-8 py-3 sm:py-4 border-b border-gray-100"
            style={{
              background:
                "linear-gradient(90deg, #FFF5F5 0%, #ffffff 100%)",
            }}
          >
            <h4
              className="text-xs sm:text-sm font-bold uppercase tracking-widest"
              style={{ color: colors.primary, fontFamily: fonts.body }}
            >
              Specifications
            </h4>
          </div>

          <div className="divide-y divide-gray-100">
            <SpecRow
              label="Price"
              icon={<IndianRupee size={14} />}
              selected={selected}
              render={(p) => (
                <span
                  className="text-sm sm:text-lg font-extrabold whitespace-nowrap"
                  style={{ color: colors.primary, fontFamily: fonts.body }}
                >
                  {formatPrice(p.price)}
                </span>
              )}
            />

            <SpecRow
              label="Colours"
              icon={<Palette size={14} />}
              highlight
              selected={selected}
              render={(p) => <ColorSwatches colors={p.variation_colors} />}
            />

            {attrRows.map((attrName, idx) => (
              <SpecRow
                key={attrName}
                label={attrName}
                highlight={idx % 2 === 0}
                selected={selected}
                render={(p) => {
                  const attr = p.attributes.find((a) => a.name === attrName);
                  return attr ? (
                    <span
                      className="text-xs sm:text-sm text-gray-700 font-medium break-words"
                      style={{ fontFamily: fonts.body }}
                    >
                      {attr.options.join(", ")}
                    </span>
                  ) : (
                    <X size={14} className="text-gray-300 mx-auto" />
                  );
                }}
              />
            ))}

            <SpecRow
              label="Details"
              selected={selected}
              render={(p) => (
                <Link
                  href={`/products/${p.id}`}
                  className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white transition-transform hover:scale-105"
                  style={{
                    backgroundColor: colors.primary,
                    fontFamily: fonts.body,
                  }}
                >
                  View <ArrowUpRight size={12} />
                </Link>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Hero product card ─────────────────────────────────────────────────── */
function ProductHeroCard({
  product,
  index,
}: {
  product: WCProduct | null;
  index: number;
}) {
  if (!product) {
    return (
      <div
        className="rounded-2xl sm:rounded-3xl border-2 border-dashed flex items-center justify-center py-10 sm:py-20 px-3 sm:px-6 text-center"
        style={{ borderColor: "#E5E5E5", minHeight: 180 }}
      >
        <div>
          <p
            className="text-xs sm:text-sm text-gray-400 font-medium"
            style={{ fontFamily: fonts.body }}
          >
            Select Model {index === 0 ? "A" : "B"}
          </p>
        </div>
      </div>
    );
  }

  const imageUrl = product.images[0]?.src ?? "/images/hero-scooty.png";
  const hasSale =
    !!product.sale_price && product.sale_price !== product.price;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl sm:rounded-3xl overflow-hidden relative flex flex-col border shadow-sm hover:shadow-lg transition-shadow"
        style={{
          background:
            "linear-gradient(to bottom, #ffffff 0%, #FFE8E8 100%)",
          borderColor: "#F2D4D4",
        }}
      >
        {hasSale && (
          <span
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full z-10 uppercase tracking-wider"
            style={{
              backgroundColor: colors.primary,
              color: "#fff",
              fontFamily: fonts.body,
            }}
          >
            Sale
          </span>
        )}

        <div className="relative w-full aspect-[4/3] sm:aspect-[5/4]">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 50vw"
            className="object-contain p-3 sm:p-6"
            priority={index === 0}
          />
        </div>

        <div className="px-3 pb-4 pt-1 sm:px-6 sm:pb-6 sm:pt-2 text-center">
          <h3
            className="text-sm sm:text-2xl font-extrabold mb-0.5 sm:mb-1 leading-tight"
            style={{
              color: colors.black,
              fontFamily: fonts.display,
              letterSpacing: "0.5px",
            }}
          >
            {product.name}
          </h3>
          <div
            className="text-sm sm:text-lg font-bold"
            style={{ color: colors.primary, fontFamily: fonts.body }}
          >
            {formatPrice(product.price)}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Spec row ──────────────────────────────────────────────────────────── */
function SpecRow({
  label,
  icon,
  highlight,
  selected,
  render,
}: {
  label: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  selected: (WCProduct | null)[];
  render: (p: WCProduct) => React.ReactNode;
}) {
  return (
    <div
      className="grid grid-cols-[0.9fr_1fr_1fr] sm:grid-cols-[1fr_1fr_1fr] items-center"
      style={{ backgroundColor: highlight ? "#FAFAFA" : "#fff" }}
    >
      <div
        className="px-3 sm:px-8 py-3 sm:py-4 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-gray-600"
        style={{ fontFamily: fonts.body }}
      >
        {icon && (
          <span style={{ color: colors.primary }} className="shrink-0 hidden sm:inline-flex">
            {icon}
          </span>
        )}
        <span className="break-words leading-tight">{label}</span>
      </div>
      {selected.map((p, i) => (
        <div
          key={i}
          className="px-2 sm:px-6 py-3 sm:py-4 text-center border-l border-gray-100"
        >
          {p ? (
            render(p)
          ) : (
            <span className="text-gray-300 text-sm">—</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Color swatches ────────────────────────────────────────────────────── */
function ColorSwatches({ colors: list }: { colors: string[] }) {
  if (list.length === 0) {
    return <span className="text-gray-400 text-sm">—</span>;
  }
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
      {list.slice(0, 4).map((c, i) => (
        <span
          key={i}
          title={c}
          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white ring-1 ring-gray-200"
          style={{ backgroundColor: colorNameToHex(c) }}
        />
      ))}
      {list.length > 4 && (
        <span
          className="text-[10px] font-semibold text-gray-500 ml-0.5 sm:ml-1"
          style={{ fontFamily: fonts.body }}
        >
          +{list.length - 4}
        </span>
      )}
    </div>
  );
}

/* ─── Dropdown select ───────────────────────────────────────────────────── */
interface ModelSelectProps {
  label: string;
  value: number | null;
  onChange: (id: number | null) => void;
  products: WCProduct[];
  disabledId: number | null;
}

function ModelSelect({
  label,
  value,
  onChange,
  products,
  disabledId,
}: ModelSelectProps) {
  return (
    <label className="block min-w-0">
      <span
        className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 text-gray-500"
        style={{ fontFamily: fonts.body }}
      >
        {label}
      </span>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full appearance-none border-2 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-3.5 pr-7 sm:pr-10 text-xs sm:text-sm bg-white cursor-pointer font-semibold focus:outline-none transition-colors truncate"
          style={{
            fontFamily: fonts.body,
            color: colors.black,
            borderColor: value ? colors.primary : "#E5E7EB",
          }}
        >
          <option value="">— Select —</option>
          {products.map((p) => (
            <option
              key={p.id}
              value={p.id}
              disabled={p.id === disabledId}
            >
              {p.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: value ? colors.primary : "#9CA3AF" }}
        />
      </div>
    </label>
  );
}
