import { ImageResponse } from "@vercel/og";
import { OG_SIZE, HW_COLORS } from "@/lib/og-utils";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "Hyperliquid Funding Rates — live rates, APR and aggregate statistics on perp.wiki";
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
              border: `1px solid ${HW_COLORS.green}`,
              borderRadius: 4,
              fontSize: 14,
              color: HW_COLORS.green,
              letterSpacing: "0.05em",
            }}
          >
            FUNDING RATES
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: HW_COLORS.text,
              lineHeight: 1.1,
            }}
          >
            Hyperliquid Funding Rates
          </div>
          <div
            style={{
              fontSize: 22,
              color: HW_COLORS.muted,
            }}
          >
            Live rates, APR &amp; aggregate statistics
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
          <span style={{ marginLeft: 8 }}> · Funding Rates</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
