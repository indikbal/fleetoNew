import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const res = await fetch(`${process.env.WP_CUSTOM_URL}/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: parseInt(productId, 10) }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  const data = await res.json();
  return NextResponse.json(data);
}
