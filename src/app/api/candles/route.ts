import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const coin = req.nextUrl.searchParams.get("coin");
  const days = parseInt(req.nextUrl.searchParams.get("days") || "7");
  if (!coin) return NextResponse.json({ error: "Missing coin param" }, { status: 400 });

  const endTime = Date.now();
  const startTime = endTime - days * 86400 * 1000;

  try {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "candleSnapshot",
        req: { coin, interval: "1d", startTime, endTime },
      }),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    // data is array of { t, T, s, o, c, h, l, v, n }
    const candles = (Array.isArray(data) ? data : []).map((c: { t: number; o: string; h: string; l: string; c: string; v: string }) => ({
      t: c.t,
      o: parseFloat(c.o),
      h: parseFloat(c.h),
      l: parseFloat(c.l),
      c: parseFloat(c.c),
      v: parseFloat(c.v),
    }));
    return NextResponse.json(candles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
