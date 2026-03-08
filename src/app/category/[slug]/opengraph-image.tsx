import { ImageResponse } from "@vercel/og";
import { OG_SIZE, HW_COLORS } from "@/lib/og-utils";
import { prisma } from "@/lib/prisma";
import { categoryToSlug, CATEGORIES } from "@/lib/categories";

export const runtime = "nodejs";
export const revalidate = 86400;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => categoryToSlug(c) === slug) || slug;

  const count = await prisma.project.count({
    where: { approvalStatus: "APPROVED", category },
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
              fontSize: 52,
              fontWeight: 700,
              color: HW_COLORS.text,
              lineHeight: 1.2,
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: HW_COLORS.muted,
              marginTop: 16,
            }}
          >
            {count} projects on Hyperliquid
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
          <span style={{ color: HW_COLORS.blue }}>.WIKI</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
