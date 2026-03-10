import { NextRequest, NextResponse } from "next/server";

const BASE = "https://fleetowebapi.codingcloud.in/wp-json/custom-api/v1";

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");
  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const res = await fetch(`${BASE}/orders-by-user/${user_id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
