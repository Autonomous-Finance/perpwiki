import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";

export const dynamic = "force-dynamic";

const BATCH_SIZE = 500;

export async function POST(req: Request) {
  const key = req.headers.get("x-api-key");
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const indexNowKey = process.env.INDEXNOW_API_KEY;
  if (!indexNowKey) {
    return NextResponse.json({ error: "INDEXNOW_API_KEY not set" }, { status: 500 });
  }

  const entries = await sitemap();
  const urls = entries.map((entry) => entry.url);

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "perp.wiki",
        key: indexNowKey,
        urlList: batch,
      }),
    });
  }

  return NextResponse.json({ submitted: urls.length });
}
