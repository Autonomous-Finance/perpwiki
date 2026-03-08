import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const [totalProjects, pendingProjects, totalReviews, totalSuggestions] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { approvalStatus: "PENDING" } }),
      prisma.review.count(),
      prisma.suggestion.count({ where: { status: "pending" } }),
    ]);

  return NextResponse.json({
    totalProjects,
    pendingProjects,
    totalReviews,
    totalSuggestions,
  });
}
