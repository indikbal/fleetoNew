import { NextResponse } from "next/server";

const REGISTER_FLEETO_URL = `${process.env.WP_CUSTOM_API_URL}/register-your-fleeto`;

// The upstream WP endpoint expects multipart/form-data so it can receive the
// invoice file. We forward whatever multipart body the client sent — including
// repeated battery_numbers[] entries and the invoice_file blob.
export async function POST(req: Request) {
  try {
    const incoming = await req.formData();

    const forwarded = new FormData();
    for (const [key, value] of incoming.entries()) {
      forwarded.append(key, value);
    }

    const res = await fetch(REGISTER_FLEETO_URL, {
      method: "POST",
      body: forwarded,
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
              "Failed to register Fleeto",
          },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Network error reaching registration service" },
      { status: 200 }
    );
  }
}
