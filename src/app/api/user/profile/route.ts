import { NextRequest, NextResponse } from "next/server";

const BASE = "https://fleetowebapi.codingcloud.in/wp-json/custom/v1";

// GET /api/user/profile?user_id=1  →  WP my-profile
export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");
  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const res = await fetch(`${BASE}/my-profile?user_id=${user_id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// POST /api/user/profile  →  WP update-profile
export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${BASE}/update-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
