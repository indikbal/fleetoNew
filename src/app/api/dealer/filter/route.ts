import { NextResponse } from "next/server";

const DEALER_FILTER_URL = "https://fleetowebapi.codingcloud.in/wp-json/dealer/v12/filter";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(DEALER_FILTER_URL, {
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
              "Failed to filter dealers",
          },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Network error reaching dealer service" },
      { status: 200 }
    );
  }
}
