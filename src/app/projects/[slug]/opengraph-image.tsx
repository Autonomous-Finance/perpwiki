import { ImageResponse } from "@vercel/og";
import { OG_SIZE, HW_COLORS } from "@/lib/og-utils";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 86400;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  const name = project ? project.name : slug;
  const tagline = project ? project.tagline : null;
  const category = project ? project.category : "";
  const layer = project ? project.layer : "";

  const layerColor =
    layer === "HYPERCORE"
      ? HW_COLORS.tierCore
      : layer === "HYPEREVM"
        ? HW_COLORS.tierEvm
        : layer === "HIP3"
          ? HW_COLORS.tierHip3
          : HW_COLORS.blue;

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
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                padding: "6px 16px",
                fontSize: 16,
                color: layerColor,
                border: `1px solid ${layerColor}`,
                borderRadius: 2,
              }}
            >
              {layer}
            </div>
            <div
              style={{
                display: "flex",
                padding: "6px 16px",
                fontSize: 16,
                color: HW_COLORS.muted,
                border: `1px solid ${HW_COLORS.border}`,
                borderRadius: 2,
              }}
            >
              {category}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 700,
              color: HW_COLORS.text,
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
          {tagline ? (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: HW_COLORS.muted,
                marginTop: 16,
                lineHeight: 1.4,
              }}
            >
              {tagline}
            </div>
          ) : null}
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
