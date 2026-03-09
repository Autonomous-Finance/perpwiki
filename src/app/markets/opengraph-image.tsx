import { ImageResponse } from "@vercel/og";
import { OG_SIZE, HW_COLORS } from "@/lib/og-utils";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "Live Hyperliquid Markets — real-time prices, volume and open interest on PerpWiki";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 60,
          background: HW_COLORS.bg,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "6px 16px",
              border: `1px solid ${HW_COLORS.cyan}`,
              borderRadius: 4,
              fontSize: 14,
              color: HW_COLORS.cyan,
              letterSpacing: "0.05em",
            }}
          >
            MARKETS
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: HW_COLORS.text,
              lineHeight: 1.1,
            }}
          >
            Live Hyperliquid Markets
          </div>
          <div
            style={{
              fontSize: 22,
              color: HW_COLORS.muted,
            }}
          >
            Real-time prices, volume &amp; open interest
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: "0.1em",
            color: HW_COLORS.muted,
          }}
        >
          <span style={{ color: HW_COLORS.text }}>PERP</span>
          <span style={{ color: HW_COLORS.green }}>.WIKI</span>
          <span style={{ marginLeft: 8 }}> · Markets</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
