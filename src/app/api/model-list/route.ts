import { NextResponse } from "next/server";

const MODEL_LIST_URL = `${process.env.WP_CUSTOM_API_URL}/model-list`;

export async function GET() {
  try {
    const res = await fetch(MODEL_LIST_URL, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch model list" },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Network error reaching model-list service" },
      { status: 200 }
    );
  }
}
