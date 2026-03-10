import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const VALID_FIELDS = [
  "Description",
  "Website",
  "Twitter",
  "GitHub",
  "Discord",
  "Telegram",
  "Tags",
  "Category",
  "Status",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, field, value, reason } = body;

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json(
        { error: "projectId is required." },
        { status: 400 }
      );
    }

    if (!field || !VALID_FIELDS.includes(field)) {
      return NextResponse.json(
        { error: "Invalid field. Must be one of: " + VALID_FIELDS.join(", ") },
        { status: 400 }
      );
    }

    if (!value || typeof value !== "string" || !value.trim()) {
      return NextResponse.json(
        { error: "A suggested value is required." },
        { status: 400 }
      );
    }

    if (value.length > 2000) {
      return NextResponse.json(
        { error: "Value too long (max 2000 characters)." },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    await prisma.suggestion.create({
      data: {
        projectId,
        field,
        value: value.trim(),
        type: reason ? reason.trim().slice(0, 500) : null,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Suggestion submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
