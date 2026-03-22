import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id } = body;

  if (!order_id) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  try {
    const res = await fetch("https://fleetowebapi.codingcloud.in/wp-json/invoice/v1/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id }),
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/pdf") || contentType.includes("application/octet-stream")) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        status: res.status,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="invoice-${order_id}.pdf"`,
        },
      });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[invoice route error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
