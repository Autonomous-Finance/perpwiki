import { ImageResponse } from "@vercel/og";
import { OG_SIZE, HW_COLORS } from "@/lib/og-utils";
import { prisma } from "@/lib/prisma";
import { LAYER_META } from "@/lib/categories";

export const runtime = "nodejs";
export const revalidate = 86400;
export const size = OG_SIZE;
export const contentType = "image/png";

const LAYER_SLUGS: Record<string, string> = {
  hypercore: "HYPERCORE",
  hyperevm: "HYPEREVM",
  hip3: "HIP3",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const layer = LAYER_SLUGS[slug] || "HYPERCORE";
  const meta = LAYER_META[layer];

  const count = await prisma.project.count({
    where: { approvalStatus: "APPROVED", OR: [{ layer }, { layer: "BOTH" }] },
  });

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
              color: meta.color,
              lineHeight: 1.1,
            }}
          >
            {meta.label}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: HW_COLORS.muted,
              marginTop: 16,
            }}
          >
            {meta.description}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 600,
              color: HW_COLORS.text,
              marginTop: 40,
            }}
          >
            {count} Projects
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
          <span style={{ color: HW_COLORS.text }}>PERP</span>
          <span style={{ color: HW_COLORS.green }}>.WIKI</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
