import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

async function handleAction(
  req: NextRequest,
  id: string,
  status: string
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const suggestion = await prisma.suggestion.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(suggestion);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);

  if (url.pathname.endsWith("/approve")) {
    return handleAction(req, id, "approved");
  }
  if (url.pathname.endsWith("/reject")) {
    return handleAction(req, id, "rejected");
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
