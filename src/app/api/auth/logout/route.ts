import { NextResponse } from "next/server";

const API_BASE = process.env.WP_AJAX_URL!;

export async function POST() {
  const res = await fetch(`${API_BASE}?action=logout_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
