import { NextResponse } from "next/server";

const BOOK_TEST_RIDE_URL =
  "https://fleetowebapi.codingcloud.in/wp-json/custom-api/v1/book-a-test-ride";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(BOOK_TEST_RIDE_URL, {
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
              (data as Record<string, string>)?.error ??
              "Failed to book test ride",
          },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Network error reaching booking service" },
      { status: 200 }
    );
  }
}
