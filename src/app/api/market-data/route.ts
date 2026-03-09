import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const coin = req.nextUrl.searchParams.get("coin");
  if (!coin) return NextResponse.json({ error: "Missing coin param" }, { status: 400 });

  try {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "metaAndAssetCtxs" }),
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("API error");
    const [meta, ctxs] = await res.json();
    const idx = meta.universe.findIndex((u: { name: string }) => u.name === coin);
    if (idx === -1) return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    const ctx = ctxs[idx];
    return NextResponse.json({
      coin,
      markPx: ctx.markPx,
      prevDayPx: ctx.prevDayPx,
      funding: ctx.funding,
      openInterest: ctx.openInterest,
      dayNtlVlm: ctx.dayNtlVlm,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
