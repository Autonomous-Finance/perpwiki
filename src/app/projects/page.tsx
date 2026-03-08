import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/ProjectCard";
import { SearchBar } from "@/components/SearchBar";
import { LAYER_META, CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Projects",
  description:
    "Browse every project in the Hyperliquid ecosystem — HyperCore, HyperEVM, and HIP-3.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; layer?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const layer = params.layer || "";
  const category = params.category || "";

  const where: Record<string, unknown> = { approvalStatus: "APPROVED" };

  if (layer) {
    if (layer === "BOTH") {
      // show all
    } else {
      where.OR = [{ layer }, { layer: "BOTH" }];
    }
  }
  if (category) {
    where.category = category;
  }
  if (q) {
    where.AND = [
      {
        OR: [
          { name: { contains: q } },
          { tagline: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      },
    ];
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
  });

  const layers = ["HYPERCORE", "HYPEREVM", "HIP3"];
  const activeCategories = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { category: true },
    distinct: ["category"],
  });
  const usedCategories = activeCategories.map((c) => c.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] mb-6">
        All Projects
      </h1>

      <div className="mb-8">
        <SearchBar defaultValue={q} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill href="/projects" active={!layer && !category} label="All" />
        {layers.map((l) => (
          <FilterPill
            key={l}
            href={`/projects?layer=${l}`}
            active={layer === l}
            label={LAYER_META[l].label}
            color={LAYER_META[l].color}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {usedCategories
          .filter((c) => CATEGORIES.includes(c as (typeof CATEGORIES)[number]))
          .sort()
          .map((c) => (
            <FilterPill
              key={c}
              href={`/projects?category=${encodeURIComponent(c)}`}
              active={category === c}
              label={c}
            />
          ))}
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-[var(--hw-text-dim)]">
        {projects.length} project{projects.length !== 1 ? "s" : ""}
        {q && ` matching "${q}"`}
        {layer && ` on ${LAYER_META[layer]?.label || layer}`}
        {category && ` in ${category}`}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            slug={project.slug}
            name={project.name}
            tagline={project.tagline}
            layer={project.layer}
            category={project.category}
            status={project.status}
            isVerified={project.isVerified}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="py-16 text-center text-[var(--hw-text-dim)]">
          No projects found. Try a different search or filter.
        </div>
      )}
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
  color,
}: {
  href: string;
  active: boolean;
  label: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-1 text-xs border transition-all"
      style={{
        borderRadius: "2px",
        borderColor: active ? (color || "var(--hw-blue)") : "var(--hw-border)",
        background: active ? "var(--hw-blue-subtle)" : "transparent",
        color: active ? (color || "var(--hw-blue)") : "var(--hw-text-muted)",
      }}
    >
      {label}
    </Link>
  );
}
