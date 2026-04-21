import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const WC_BASE          = process.env.WP_WC_URL!;
const WC_KEY           = process.env.WC_KEY!;
const WC_SECRET        = process.env.WC_SECRET!;
const WC_ORDERS_KEY    = process.env.WC_ORDERS_KEY!;
const WC_ORDERS_SECRET = process.env.WC_ORDERS_SECRET!;
const RZP_KEY_ID       = process.env.RAZORPAY_KEY_ID!;
const RZP_KEY_SECRET   = process.env.RAZORPAY_KEY_SECRET!;

interface OrderItem {
  product_id: number;
  variation_id: number;
  quantity: number;
}

interface Address {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

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

// Timing-safe HMAC comparison prevents signature-byte leakage via response timing.
function isValidSignature(orderId: string, paymentId: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", RZP_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
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
    const razorpay_order_id: string | undefined = body?.razorpay_order_id;
    const razorpay_payment_id: string | undefined = body?.razorpay_payment_id;
    const razorpay_signature: string | undefined = body?.razorpay_signature;
    const rawItems: OrderItem[] = Array.isArray(body?.items) ? body.items : [];
    const billing: Address | undefined = body?.billing;
    const shipping: Address | undefined = body?.shipping;
    const customer_id: number | undefined = body?.customer_id
      ? Number(body.customer_id)
      : undefined;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    // 1. Signature check (HMAC SHA256, timing-safe). Proves the payload came from Razorpay.
    if (!isValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    if (!billing || !shipping) {
      return NextResponse.json(
        { success: false, error: "Billing and shipping addresses are required" },
        { status: 400 }
      );
    }

    const items: OrderItem[] = rawItems
      .map((i) => ({
        product_id: Number(i?.product_id),
        variation_id: Number(i?.variation_id ?? 0),
        quantity: Math.max(1, Math.floor(Number(i?.quantity ?? 1))),
      }))
      .filter((i) => Number.isFinite(i.product_id) && i.product_id > 0);

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order items" },
        { status: 400 }
      );
    }

    // 2. Re-compute authoritative amount from live WC prices.
    const unitPrices = await Promise.all(items.map(fetchUnitPricePaise));
    const computedPaise = items.reduce(
      (sum, item, i) => sum + unitPrices[i] * item.quantity,
      0
    );

    // 3. Fetch the Razorpay order back — the amount there was locked server-side at create.
    //    Asserting (a) amount matches what we compute now and (b) status is paid, catches
    //    both price tampering between create/verify and fake "paid" claims from the client.
    const auth = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString("base64");
    const rpRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
    if (!rpRes.ok) {
      return NextResponse.json(
        { success: false, error: "Could not verify payment order with gateway" },
        { status: 502 }
      );
    }
    const rpOrder = await rpRes.json();
    if (Number(rpOrder?.amount) !== computedPaise) {
      return NextResponse.json(
        { success: false, error: "Payment amount mismatch" },
        { status: 400 }
      );
    }
    if (rpOrder?.status !== "paid") {
      return NextResponse.json(
        { success: false, error: "Payment is not completed" },
        { status: 400 }
      );
    }

    // 4. Create the WooCommerce order (set_paid:true). Payment identifiers are stamped
    //    into both transaction_id and meta_data for reconciliation.
    const wcOrdersUrl =
      `${WC_BASE}/orders` +
      `?consumer_key=${WC_ORDERS_KEY}` +
      `&consumer_secret=${WC_ORDERS_SECRET}`;

    const wcPayload = {
      payment_method: "razorpay",
      payment_method_title: "Razorpay",
      set_paid: true,
      transaction_id: razorpay_payment_id,
      billing,
      shipping,
      line_items: items.map((i) => ({
        product_id: i.product_id,
        ...(i.variation_id > 0 ? { variation_id: i.variation_id } : {}),
        quantity: i.quantity,
      })),
      ...(customer_id ? { customer_id } : {}),
      meta_data: [
        { key: "_razorpay_order_id", value: razorpay_order_id },
        { key: "_razorpay_payment_id", value: razorpay_payment_id },
        { key: "_razorpay_signature", value: razorpay_signature },
      ],
    };

    const wcRes = await fetch(wcOrdersUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wcPayload),
    });
    const wcData = await wcRes.json().catch(() => ({}));

    if (!wcRes.ok || !wcData?.id) {
      // Payment captured but order not created — surface payment_id so support can reconcile.
      console.error("WC order creation failed after successful payment", {
        razorpay_order_id,
        razorpay_payment_id,
        wcError: wcData,
      });
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment captured but order could not be created. Please contact support with this reference.",
          payment_id: razorpay_payment_id,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      wc_order_id: wcData.id,
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
