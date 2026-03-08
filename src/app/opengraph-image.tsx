import { ImageResponse } from "@vercel/og";
import { OG_SIZE, HW_COLORS } from "@/lib/og-utils";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "PerpWiki — Hyperliquid Ecosystem Intelligence";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const count = await prisma.project.count({ where: { approvalStatus: "APPROVED" } });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: HW_COLORS.bg,
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: HW_COLORS.text,
            letterSpacing: "0.1em",
          }}
        >
          <span>PERP</span>
          <span style={{ color: HW_COLORS.green, fontWeight: 300 }}>.WIKI</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: HW_COLORS.muted,
            marginTop: 20,
          }}
        >
          Hyperliquid Ecosystem Intelligence
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 40,
            fontSize: 22,
            color: HW_COLORS.green,
          }}
        >
          <span>{count} Projects</span>
          <span style={{ color: HW_COLORS.muted }}>·</span>
          <span>HyperCore</span>
          <span style={{ color: HW_COLORS.muted }}>·</span>
          <span>HyperEVM</span>
          <span style={{ color: HW_COLORS.muted }}>·</span>
          <span>HIP-3</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
