import { createLearnOGImage } from "@/lib/learn-og";
import { OG_SIZE } from "@/lib/og-utils";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "Open Interest on Hyperliquid Explained | PerpWiki";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return createLearnOGImage("Open Interest on Hyperliquid Explained", "Fundamentals");
}
