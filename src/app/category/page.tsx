import { prisma } from "@/lib/prisma";
import { categoryToSlug } from "@/lib/categories";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse all project categories in the Hyperliquid ecosystem — DeFi, trading, analytics, and more.",
};

export default async function CategoriesPage() {
  const raw = await prisma.project.groupBy({
    by: ["category"],
    where: { approvalStatus: "APPROVED" },
    _count: true,
    orderBy: { _count: { category: "desc" } },
  });

  const categories = raw.map((c) => ({
    name: c.category,
    slug: categoryToSlug(c.category),
    count: c._count,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-2 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Categories</span>
      </div>

      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] mb-8">
        Categories
      </h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex items-center justify-between border border-[var(--hw-border)] bg-[var(--hw-surface)] px-5 py-4 transition-all hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text)]"
            style={{ borderRadius: "4px" }}
          >
            <span className="text-sm text-[var(--hw-text-muted)]">{cat.name}</span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-dim)]">
              {cat.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
