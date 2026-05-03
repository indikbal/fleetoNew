"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Palette,
  IndianRupee,
  Gauge,
} from "lucide-react";
import { colors, fonts } from "@/config/theme";
import { formatPrice, type WCProduct, type ProductColor } from "@/lib/api";

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

      {/* ─── Product cards with specs ─────────────────────────────────── */}
      {activeCount > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 relative items-start">
          {selected.map((p, idx) => (
            <ProductHeroCard
              key={idx}
              product={p}
              index={idx}
              attrRows={attrRows}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Hero product card with specs ───────────────────────────────────── */
function ProductHeroCard({
  product,
  index,
  attrRows,
}: {
  product: WCProduct | null;
  index: number;
  attrRows: string[];
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
            "linear-gradient(to bottom, #ffffff 0%, #FFF5F5 100%)",
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

        <div className="px-3 pb-3 pt-1 sm:px-6 sm:pb-4 sm:pt-2 text-center">
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
            className="flex flex-col items-center"
            style={{ fontFamily: fonts.body }}
          >
            <span
              className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-gray-500"
            >
              Price Starts From
            </span>
            <span
              className="text-sm sm:text-lg font-bold"
              style={{ color: colors.primary }}
            >
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* ─── Specifications inside the card ─── */}
        <div className="border-t border-gray-200 bg-white/70 px-3 py-3 sm:px-6 sm:py-5">
          <h4
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2.5 sm:mb-3"
            style={{ color: colors.primary, fontFamily: fonts.body }}
          >
            Specifications
          </h4>

          <ul className="divide-y divide-gray-100">
            <SpecItem
              label="Price Starts From"
              icon={<IndianRupee size={12} />}
              value={
                <span
                  className="text-xs sm:text-sm font-extrabold whitespace-nowrap"
                  style={{ color: colors.primary, fontFamily: fonts.body }}
                >
                  {formatPrice(product.price)}
                </span>
              }
            />
            <SpecItem
              label="Colours"
              icon={<Palette size={12} />}
              stacked
              value={<ColorSwatches colors={product.variation_colors} />}
            />
            {attrRows.map((attrName) => {
              const attr = product.attributes.find(
                (a) => a.name === attrName
              );
              const hasMany = !!attr && attr.options.length > 1;
              return (
                <SpecItem
                  key={attrName}
                  label={attrName}
                  stacked={hasMany}
                  value={
                    attr ? (
                      hasMany ? (
                        <div className="flex flex-wrap gap-1 justify-start sm:justify-end w-full">
                          {attr.options.map((opt) => (
                            <span
                              key={opt}
                              className="text-[10px] sm:text-[11px] text-gray-700 font-medium px-2 py-0.5 rounded-full border"
                              style={{
                                backgroundColor: "#FFF5F5",
                                borderColor: "#F0E0E0",
                                fontFamily: fonts.body,
                              }}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span
                          className="text-[11px] sm:text-xs text-gray-700 font-medium break-words text-right"
                          style={{ fontFamily: fonts.body }}
                        >
                          {attr.options[0]}
                        </span>
                      )
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )
                  }
                />
              );
            })}
          </ul>

          <Link
            href={`/products/${product.id}`}
            className="mt-3 sm:mt-4 w-full inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-white transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: colors.primary,
              fontFamily: fonts.body,
            }}
          >
            View Details <ArrowUpRight size={12} />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Spec item row (inside card) ────────────────────────────────────── */
function SpecItem({
  label,
  icon,
  value,
  stacked = false,
}: {
  label: string;
  icon?: React.ReactNode;
  value: React.ReactNode;
  stacked?: boolean;
}) {
  return (
    <li
      className={
        stacked
          ? "flex flex-col gap-1.5 py-2 sm:py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
          : "flex items-center justify-between gap-2 py-2 sm:py-2.5"
      }
    >
      <span
        className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500 shrink-0"
        style={{ fontFamily: fonts.body }}
      >
        {icon && (
          <span style={{ color: colors.primary }} className="shrink-0 hidden sm:inline-flex">
            {icon}
          </span>
        )}
        {label}
      </span>
      <span
        className={
          stacked
            ? "min-w-0 flex flex-wrap items-center justify-start sm:justify-end w-full sm:w-auto"
            : "min-w-0 flex items-center justify-end"
        }
      >
        {value}
      </span>
    </li>
  );
}

/* ─── Color swatches ────────────────────────────────────────────────────── */
function ColorSwatches({ colors: list }: { colors: ProductColor[] }) {
  if (list.length === 0) {
    return <span className="text-gray-400 text-xs">—</span>;
  }
  return (
    <div className="flex items-center justify-start sm:justify-end gap-1 sm:gap-1.5 flex-wrap">
      {list.slice(0, 4).map((c, i) => (
        <span
          key={i}
          title={c.name}
          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white ring-1 ring-gray-200"
          style={{ backgroundColor: c.hex }}
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
