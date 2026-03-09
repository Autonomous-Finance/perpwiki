import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: Props) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Review ID is required." },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true, isPublished: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    if (!review.isPublished) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { helpfulCount: { increment: 1 } },
      select: { helpfulCount: true },
    });

    return NextResponse.json({ helpfulCount: updated.helpfulCount });
  } catch (error) {
    console.error("Helpful vote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
