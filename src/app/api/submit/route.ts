import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, website, twitter, category, layer, description, email } = body;

    // Validate required fields and lengths
    if (!name?.trim() || !website?.trim() || !category?.trim() || !layer?.trim()) {
      return NextResponse.json(
        { error: "Name, website, category, and layer are required." },
        { status: 400 }
      );
    }

    if (name.trim().length > 100 || (description && description.length > 5000)) {
      return NextResponse.json(
        { error: "Field too long." },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      const url = website.trim();
      new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json(
        { error: "Invalid website URL." },
        { status: 400 }
      );
    }

    // Store as a suggestion with type "submission"
    await prisma.suggestion.create({
      data: {
        type: "submission",
        field: "new-project",
        value: JSON.stringify({
          name: name.trim(),
          website: website.trim(),
          twitter: twitter?.trim() || null,
          category: category.trim(),
          layer: layer.trim(),
          description: description?.trim() || null,
          email: email?.trim() || null,
          submittedAt: new Date().toISOString(),
        }),
        status: "pending",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
