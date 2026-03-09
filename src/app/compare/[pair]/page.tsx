import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LayerBadge } from "@/components/LayerBadge";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ pair: string }>;
}

function parsePair(pair: string): [string, string] | null {
  const idx = pair.indexOf("-vs-");
  if (idx === -1) return null;
  return [pair.slice(0, idx), pair.slice(idx + 4)];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const slugs = parsePair(pair);
  if (!slugs) return { title: "Not Found" };

  const [a, b] = await Promise.all([
    prisma.project.findUnique({ where: { slug: slugs[0] }, select: { name: true } }),
    prisma.project.findUnique({ where: { slug: slugs[1] }, select: { name: true } }),
  ]);

  if (!a || !b) return { title: "Not Found" };

  return {
    title: `${a.name} vs ${b.name} — Hyperliquid Ecosystem Comparison | perp.wiki`,
    description: `Compare ${a.name} and ${b.name} in the Hyperliquid ecosystem. Features, layer, and use case comparison on perp.wiki.`,
    alternates: {
      canonical: `https://perp.wiki/compare/${slugs[0]}-vs-${slugs[1]}`,
    },
  };
}

export default async function ComparePage({ params }: Props) {
  const { pair } = await params;
  const slugs = parsePair(pair);
  if (!slugs) notFound();

  const [projectA, projectB] = await Promise.all([
    prisma.project.findUnique({ where: { slug: slugs[0] } }),
    prisma.project.findUnique({ where: { slug: slugs[1] } }),
  ]);

  if (!projectA || !projectB) notFound();

  const fields: { label: string; key: string }[] = [
    { label: "Layer", key: "layer" },
    { label: "Category", key: "category" },
    { label: "Status", key: "status" },
    { label: "Launch Year", key: "launchYear" },
    { label: "Website", key: "website" },
    { label: "Twitter", key: "twitter" },
    { label: "GitHub", key: "github" },
    { label: "Verified", key: "isVerified" },
    { label: "Featured", key: "isFeatured" },
  ];

  function getValue(project: typeof projectA, key: string): string {
    const val = (project as Record<string, unknown>)[key];
    if (val === null || val === undefined) return "—";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    return String(val);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `${projectA.name} vs ${projectB.name} — Hyperliquid Ecosystem Comparison`,
            "description": `Compare ${projectA.name} and ${projectB.name} on Hyperliquid. Side-by-side analysis of features, layer, category, and ecosystem role.`,
            "url": `https://perp.wiki/compare/${projectA.slug}-vs-${projectB.slug}`,
            "numberOfItems": 2,
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": projectA.name,
                "url": `https://perp.wiki/projects/${projectA.slug}`,
                "description": projectA.tagline || projectA.description || "",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": projectB.name,
                "url": `https://perp.wiki/projects/${projectB.slug}`,
                "description": projectB.tagline || projectB.description || "",
              },
            ],
          }),
        }}
      />
      <div className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Compare</span>
      </div>

      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] mb-8">
        {projectA.name} <span className="text-[var(--hw-text-dim)]">vs</span> {projectB.name}
      </h1>

      {/* Side-by-side cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-10">
        <ProjectSummary project={projectA} />
        <ProjectSummary project={projectB} />
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 text-left text-[var(--hw-text-dim)] font-medium w-1/4">
                Field
              </th>
              <th className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 text-left text-[var(--hw-text)] font-medium w-[37.5%]">
                {projectA.name}
              </th>
              <th className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 text-left text-[var(--hw-text)] font-medium w-[37.5%]">
                {projectB.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.key}>
                <td className="border border-[var(--hw-border)] px-4 py-2 text-[var(--hw-text-dim)]">
                  {field.label}
                </td>
                <td className="border border-[var(--hw-border)] px-4 py-2 text-[var(--hw-text-muted)] font-[family-name:var(--font-jetbrains-mono)] text-xs">
                  {getValue(projectA, field.key)}
                </td>
                <td className="border border-[var(--hw-border)] px-4 py-2 text-[var(--hw-text-muted)] font-[family-name:var(--font-jetbrains-mono)] text-xs">
                  {getValue(projectB, field.key)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-[var(--hw-border)] px-4 py-2 text-[var(--hw-text-dim)]">
                Tags
              </td>
              <td className="border border-[var(--hw-border)] px-4 py-2 text-[var(--hw-text-muted)] text-xs">
                {(() => { try { return JSON.parse(projectA.tags).join(", "); } catch { return "—"; } })()}
              </td>
              <td className="border border-[var(--hw-border)] px-4 py-2 text-[var(--hw-text-muted)] text-xs">
                {(() => { try { return JSON.parse(projectB.tags).join(", "); } catch { return "—"; } })()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Links back */}
      <div className="flex gap-4 mt-8">
        <Link
          href={`/projects/${projectA.slug}`}
          className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
        >
          View {projectA.name} &rarr;
        </Link>
        <Link
          href={`/projects/${projectB.slug}`}
          className="text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
        >
          View {projectB.name} &rarr;
        </Link>
      </div>
    </div>
  );
}

function ProjectSummary({ project }: { project: { name: string; slug: string; tagline: string | null; layer: string; category: string } }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-border-bright)]"
        style={{ borderRadius: "4px" }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)]">
            {project.name}
          </h2>
          <LayerBadge layer={project.layer} />
        </div>
        {project.tagline ? (
          <p className="text-sm text-[var(--hw-text-muted)] line-clamp-2">{project.tagline}</p>
        ) : null}
        <div className="mt-3">
          <span
            className="bg-[var(--hw-green-subtle)] px-1.5 py-0.5 text-xs text-[var(--hw-text-muted)]"
            style={{ borderRadius: "2px" }}
          >
            {project.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
