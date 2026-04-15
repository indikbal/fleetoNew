import { NextResponse } from "next/server";

const RAISE_ISSUE_URL = `${process.env.WP_CUSTOM_API_URL}/raise-service-issue`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(RAISE_ISSUE_URL, {
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
              "Failed to submit service issue",
          },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Network error reaching service issue endpoint" },
      { status: 200 }
    );
  }
}
