import { NextResponse } from "next/server";

const WC_ORDERS_URL =
  "https://fleetowebapi.codingcloud.in/wp-json/wc/v3/orders" +
  "?consumer_key=ck_0a7c7f2a32c835c6b98118850adb53f62733fa05" +
  "&consumer_secret=cs_3b4b2a820e23576861de453148196f29ee2de723";

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
