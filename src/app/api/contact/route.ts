import { NextResponse } from "next/server";

const CONTACT_URL =
  "https://fleetowebapi.codingcloud.in/wp-json/custom-api/v1/contact";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(CONTACT_URL, {
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
              (data as Record<string, string>)?.error ??
              "Failed to send message",
          },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Network error reaching contact service" },
      { status: 200 }
    );
  }
}
