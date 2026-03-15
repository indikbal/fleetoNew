import { NextResponse } from "next/server";

const CART_URL = `${process.env.WP_CUSTOM_URL}/add-to-cart/`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(CART_URL, {
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

    // Always return 200 to the client so fetch() never throws
    return NextResponse.json(
      res.ok ? data : { error: (data as Record<string, string>)?.error ?? "Failed to add to cart" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Network error reaching cart service" }, { status: 200 });
  }
}
