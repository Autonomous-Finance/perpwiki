import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const reviews = await prisma.review.findMany({
    where: { isPublished: false },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { name: true, slug: true } } },
  });

  return NextResponse.json(reviews);
}
