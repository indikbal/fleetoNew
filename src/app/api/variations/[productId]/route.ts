import { NextResponse } from "next/server";

const WC_BASE   = "https://fleetowebapi.codingcloud.in/wp-json/wc/v3";
const WC_KEY    = "ck_2a65d51ecd3d108e3e810dac3e03ba492cafe3bd";
const WC_SECRET = "cs_bebf42f0e9337f689dc4e88c2989c531c8aad6d9";

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
