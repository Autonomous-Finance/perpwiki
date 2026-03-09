import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "approve") {
      const review = await prisma.review.update({
        where: { id },
        data: { isPublished: true },
      });
      return NextResponse.json(review);
    }

    if (action === "reject") {
      await prisma.review.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Action must be 'approve' or 'reject'." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
