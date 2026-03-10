import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://fleetowebapi.codingcloud.in/wp-admin/admin-ajax.php";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${API_BASE}?action=login_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
