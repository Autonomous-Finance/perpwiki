import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripLogoUrls } from "@/lib/strip-logo";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "2"));
  const layer = searchParams.get("layer") || undefined;
  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;
  const sort = searchParams.get("sort") || "name";

  const where: Record<string, unknown> = { approvalStatus: "APPROVED" };
  if (layer) {
    where.OR = [{ layer }, { layer: "BOTH" }];
  }
  if (category) where.category = category;
  if (q) {
    const qFilter = [
      { name: { contains: q } },
      { tagline: { contains: q } },
      { tags: { contains: q } },
    ];
    if (layer) {
      where.AND = [
        { OR: [{ layer }, { layer: "BOTH" }] },
        { OR: qFilter },
      ];
      delete where.OR;
    } else {
      where.OR = qFilter;
    }
  }

  const orderBy =
    sort === "newest"
      ? [{ createdAt: "desc" as const }]
      : sort === "category"
        ? [{ category: "asc" as const }, { name: "asc" as const }]
        : [{ isFeatured: "desc" as const }, { isVerified: "desc" as const }, { name: "asc" as const }];

  const projects = stripLogoUrls(
    await prisma.project.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        slug: true,
        name: true,
        tagline: true,
        category: true,
        layer: true,
        status: true,
        logoUrl: true,
        isVerified: true,
        tags: true,
      },
    })
  );

  return NextResponse.json({ projects, hasMore: projects.length === PAGE_SIZE });
}
