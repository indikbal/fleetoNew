import { NextRequest, NextResponse } from "next/server";

// Only allow proxying PDFs from the Fleeto backend to prevent open-proxy abuse.
const ALLOWED_HOSTS = new Set([
  "fleetowebapi.codingcloud.in",
  "fleeto.codingcloud.in",
]);

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname) || !parsed.pathname.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  // Forward range header so browsers can stream/seek the PDF efficiently.
  const range = req.headers.get("range");
  const upstream = await fetch(parsed.toString(), {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: "Upstream fetch failed" },
      { status: upstream.status }
    );
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", "inline");
  headers.set("X-Content-Type-Options", "nosniff");
  // Prevent framing from other origins while still allowing our own app.
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Cache-Control", "private, max-age=600");

  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);
  const acceptRanges = upstream.headers.get("accept-ranges");
  if (acceptRanges) headers.set("Accept-Ranges", acceptRanges);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
