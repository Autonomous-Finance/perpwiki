import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { logoUrl: true },
  });

  if (!project?.logoUrl) {
    return new NextResponse(null, { status: 404 });
  }

  const match = project.logoUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    const mimeType = match[1];
    const buffer = Buffer.from(match[2], "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  }

  return NextResponse.redirect(project.logoUrl, { status: 302 });
}
