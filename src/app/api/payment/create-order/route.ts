import { NextRequest, NextResponse } from "next/server";

const WC_BASE        = process.env.WP_WC_URL!;
const WC_KEY         = process.env.WC_KEY!;
const WC_SECRET      = process.env.WC_SECRET!;
const RZP_KEY_ID     = process.env.RAZORPAY_KEY_ID!;
const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

interface OrderItem {
  product_id: number;
  variation_id: number;
  quantity: number;
}

// Fetch the authoritative unit price (in paise) for one cart line from WC.
// Variation_id is preferred when present — otherwise fall back to product price.
async function fetchUnitPricePaise(item: OrderItem): Promise<number> {
  const url = item.variation_id
    ? `${WC_BASE}/products/${item.product_id}/variations/${item.variation_id}?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
    : `${WC_BASE}/products/${item.product_id}?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load price for product ${item.product_id}`);
  }
  const data = await res.json();
  const price = parseFloat(String(data?.price ?? "0"));
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error(`Invalid price for product ${item.product_id}`);
  }
  return Math.round(price * 100);
}

export async function POST(req: NextRequest) {
  try {
    if (!RZP_KEY_ID || !RZP_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawItems: OrderItem[] = Array.isArray(body?.items) ? body.items : [];

    const items: OrderItem[] = rawItems
      .map((i) => ({
        product_id: Number(i?.product_id),
        variation_id: Number(i?.variation_id ?? 0),
        quantity: Math.max(1, Math.floor(Number(i?.quantity ?? 1))),
      }))
      .filter((i) => Number.isFinite(i.product_id) && i.product_id > 0);

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    // Server is the sole source of truth for the total — client-sent prices are never used.
    const unitPrices = await Promise.all(items.map(fetchUnitPricePaise));
    const totalPaise = items.reduce(
      (sum, item, i) => sum + unitPrices[i] * item.quantity,
      0
    );

    if (totalPaise < 100) {
      return NextResponse.json(
        { success: false, error: "Order total is below the minimum payable amount" },
        { status: 400 }
      );
    }

    // Receipt must be ≤ 40 chars — compact + unique is enough for Razorpay's idempotency.
    const receipt = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const auth = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString("base64");

    const rpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: totalPaise,
        currency: "INR",
        receipt,
        notes: {
          customer_id: String(body?.customer_id ?? ""),
          customer_email: String(body?.billing?.email ?? ""),
          item_count: String(items.length),
        },
      }),
      cache: "no-store",
    });

    const rpOrder = await rpRes.json().catch(() => ({}));
    if (!rpRes.ok || !rpOrder?.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            rpOrder?.error?.description ??
            rpOrder?.error?.reason ??
            "Failed to create payment order",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      rp_order_id: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      key_id: RZP_KEY_ID,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
