import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { slug } = await params;
  const body = await req.json();

  const allowedFields = [
    "name", "tagline", "description", "website", "twitter", "github",
    "discord", "telegram", "logoUrl", "layer", "category", "tags",
    "status", "launchYear", "launchDate", "isVerified", "isFeatured",
    "isHip3", "approvalStatus",
  ];

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      data[field] = body[field];
    }
  }

  try {
    const project = await prisma.project.update({
      where: { slug },
      data,
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
