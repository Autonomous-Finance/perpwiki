import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LayerBadge } from "@/components/LayerBadge";
import { ProjectLogo } from "@/components/ProjectLogo";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LAYER_META, categoryToSlug } from "@/lib/categories";
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

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
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

  const title = `${a.name} vs ${b.name} — Hyperliquid Ecosystem Comparison`;
  const description = `Compare ${a.name} and ${b.name} in the Hyperliquid ecosystem. Features, layer, and use case comparison on perp.wiki.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://perp.wiki/compare/${slugs[0]}-vs-${slugs[1]}`,
    },
    openGraph: {
      title,
      description,
      url: `https://perp.wiki/compare/${slugs[0]}-vs-${slugs[1]}`,
      siteName: "perp.wiki",
      images: [{ url: `/compare/${slugs[0]}-vs-${slugs[1]}/opengraph-image`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      site: "@perpwiki",
      title,
      description,
      images: [`/compare/${slugs[0]}-vs-${slugs[1]}/opengraph-image`],
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

  const tagsA = parseTags(projectA.tags);
  const tagsB = parseTags(projectB.tags);
  const sharedTags = tagsA.filter((t) => tagsB.includes(t));
  const uniqueTagsA = tagsA.filter((t) => !tagsB.includes(t));
  const uniqueTagsB = tagsB.filter((t) => !tagsA.includes(t));

  const sameCategory = projectA.category === projectB.category;
  const sameLayer = projectA.layer === projectB.layer;

  // Fetch related comparisons: other projects in the same category
  const relatedProjects = await prisma.project.findMany({
    where: {
      approvalStatus: "APPROVED",
      category: projectA.category,
      slug: { notIn: [projectA.slug, projectB.slug] },
    },
    select: { slug: true, name: true },
    take: 6,
    orderBy: { name: "asc" },
  });

  // Build related pairs
  const relatedPairs: { slugA: string; slugB: string; nameA: string; nameB: string }[] = [];
  for (const rp of relatedProjects) {
    if (relatedPairs.length >= 4) break;
    relatedPairs.push({
      slugA: projectA.slug,
      slugB: rp.slug,
      nameA: projectA.name,
      nameB: rp.name,
    });
  }
  for (const rp of relatedProjects) {
    if (relatedPairs.length >= 4) break;
    if (relatedPairs.some((p) => p.slugB === rp.slug)) continue;
    relatedPairs.push({
      slugA: projectB.slug,
      slugB: rp.slug,
      nameA: projectB.name,
      nameB: rp.name,
    });
  }

  const layerMetaA = LAYER_META[projectA.layer] || LAYER_META.BOTH;
  const layerMetaB = LAYER_META[projectB.layer] || LAYER_META.BOTH;

  const comparisonRows: { label: string; valA: React.ReactNode; valB: React.ReactNode }[] = [
    {
      label: "Layer",
      valA: <LayerBadge layer={projectA.layer} />,
      valB: <LayerBadge layer={projectB.layer} />,
    },
    {
      label: "Category",
      valA: (
        <Link href={`/category/${categoryToSlug(projectA.category)}`} className="text-[var(--hw-green)] hover:underline">
          {projectA.category}
        </Link>
      ),
      valB: (
        <Link href={`/category/${categoryToSlug(projectB.category)}`} className="text-[var(--hw-green)] hover:underline">
          {projectB.category}
        </Link>
      ),
    },
    { label: "Status", valA: <StatusPill status={projectA.status} />, valB: <StatusPill status={projectB.status} /> },
    {
      label: "Launch Year",
      valA: <span className="font-[family-name:var(--font-jetbrains-mono)]">{projectA.launchYear ?? "\u2014"}</span>,
      valB: <span className="font-[family-name:var(--font-jetbrains-mono)]">{projectB.launchYear ?? "\u2014"}</span>,
    },
    {
      label: "Website",
      valA: projectA.website ? (
        <a href={projectA.website} target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline inline-flex items-center gap-1">
          {new URL(projectA.website).hostname.replace("www.", "")}
          <ExternalLinkIcon />
        </a>
      ) : <span className="text-[var(--hw-text-dim)]">{"\u2014"}</span>,
      valB: projectB.website ? (
        <a href={projectB.website} target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline inline-flex items-center gap-1">
          {new URL(projectB.website).hostname.replace("www.", "")}
          <ExternalLinkIcon />
        </a>
      ) : <span className="text-[var(--hw-text-dim)]">{"\u2014"}</span>,
    },
    {
      label: "Twitter",
      valA: projectA.twitter ? (
        <a href={projectA.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline inline-flex items-center gap-1">
          @{projectA.twitter.split("/").pop()}
          <ExternalLinkIcon />
        </a>
      ) : <span className="text-[var(--hw-text-dim)]">{"\u2014"}</span>,
      valB: projectB.twitter ? (
        <a href={projectB.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline inline-flex items-center gap-1">
          @{projectB.twitter.split("/").pop()}
          <ExternalLinkIcon />
        </a>
      ) : <span className="text-[var(--hw-text-dim)]">{"\u2014"}</span>,
    },
    {
      label: "GitHub",
      valA: projectA.github ? (
        <a href={projectA.github} target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline inline-flex items-center gap-1">
          Open Source <ExternalLinkIcon />
        </a>
      ) : <span className="text-[var(--hw-text-dim)]">Not public</span>,
      valB: projectB.github ? (
        <a href={projectB.github} target="_blank" rel="noopener noreferrer" className="text-[var(--hw-green)] hover:underline inline-flex items-center gap-1">
          Open Source <ExternalLinkIcon />
        </a>
      ) : <span className="text-[var(--hw-text-dim)]">Not public</span>,
    },
    {
      label: "Verified",
      valA: projectA.isVerified ? <span className="text-[var(--hw-green)]">&#10003; Verified</span> : <span className="text-[var(--hw-text-dim)]">Unverified</span>,
      valB: projectB.isVerified ? <span className="text-[var(--hw-green)]">&#10003; Verified</span> : <span className="text-[var(--hw-text-dim)]">Unverified</span>,
    },
  ];

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
      <BreadcrumbSchema
        items={[
          { name: "Compare", href: "https://perp.wiki/compare" },
          { name: `${projectA.name} vs ${projectB.name}`, href: `https://perp.wiki/compare/${projectA.slug}-vs-${projectB.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">Home</Link>
        {" / "}
        <Link href="/compare" className="hover:text-[var(--hw-text-muted)] transition-colors">Compare</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{projectA.name} vs {projectB.name}</span>
      </nav>

      {/* Title */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-2">
        {projectA.name} <span className="text-[var(--hw-text-dim)] text-2xl sm:text-3xl">vs</span> {projectB.name}
      </h1>
      <p className="text-sm text-[var(--hw-text-dim)] mb-3">
        Hyperliquid ecosystem comparison &middot; {projectA.category}
      </p>

      {/* Verdict Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sameCategory && sameLayer && (
          <span
            className="inline-block px-2.5 py-1 text-xs font-medium text-[var(--hw-green)] bg-[var(--hw-green-subtle)]"
            style={{ borderRadius: "9999px", border: "1px solid rgba(0,229,160,0.2)" }}
          >
            Direct Competitors
          </span>
        )}
        {sameCategory && !sameLayer && (
          <span
            className="inline-block px-2.5 py-1 text-xs font-medium text-[var(--hw-cyan)]"
            style={{ borderRadius: "9999px", background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.2)" }}
          >
            Cross-Layer Alternatives
          </span>
        )}
        {!sameCategory && (
          <span
            className="inline-block px-2.5 py-1 text-xs font-medium text-[var(--hw-gold)]"
            style={{ borderRadius: "9999px", background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.2)" }}
          >
            Different Focus Areas
          </span>
        )}
        {projectA.github && !projectB.github && (
          <span
            className="inline-block px-2.5 py-1 text-xs font-medium text-[var(--hw-text-muted)]"
            style={{ borderRadius: "9999px", background: "var(--hw-surface-raised)", border: "1px solid var(--hw-border)" }}
          >
            Open Source Edge: {projectA.name}
          </span>
        )}
        {!projectA.github && projectB.github && (
          <span
            className="inline-block px-2.5 py-1 text-xs font-medium text-[var(--hw-text-muted)]"
            style={{ borderRadius: "9999px", background: "var(--hw-surface-raised)", border: "1px solid var(--hw-border)" }}
          >
            Open Source Edge: {projectB.name}
          </span>
        )}
        {projectA.isVerified && !projectB.isVerified && (
          <span
            className="inline-block px-2.5 py-1 text-xs font-medium text-[var(--hw-green)]"
            style={{ borderRadius: "9999px", background: "var(--hw-green-subtle)", border: "1px solid rgba(0,229,160,0.2)" }}
          >
            Verified: {projectA.name}
          </span>
        )}
        {!projectA.isVerified && projectB.isVerified && (
          <span
            className="inline-block px-2.5 py-1 text-xs font-medium text-[var(--hw-green)]"
            style={{ borderRadius: "9999px", background: "var(--hw-green-subtle)", border: "1px solid rgba(0,229,160,0.2)" }}
          >
            Verified: {projectB.name}
          </span>
        )}
      </div>

      {/* Quick Take */}
      <div
        className="border border-[var(--hw-border-bright)] bg-[var(--hw-surface)] p-5 mb-8"
        style={{
          borderRadius: "4px",
          borderLeft: "3px solid var(--hw-green)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-[var(--hw-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-green)] uppercase tracking-wider">
            Quick Take
          </h2>
        </div>
        <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
          <strong className="text-[var(--hw-text)]">{projectA.name}</strong>
          {projectA.tagline ? ` ${projectA.tagline.toLowerCase().endsWith(".") ? projectA.tagline.slice(0, -1) : projectA.tagline}` : ` is a ${projectA.category.toLowerCase()} protocol`}
          {" "}on {layerMetaA.label}, while{" "}
          <strong className="text-[var(--hw-text)]">{projectB.name}</strong>
          {projectB.tagline ? ` ${projectB.tagline.toLowerCase().endsWith(".") ? projectB.tagline.slice(0, -1) : projectB.tagline}` : ` is a ${projectB.category.toLowerCase()} protocol`}
          {" "}on {layerMetaB.label}.
          {sameCategory && !sameLayer
            ? ` Both compete in the ${projectA.category.toLowerCase()} space but operate on different layers, which affects their capabilities and composability.`
            : sameCategory && sameLayer
              ? ` Both are ${projectA.category.toLowerCase()} protocols on ${layerMetaA.label}, making them direct competitors in the Hyperliquid ecosystem.`
              : ` They serve different niches in the Hyperliquid ecosystem.`}
        </p>
      </div>

      {/* CTA: Try Both */}
      {(projectA.website || projectB.website) && (
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          {projectA.website && (
            <a
              href={projectA.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[var(--hw-green)] text-[var(--hw-bg)] transition-opacity hover:opacity-90"
              style={{ borderRadius: "4px" }}
            >
              Try {projectA.name}
              <ExternalLinkIcon />
            </a>
          )}
          {projectB.website && (
            <a
              href={projectB.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[var(--hw-cyan)] text-[var(--hw-bg)] transition-opacity hover:opacity-90"
              style={{ borderRadius: "4px" }}
            >
              Try {projectB.name}
              <ExternalLinkIcon />
            </a>
          )}
        </div>
      )}

      {/* Side-by-side Project Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-10">
        <ProjectSummary project={projectA} />
        <ProjectSummary project={projectB} />
      </div>

      {/* Overview Section */}
      <section className="mb-10">
        <SectionHeading>Overview</SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
            style={{ borderRadius: "4px" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ProjectLogo name={projectA.name} logoUrl={projectA.logoUrl} size="sm" />
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)]">
                {projectA.name}
              </h3>
            </div>
            <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
              {projectA.description || projectA.tagline || `${projectA.name} is a ${projectA.category.toLowerCase()} protocol in the Hyperliquid ecosystem.`}
            </p>
            {projectA.website && (
              <a
                href={projectA.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs text-[var(--hw-green)] hover:underline"
              >
                Visit website <ExternalLinkIcon />
              </a>
            )}
          </div>
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
            style={{ borderRadius: "4px" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ProjectLogo name={projectB.name} logoUrl={projectB.logoUrl} size="sm" />
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)]">
                {projectB.name}
              </h3>
            </div>
            <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
              {projectB.description || projectB.tagline || `${projectB.name} is a ${projectB.category.toLowerCase()} protocol in the Hyperliquid ecosystem.`}
            </p>
            {projectB.website && (
              <a
                href={projectB.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs text-[var(--hw-green)] hover:underline"
              >
                Visit website <ExternalLinkIcon />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-10">
        <SectionHeading>Feature Comparison</SectionHeading>
        <div
          className="overflow-x-auto border border-[var(--hw-border)]"
          style={{ borderRadius: "4px" }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="bg-[var(--hw-surface-raised)] px-4 py-3 text-left text-xs text-[var(--hw-text-dim)] font-medium uppercase tracking-wider w-1/4 border-b border-[var(--hw-border)]">
                  Feature
                </th>
                <th className="bg-[var(--hw-surface-raised)] px-4 py-3 text-left text-[var(--hw-text)] font-semibold w-[37.5%] border-b border-[var(--hw-border)]">
                  <span className="flex items-center gap-2">
                    <ProjectLogo name={projectA.name} logoUrl={projectA.logoUrl} size="sm" />
                    {projectA.name}
                  </span>
                </th>
                <th className="bg-[var(--hw-surface-raised)] px-4 py-3 text-left text-[var(--hw-text)] font-semibold w-[37.5%] border-b border-[var(--hw-border)]">
                  <span className="flex items-center gap-2">
                    <ProjectLogo name={projectB.name} logoUrl={projectB.logoUrl} size="sm" />
                    {projectB.name}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-[var(--hw-surface)]" : ""}>
                  <td className="px-4 py-3 text-[var(--hw-text-dim)] font-medium text-xs border-b border-[var(--hw-border)]">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--hw-text-muted)] border-b border-[var(--hw-border)]">
                    {row.valA}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--hw-text-muted)] border-b border-[var(--hw-border)]">
                    {row.valB}
                  </td>
                </tr>
              ))}
              {/* Tags row */}
              <tr className={comparisonRows.length % 2 === 0 ? "bg-[var(--hw-surface)]" : ""}>
                <td className="px-4 py-3 text-[var(--hw-text-dim)] font-medium text-xs border-b border-[var(--hw-border)]">
                  Tags
                </td>
                <td className="px-4 py-3 border-b border-[var(--hw-border)]">
                  <div className="flex flex-wrap gap-1.5">
                    {tagsA.length > 0 ? tagsA.map((tag) => (
                      <TagPill key={tag} tag={tag} highlight={sharedTags.includes(tag)} />
                    )) : <span className="text-[var(--hw-text-dim)] text-xs">{"\u2014"}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-[var(--hw-border)]">
                  <div className="flex flex-wrap gap-1.5">
                    {tagsB.length > 0 ? tagsB.map((tag) => (
                      <TagPill key={tag} tag={tag} highlight={sharedTags.includes(tag)} />
                    )) : <span className="text-[var(--hw-text-dim)] text-xs">{"\u2014"}</span>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {sharedTags.length > 0 && (
          <p className="mt-2 text-xs text-[var(--hw-text-dim)]">
            <span className="inline-block h-2 w-2 rounded-full mr-1" style={{ background: "var(--hw-green)", opacity: 0.5 }} />
            Highlighted tags are shared by both projects
          </p>
        )}
      </section>

      {/* Feature Checklist */}
      <section className="mb-10">
        <SectionHeading>Feature Checklist</SectionHeading>
        <div
          className="overflow-x-auto border border-[var(--hw-border)]"
          style={{ borderRadius: "4px" }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="bg-[var(--hw-surface-raised)] px-4 py-3 text-left text-xs text-[var(--hw-text-dim)] font-medium uppercase tracking-wider w-1/3 border-b border-[var(--hw-border)]">
                  Feature
                </th>
                <th className="bg-[var(--hw-surface-raised)] px-4 py-3 text-center text-[var(--hw-text)] font-semibold w-1/3 border-b border-[var(--hw-border)]">
                  {projectA.name}
                </th>
                <th className="bg-[var(--hw-surface-raised)] px-4 py-3 text-center text-[var(--hw-text)] font-semibold w-1/3 border-b border-[var(--hw-border)]">
                  {projectB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Open Source", a: !!projectA.github, b: !!projectB.github },
                { label: "Verified", a: !!projectA.isVerified, b: !!projectB.isVerified },
                { label: "Has Twitter", a: !!projectA.twitter, b: !!projectB.twitter },
                { label: "Has Discord", a: !!projectA.discord, b: !!projectB.discord },
                { label: "Has Telegram", a: !!projectA.telegram, b: !!projectB.telegram },
              ].map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-[var(--hw-surface)]" : ""}>
                  <td className="px-4 py-2.5 text-[var(--hw-text-dim)] font-medium text-xs border-b border-[var(--hw-border)]">
                    {row.label}
                  </td>
                  <td className="px-4 py-2.5 text-center text-sm border-b border-[var(--hw-border)]">
                    {row.a
                      ? <span className="text-[var(--hw-green)]">&#10003;</span>
                      : <span className="text-[var(--hw-text-dim)]">&#10007;</span>}
                  </td>
                  <td className="px-4 py-2.5 text-center text-sm border-b border-[var(--hw-border)]">
                    {row.b
                      ? <span className="text-[var(--hw-green)]">&#10003;</span>
                      : <span className="text-[var(--hw-text-dim)]">&#10007;</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Differences */}
      <section className="mb-10">
        <SectionHeading>Key Differences</SectionHeading>
        <div
          className="border border-[var(--hw-border-bright)] p-5"
          style={{
            borderRadius: "4px",
            background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.02) 100%)",
          }}
        >
          <div className="space-y-4">
            {!sameLayer && (
              <DifferenceRow
                icon={<span className="text-[var(--hw-cyan)]">&#9671;</span>}
                title="Layer Architecture"
                description={`${projectA.name} operates on ${layerMetaA.label} (${layerMetaA.description.toLowerCase()}), while ${projectB.name} runs on ${layerMetaB.label} (${layerMetaB.description.toLowerCase()}). This affects composability, transaction speed, and the types of integrations each protocol supports.`}
              />
            )}
            {!sameCategory && (
              <DifferenceRow
                icon={<span className="text-[var(--hw-gold)]">&#9670;</span>}
                title="Category Focus"
                description={`${projectA.name} is focused on ${projectA.category.toLowerCase()}, while ${projectB.name} targets ${projectB.category.toLowerCase()}. They serve different user needs within the Hyperliquid ecosystem.`}
              />
            )}
            {uniqueTagsA.length > 0 && uniqueTagsB.length > 0 && (
              <DifferenceRow
                icon={<span className="text-[var(--hw-green)]">&#9672;</span>}
                title="Unique Features"
                description={`${projectA.name} is distinguished by: ${uniqueTagsA.join(", ")}. ${projectB.name} stands out with: ${uniqueTagsB.join(", ")}.`}
              />
            )}
            {projectA.launchYear && projectB.launchYear && projectA.launchYear !== projectB.launchYear && (
              <DifferenceRow
                icon={<span className="text-[var(--hw-text-muted)]">&#9202;</span>}
                title="Market Timing"
                description={`${projectA.launchYear < projectB.launchYear ? projectA.name : projectB.name} launched first in ${Math.min(projectA.launchYear, projectB.launchYear)}, giving it a head start. ${projectA.launchYear > projectB.launchYear ? projectA.name : projectB.name} entered later in ${Math.max(projectA.launchYear, projectB.launchYear)}, potentially with the benefit of learning from earlier entrants.`}
              />
            )}
            {projectA.github && !projectB.github && (
              <DifferenceRow
                icon={<span className="text-[var(--hw-text-muted)]">{"</>"}</span>}
                title="Open Source"
                description={`${projectA.name} has a public GitHub repository, enabling community auditing and contributions. ${projectB.name} does not have a public codebase.`}
              />
            )}
            {!projectA.github && projectB.github && (
              <DifferenceRow
                icon={<span className="text-[var(--hw-text-muted)]">{"</>"}</span>}
                title="Open Source"
                description={`${projectB.name} has a public GitHub repository, enabling community auditing and contributions. ${projectA.name} does not have a public codebase.`}
              />
            )}
            {sameLayer && sameCategory && uniqueTagsA.length === 0 && uniqueTagsB.length === 0 && (
              <DifferenceRow
                icon={<span className="text-[var(--hw-green)]">&#8776;</span>}
                title="Similar Profiles"
                description={`Both ${projectA.name} and ${projectB.name} are ${projectA.category.toLowerCase()} protocols on ${layerMetaA.label}. The key differentiators will be in their specific implementations, UX, liquidity depth, and community traction.`}
              />
            )}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-10">
        <SectionHeading>When to Use Each</SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
            style={{ borderRadius: "4px", borderTop: `2px solid var(--hw-green)` }}
          >
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)] mb-3">
              Choose {projectA.name} if you...
            </h3>
            <ul className="space-y-2 text-sm text-[var(--hw-text-muted)]">
              <li className="flex gap-2">
                <span className="text-[var(--hw-green)] shrink-0 mt-0.5">&#10003;</span>
                Want a {projectA.category.toLowerCase()} solution on {layerMetaA.label}
              </li>
              {projectA.isVerified && (
                <li className="flex gap-2">
                  <span className="text-[var(--hw-green)] shrink-0 mt-0.5">&#10003;</span>
                  Prefer a verified and vetted protocol
                </li>
              )}
              {projectA.github && (
                <li className="flex gap-2">
                  <span className="text-[var(--hw-green)] shrink-0 mt-0.5">&#10003;</span>
                  Value open-source transparency
                </li>
              )}
              {uniqueTagsA.length > 0 && (
                <li className="flex gap-2">
                  <span className="text-[var(--hw-green)] shrink-0 mt-0.5">&#10003;</span>
                  Need features like {uniqueTagsA.slice(0, 2).join(" and ")}
                </li>
              )}
              <li className="flex gap-2">
                <span className="text-[var(--hw-green)] shrink-0 mt-0.5">&#10003;</span>
                {projectA.tagline ? `Need: ${projectA.tagline}` : `Are looking for a dedicated ${projectA.category.toLowerCase()} protocol`}
              </li>
            </ul>
          </div>
          <div
            className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
            style={{ borderRadius: "4px", borderTop: `2px solid var(--hw-cyan)` }}
          >
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)] mb-3">
              Choose {projectB.name} if you...
            </h3>
            <ul className="space-y-2 text-sm text-[var(--hw-text-muted)]">
              <li className="flex gap-2">
                <span className="text-[var(--hw-cyan)] shrink-0 mt-0.5">&#10003;</span>
                Want a {projectB.category.toLowerCase()} solution on {layerMetaB.label}
              </li>
              {projectB.isVerified && (
                <li className="flex gap-2">
                  <span className="text-[var(--hw-cyan)] shrink-0 mt-0.5">&#10003;</span>
                  Prefer a verified and vetted protocol
                </li>
              )}
              {projectB.github && (
                <li className="flex gap-2">
                  <span className="text-[var(--hw-cyan)] shrink-0 mt-0.5">&#10003;</span>
                  Value open-source transparency
                </li>
              )}
              {uniqueTagsB.length > 0 && (
                <li className="flex gap-2">
                  <span className="text-[var(--hw-cyan)] shrink-0 mt-0.5">&#10003;</span>
                  Need features like {uniqueTagsB.slice(0, 2).join(" and ")}
                </li>
              )}
              <li className="flex gap-2">
                <span className="text-[var(--hw-cyan)] shrink-0 mt-0.5">&#10003;</span>
                {projectB.tagline ? `Need: ${projectB.tagline}` : `Are looking for a dedicated ${projectB.category.toLowerCase()} protocol`}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA: Compare More */}
      {relatedPairs.length > 0 && (
        <section className="mb-10">
          <SectionHeading>Compare More</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-3">
            {relatedPairs.slice(0, 3).map((rp) => (
              <Link
                key={`cta-${rp.slugA}-${rp.slugB}`}
                href={`/compare/${rp.slugA}-vs-${rp.slugB}`}
                className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-green)]"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center text-[8px] font-bold text-[var(--hw-bg)]"
                    style={{ borderRadius: "4px", background: "var(--hw-green)" }}
                  >
                    {rp.nameA.charAt(0)}
                  </span>
                  <span className="text-[10px] text-[var(--hw-text-dim)]">vs</span>
                  <span
                    className="flex h-5 w-5 items-center justify-center text-[8px] font-bold text-[var(--hw-bg)]"
                    style={{ borderRadius: "4px", background: "var(--hw-cyan)" }}
                  >
                    {rp.nameB.charAt(0)}
                  </span>
                </div>
                <p className="text-sm text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors font-medium">
                  {rp.nameA} vs {rp.nameB}
                </p>
                <p className="text-xs text-[var(--hw-text-dim)] mt-1">View comparison &rarr;</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ecosystem Integration */}
      <section className="mb-10">
        <SectionHeading>Ecosystem Integration</SectionHeading>
        <div
          className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
          style={{ borderRadius: "4px" }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ProjectLogo name={projectA.name} logoUrl={projectA.logoUrl} size="sm" />
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
                  {projectA.name}
                </h3>
              </div>
              <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed mb-3">
                {projectA.name} operates on <strong className="text-[var(--hw-text)]">{layerMetaA.label}</strong> ({layerMetaA.description.toLowerCase()}).
                {projectA.layer === "HYPEREVM"
                  ? " As a HyperEVM protocol, it can compose with other EVM-based DeFi primitives and leverage smart contract flexibility."
                  : projectA.layer === "HYPERCORE"
                    ? " Running on HyperCore gives it direct access to the native orderbook with minimal latency and maximum throughput."
                    : projectA.layer === "HIP3"
                      ? " Through HIP-3, it enables permissionless creation of custom perpetual markets."
                      : " Spanning multiple layers lets it combine the strengths of each, though integration complexity is higher."}
              </p>
              {sharedTags.length > 0 && (
                <p className="text-xs text-[var(--hw-text-dim)]">
                  Shared ecosystem tags: {sharedTags.join(", ")}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ProjectLogo name={projectB.name} logoUrl={projectB.logoUrl} size="sm" />
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
                  {projectB.name}
                </h3>
              </div>
              <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed mb-3">
                {projectB.name} operates on <strong className="text-[var(--hw-text)]">{layerMetaB.label}</strong> ({layerMetaB.description.toLowerCase()}).
                {projectB.layer === "HYPEREVM"
                  ? " As a HyperEVM protocol, it can compose with other EVM-based DeFi primitives and leverage smart contract flexibility."
                  : projectB.layer === "HYPERCORE"
                    ? " Running on HyperCore gives it direct access to the native orderbook with minimal latency and maximum throughput."
                    : projectB.layer === "HIP3"
                      ? " Through HIP-3, it enables permissionless creation of custom perpetual markets."
                      : " Spanning multiple layers lets it combine the strengths of each, though integration complexity is higher."}
              </p>
              {sameLayer && (
                <p className="text-xs text-[var(--hw-text-dim)]">
                  Both protocols share the same layer, maximizing composability potential.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Community Verdict */}
      <section className="mb-10">
        <SectionHeading>Community Verdict</SectionHeading>
        <div
          className="border border-dashed border-[var(--hw-border-bright)] bg-[var(--hw-surface)] p-6 text-center"
          style={{ borderRadius: "4px" }}
        >
          <p className="text-base text-[var(--hw-text)] mb-2">
            Which do you prefer?
          </p>
          <p className="text-sm text-[var(--hw-text-dim)] mb-5 max-w-md mx-auto">
            Share your experience with {projectA.name} or {projectB.name} to help others in the Hyperliquid community make better decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/projects/${projectA.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--hw-green)] text-[var(--hw-green)] transition-all hover:bg-[var(--hw-green)] hover:text-[var(--hw-bg)]"
              style={{ borderRadius: "4px" }}
            >
              <ProjectLogo name={projectA.name} logoUrl={projectA.logoUrl} size="sm" />
              Review {projectA.name}
            </Link>
            <span className="text-xs text-[var(--hw-text-dim)]">or</span>
            <Link
              href={`/projects/${projectB.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--hw-cyan)] text-[var(--hw-cyan)] transition-all hover:bg-[var(--hw-cyan)] hover:text-[var(--hw-bg)]"
              style={{ borderRadius: "4px" }}
            >
              <ProjectLogo name={projectB.name} logoUrl={projectB.logoUrl} size="sm" />
              Review {projectB.name}
            </Link>
          </div>
        </div>
      </section>

      {/* Related Comparisons */}
      {relatedPairs.length > 0 && (
        <section className="mb-10">
          <SectionHeading>Related Comparisons</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedPairs.map((rp) => (
              <Link
                key={`${rp.slugA}-${rp.slugB}`}
                href={`/compare/${rp.slugA}-vs-${rp.slugB}`}
                className="group flex items-center gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)]"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-center -space-x-1.5">
                  <span
                    className="flex h-6 w-6 items-center justify-center text-[9px] font-bold text-[var(--hw-bg)] ring-2 ring-[var(--hw-surface)]"
                    style={{ borderRadius: "4px", background: "var(--hw-green)" }}
                  >
                    {rp.nameA.charAt(0)}
                  </span>
                  <span
                    className="flex h-6 w-6 items-center justify-center text-[9px] font-bold text-[var(--hw-bg)] ring-2 ring-[var(--hw-surface)]"
                    style={{ borderRadius: "4px", background: "var(--hw-cyan)" }}
                  >
                    {rp.nameB.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                  {rp.nameA} vs {rp.nameB}
                </span>
                <svg
                  className="ml-auto h-4 w-4 shrink-0 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA: Explore Category */}
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 mb-8"
        style={{
          borderRadius: "4px",
          borderLeft: "3px solid var(--hw-green)",
        }}
      >
        <p className="text-sm text-[var(--hw-text-muted)] mb-3">
          Discover more projects in this space.
        </p>
        <Link
          href={`/category/${categoryToSlug(projectA.category)}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--hw-green)] hover:underline"
        >
          Explore all {projectA.category} projects on perp.wiki &rarr;
        </Link>
      </div>

      {/* Back links */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--hw-border)]">
        <Link
          href={`/projects/${projectA.slug}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--hw-green)] hover:underline"
        >
          View {projectA.name} &rarr;
        </Link>
        <Link
          href={`/projects/${projectB.slug}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--hw-green)] hover:underline"
        >
          View {projectB.name} &rarr;
        </Link>
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 text-sm text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)]"
        >
          &larr; All comparisons
        </Link>
      </div>
    </div>
  );
}

/* ── Helper Components ── */

function ProjectSummary({
  project,
}: {
  project: {
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    layer: string;
    category: string;
    logoUrl: string | null;
    status: string;
    website: string | null;
  };
}) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div
        className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-border-bright)] h-full"
        style={{ borderRadius: "4px" }}
      >
        <div className="flex items-start gap-3 mb-3">
          <ProjectLogo name={project.name} logoUrl={project.logoUrl} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                {project.name}
              </h2>
              <LayerBadge layer={project.layer} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="bg-[var(--hw-green-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--hw-text-muted)]"
                style={{ borderRadius: "2px" }}
              >
                {project.category}
              </span>
              <StatusPill status={project.status} />
            </div>
          </div>
        </div>
        {project.tagline && (
          <p className="text-sm text-[var(--hw-text-muted)] line-clamp-2 mb-3">
            {project.tagline}
          </p>
        )}
        {project.website && (
          <span className="text-xs text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors">
            {new URL(project.website).hostname.replace("www.", "")}
          </span>
        )}
      </div>
    </Link>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4 flex items-center gap-2">
      <span className="h-4 w-0.5 bg-[var(--hw-green)]" style={{ borderRadius: "1px" }} />
      {children}
    </h2>
  );
}

function StatusPill({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-block px-1.5 py-0.5 text-[10px] font-medium ${isActive ? "text-[var(--hw-green)]" : "text-[var(--hw-text-dim)]"}`}
      style={{
        borderRadius: "2px",
        background: isActive ? "var(--hw-green-subtle)" : "var(--hw-surface-raised)",
      }}
    >
      {isActive ? "Active" : status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function TagPill({ tag, highlight }: { tag: string; highlight: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-medium ${highlight ? "text-[var(--hw-green)]" : "text-[var(--hw-text-muted)]"}`}
      style={{
        borderRadius: "2px",
        background: highlight ? "var(--hw-green-subtle)" : "var(--hw-surface-raised)",
        border: highlight ? "1px solid rgba(0,229,160,0.2)" : "1px solid var(--hw-border)",
      }}
    >
      {tag}
    </span>
  );
}

function DifferenceRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 mt-0.5 text-sm">{icon}</span>
      <div>
        <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-1">
          {title}
        </h4>
        <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="h-3 w-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-6h6m0 0v6m0-6L9.75 14.25" />
    </svg>
  );
}
