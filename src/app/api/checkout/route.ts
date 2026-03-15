import { NextResponse } from "next/server";

const WC_ORDERS_URL =
  `${process.env.WP_WC_URL}/orders` +
  `?consumer_key=${process.env.WC_ORDERS_KEY}` +
  `&consumer_secret=${process.env.WC_ORDERS_SECRET}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(WC_ORDERS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = { error: "Invalid response from server" };
    }

    return NextResponse.json(
      res.ok
        ? data
        : {
            error:
              (data as Record<string, string>)?.message ??
              (data as Record<string, string>)?.error ??
              "Failed to place order",
          },
      { status: res.ok ? 200 : 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Network error reaching checkout service" },
      { status: 200 }
    );
  }
}
