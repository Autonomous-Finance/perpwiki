import { ImageResponse } from "@vercel/og";
import { OG_SIZE, HW_COLORS } from "@/lib/og-utils";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "Learn Hyperliquid | HYPE.WIKI";
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
          backgroundColor: HW_COLORS.bg,
          padding: "60px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              color: HW_COLORS.text,
            }}
          >
            Learn Hyperliquid
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: HW_COLORS.muted,
              marginTop: 16,
            }}
          >
            In-depth guides to the Hyperliquid ecosystem
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: HW_COLORS.muted,
            letterSpacing: "0.1em",
          }}
        >
          <span style={{ color: HW_COLORS.text }}>HYPE</span>
          <span style={{ color: HW_COLORS.green }}>.WIKI</span>
          <span style={{ marginLeft: 8 }}> · Learn</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
