const HL_API = "https://api.hyperliquid.xyz/info";
const CACHE_TTL = 60_000; // 60 seconds

interface CacheEntry<T> {
  data: T;
  ts: number;
}

let priceCache: CacheEntry<string | null> | null = null;
let metaCache: CacheEntry<HlMeta | null> | null = null;

export interface HlMeta {
  marketsCount: number;
  totalOi: string | null;
  totalVol24h: string | null;
  validatorCount: number | null;
}

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
    return { price: priceCache?.data ?? null, live: false };
  }
}

async function fetchValidatorCount(): Promise<number | null> {
  try {
    const res = await fetch(HL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "validatorSummaries" }),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.filter((v: { isActive?: boolean }) => v.isActive !== false).length;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getHlMeta(): Promise<{ meta: HlMeta | null; live: boolean }> {
  if (metaCache && Date.now() - metaCache.ts < CACHE_TTL) {
    return { meta: metaCache.data, live: true };
  }

  try {
    const [metaRes, validatorCount] = await Promise.all([
      fetch(HL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs" }),
        next: { revalidate: 60 },
      }),
      fetchValidatorCount(),
    ]);

    if (!metaRes.ok) throw new Error(`HL API ${metaRes.status}`);

    const data = await metaRes.json();
    // data is [meta, assetCtxs[]]
    const [metaObj, assetCtxs] = data as [
      { universe: { name: string }[] },
      { dayNtlVlm: string; openInterest: string }[]
    ];

    const marketsCount = metaObj.universe.length;

    let totalOi = 0;
    let totalVol = 0;
    for (const ctx of assetCtxs) {
      totalOi += parseFloat(ctx.openInterest || "0");
      totalVol += parseFloat(ctx.dayNtlVlm || "0");
    }

    const meta: HlMeta = {
      marketsCount,
      totalOi: totalOi > 0 ? totalOi.toFixed(0) : null,
      totalVol24h: totalVol > 0 ? totalVol.toFixed(0) : null,
      validatorCount,
    };

    metaCache = { data: meta, ts: Date.now() };
    return { meta, live: true };
  } catch {
    return { meta: metaCache?.data ?? null, live: false };
  }
}

export function formatUsd(value: string | number, compact = true): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0";
  if (compact) {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  }
  return `$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
