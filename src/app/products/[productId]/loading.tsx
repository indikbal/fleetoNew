import { colors, fonts } from "@/config/theme";

// Shown automatically by Next during navigation into /products/[productId].
// Next renders this as the immediate fallback while the RSC + its data fetch
// (fetchProductDetails + fetchProductSpecs + fetchProductDetailsNew) resolves.
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)" }}
      role="status"
      aria-live="polite"
    >
      <div className="relative w-16 h-16 mb-5">
        <span
          className="absolute inset-0 rounded-full border-[3px] border-transparent animate-spin"
          style={{ borderTopColor: colors.primary, borderRightColor: colors.primary }}
        />
        <span
          className="absolute inset-2 rounded-full opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
      </div>
      <p
        className="text-sm font-semibold tracking-wide"
        style={{ color: colors.primary, fontFamily: fonts.body }}
      >
        Loading product details…
      </p>
      <p
        className="text-xs text-gray-400 mt-1"
        style={{ fontFamily: fonts.body }}
      >
        Preparing specs, gallery and variants
      </p>
    </div>
  );
}
