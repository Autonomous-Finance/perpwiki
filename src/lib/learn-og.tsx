import { ImageResponse } from "@vercel/og";
import { OG_SIZE, HW_COLORS } from "@/lib/og-utils";

export function createLearnOGImage(title: string, category: string) {
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
              padding: "6px 16px",
              fontSize: 16,
              color: HW_COLORS.blue,
              border: `1px solid ${HW_COLORS.blue}`,
              borderRadius: 2,
              marginBottom: 24,
              alignSelf: "flex-start",
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 700,
              color: HW_COLORS.text,
              lineHeight: 1.2,
            }}
          >
            {title}
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
          <span style={{ marginLeft: 8 }}> · Learn</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
