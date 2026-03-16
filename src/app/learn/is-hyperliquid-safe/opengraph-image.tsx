import { createLearnOGImage } from "@/lib/learn-og";
import { OG_SIZE } from "@/lib/og-utils";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "Is Hyperliquid Safe? Security, Risks & Honest Review 2026 | perp.wiki";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return createLearnOGImage("Is Hyperliquid Safe? Security, Risks & Honest Review", "Guides");
}
