// Maps project slug → Hyperliquid coin ticker (null = no market)
export const PROJECT_MARKET_MAP: Record<string, string | null> = {
  "hyperliquid": "HYPE",
  "purr": "PURR",
  "hlp": null,
  "felix-protocol": null,
  "kinetiq": null,
  "hyperlend": null,
};

export function getMarketTicker(slug: string): string | null {
  return PROJECT_MARKET_MAP[slug] ?? null;
}
