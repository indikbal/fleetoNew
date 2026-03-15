import { NextResponse } from "next/server";

const WC_BASE   = process.env.WP_WC_URL!;
const WC_KEY    = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const res = await fetch(
    `${WC_BASE}/products/${productId}/variations?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return NextResponse.json({ error: "Failed to fetch variations" }, { status: 500 });
  const data = await res.json();
  return NextResponse.json(data);
}
