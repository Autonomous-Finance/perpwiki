import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status === "pending") {
    where.approvalStatus = "PENDING";
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}
