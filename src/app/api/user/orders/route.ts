import { NextRequest, NextResponse } from "next/server";

const BASE = "https://fleetowebapi.codingcloud.in/wp-json/custom-api/v1";

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");
  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  try {
    const res = await fetch(`${BASE}/orders-by-user/${user_id}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[orders route error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
