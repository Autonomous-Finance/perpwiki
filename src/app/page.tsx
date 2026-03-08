import { prisma } from "@/lib/prisma";
import { LAYER_META } from "@/lib/categories";
import { SearchBar } from "@/components/SearchBar";
import { ProjectCard } from "@/components/ProjectCard";
import Link from "next/link";

async function getStats() {
  const total = await prisma.project.count({ where: { approvalStatus: "APPROVED" } });
  const hypercore = await prisma.project.count({
    where: { approvalStatus: "APPROVED", layer: { in: ["HYPERCORE", "BOTH"] } },
  });
  const hyperevm = await prisma.project.count({
    where: { approvalStatus: "APPROVED", layer: { in: ["HYPEREVM", "BOTH"] } },
  });
  const hip3 = await prisma.project.count({
    where: { approvalStatus: "APPROVED", layer: "HIP3" },
  });
  return { total, hypercore, hyperevm, hip3 };
}

async function getLayerProjects(layer: string, limit = 3) {
  const where =
    layer === "BOTH"
      ? { approvalStatus: "APPROVED" as const }
      : {
          approvalStatus: "APPROVED" as const,
          OR: [{ layer }, { layer: "BOTH" }],
        };
  return prisma.project.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
    take: limit,
  });
}

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
    take: 9,
  });
}

async function getCategoryCounts() {
  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { category: true, layer: true },
  });

  const counts: Record<string, number> = {};
  for (const p of projects) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }
  return counts;
}

export default async function HomePage() {
  const [stats, featured, coreProjects, evmProjects, hip3Projects, categoryCounts] =
    await Promise.all([
      getStats(),
      getFeaturedProjects(),
      getLayerProjects("HYPERCORE"),
      getLayerProjects("HYPEREVM"),
      getLayerProjects("HIP3"),
      getCategoryCounts(),
    ]);

  const layerSections = [
    {
      key: "HYPERCORE",
      label: "HyperCore",
      projects: coreProjects,
      count: stats.hypercore,
      href: "/layer/hypercore",
    },
    {
      key: "HYPEREVM",
      label: "HyperEVM",
      projects: evmProjects,
      count: stats.hyperevm,
      href: "/layer/hyperevm",
    },
    {
      key: "HIP3",
      label: "HIP-3",
      projects: hip3Projects,
      count: stats.hip3,
      href: "/layer/hip3",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--hw-border)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(75,142,244,0.04) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:py-24">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight text-[var(--hw-text)] md:text-6xl">
            The Hyperliquid Ecosystem
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-[var(--hw-text-muted)]">
            Every project. Every layer. One place.
          </p>

          {/* Stats bar */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-6 md:gap-10">
            <StatItem label="Projects" value={stats.total} />
            <StatItem label="HyperCore" value={stats.hypercore} color="var(--hw-tier-core)" />
            <StatItem label="HyperEVM" value={stats.hyperevm} color="var(--hw-tier-evm)" />
            <StatItem label="HIP-3" value={stats.hip3} color="var(--hw-tier-hip3)" />
          </div>

          {/* Search */}
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Layer Navigator */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-6">
          Explore by Layer
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {layerSections.map((section) => {
            const meta = LAYER_META[section.key];
            return (
              <div
                key={section.key}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-border-bright)]"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: meta.color }}
                    />
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)]">
                      {section.label}
                    </h3>
                  </div>
                  <span
                    className="font-[family-name:var(--font-jetbrains-mono)] text-sm"
                    style={{ color: meta.color }}
                  >
                    {section.count}
                  </span>
                </div>
                <p className="text-xs text-[var(--hw-text-dim)] mb-4">
                  {meta.description}
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  {section.projects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="flex items-center justify-between py-1 text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-text)] transition-colors"
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-[var(--hw-text-dim)]">{p.category}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={section.href}
                  className="text-sm font-medium transition-colors hover:text-[var(--hw-text)]"
                  style={{ color: meta.color }}
                >
                  Explore &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)]">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm text-[var(--hw-blue)] hover:text-[var(--hw-blue-dim)]"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
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
      </section>

      {/* Category Browse */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-6">
          Browse by Category
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => (
              <Link
                key={category}
                href={`/projects?category=${encodeURIComponent(category)}`}
                className="flex items-center justify-between border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 text-sm text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text)]"
                style={{ borderRadius: "2px" }}
              >
                <span>{category}</span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--hw-text-dim)]">
                  {count}
                </span>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="text-center">
      <div
        className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold"
        style={{ color: color || "var(--hw-text)" }}
      >
        {value}
      </div>
      <div className="text-xs text-[var(--hw-text-dim)]">{label}</div>
    </div>
  );
}
