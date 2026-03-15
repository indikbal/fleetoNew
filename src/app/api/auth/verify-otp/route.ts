import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.WP_CUSTOM_URL!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${BASE}/forgot-password/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
