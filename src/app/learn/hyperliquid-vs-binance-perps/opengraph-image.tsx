import { createLearnOGImage } from "@/lib/learn-og";
import { OG_SIZE } from "@/lib/og-utils";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "Hyperliquid vs Binance Perps | PerpWiki";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return createLearnOGImage("Hyperliquid vs Binance Perps: On-Chain vs CEX", "Comparisons");
}
