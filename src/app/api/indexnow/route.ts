import { NextResponse } from "next/server";

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://perp.wiki";
  const key = "dd886eea0392efa3b82dab2a281a4100";
  const urls = [siteUrl, `${siteUrl}/projects`, `${siteUrl}/learn`, `${siteUrl}/submit`];
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(siteUrl).hostname, key, urlList: urls }),
    });
    return NextResponse.json({ ok: true, status: res.status });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
