const HL_API = "https://api.hyperliquid.xyz/info";
const CACHE_TTL = 60_000; // 60 seconds

interface CacheEntry<T> {
  data: T;
  ts: number;
}

let priceCache: CacheEntry<string | null> | null = null;

export async function getHypePrice(): Promise<{ price: string | null; live: boolean }> {
  if (priceCache && Date.now() - priceCache.ts < CACHE_TTL) {
    return { price: priceCache.data, live: true };
  }

  try {
    const res = await fetch(HL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "allMids" }),
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`HL API ${res.status}`);

    const data: Record<string, string> = await res.json();
    const price = data["HYPE"] || null;

    priceCache = { data: price, ts: Date.now() };
    return { price, live: true };
  } catch {
    // Return cached data or null on failure
    return { price: priceCache?.data ?? null, live: false };
  }
}
