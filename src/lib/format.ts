/** Compact USD format: $1.2B, $340M, $12K, $5 */
export function formatCompactUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

/** Format price with smart precision: <$1 uses 4 sig figs, else 2 decimals */
export function formatPrice(n: number): string {
  if (n < 1) return `$${n.toPrecision(4)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

/** Extract hostname from URL, returns fallback on invalid URL */
export function getHostname(url: string, fallback = "Website"): string {
  try {
    return new URL(url).hostname;
  } catch {
    return fallback;
  }
}

/** Map category substring to CTA label */
const CTA_MAP: [string, string][] = [
  ["Trading", "Start Trading"],
  ["Lending", "Launch App"],
  ["Yield", "Launch App"],
  ["Staking", "Launch App"],
  ["NFT", "Explore NFTs"],
  ["Bridge", "Bridge Now"],
  ["Analytics", "View Dashboard"],
  ["Data", "View Dashboard"],
  ["SDK", "View Docs"],
];

export function getCtaLabel(category: string): string {
  for (const [match, label] of CTA_MAP) {
    if (category.includes(match)) return label;
  }
  return "Visit Website";
}

/** Status color CSS variable */
export function getStatusColor(status: string): string {
  if (status === "ACTIVE") return "var(--hw-green)";
  if (status === "BETA") return "var(--hw-gold)";
  return "var(--hw-red)";
}
