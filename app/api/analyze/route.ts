import { NextResponse } from "next/server";

const VOICE_ANALYZER_URL =
  process.env.VOICE_ANALYZER_URL ?? "http://localhost:3000";
const VOICE_ANALYZER_API_KEY = process.env.VOICE_ANALYZER_API_KEY ?? "";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!VOICE_ANALYZER_API_KEY) {
    return NextResponse.json(
      { success: false, error: "VOICE_ANALYZER_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${VOICE_ANALYZER_URL}/api/v1/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": VOICE_ANALYZER_API_KEY,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(280_000),
  }).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : "Unknown fetch error";
    return new Response(
      JSON.stringify({ success: false, error: `Upstream unreachable: ${message}` }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
