import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitToIndexNow } from "@/lib/indexnow";
import { LEARN_ARTICLES } from "@/lib/learn-articles";

const SITE_URL = "https://perp.wiki";
const API_KEY = process.env.ADMIN_API_KEY;

export async function POST(req: Request) {
  const key = req.headers.get("x-api-key");
  if (key !== API_KEY) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { slug: true },
  });

  const urls = [
    SITE_URL,
    `${SITE_URL}/projects`,
    `${SITE_URL}/categories`,
    `${SITE_URL}/learn`,
    `${SITE_URL}/markets`,
    `${SITE_URL}/stats`,
    `${SITE_URL}/funding-rates`,
    `${SITE_URL}/compare`,
    `${SITE_URL}/tools`,
    `${SITE_URL}/glossary`,
    ...projects.map(p => `${SITE_URL}/projects/${p.slug}`),
    ...projects.map(p => `${SITE_URL}/ecosystem/${p.slug}`),
    ...LEARN_ARTICLES.map(a => `${SITE_URL}/learn/${a.slug}`),
  ];

  await submitToIndexNow(urls);
  return NextResponse.json({ submitted: urls.length });
}
