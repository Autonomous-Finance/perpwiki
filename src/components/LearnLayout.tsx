import Link from "next/link";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { ProjectLogo } from "@/components/ProjectLogo";
import { prisma } from "@/lib/prisma";
import { LEARN_ARTICLES, type LearnArticle } from "@/lib/learn-articles";

/* Re-export reusable learn article components */
export { LiveStatBanner } from "@/components/LiveStatBanner";
export { FreshnessBadge } from "@/components/FreshnessBadge";
export { DifficultyBadge } from "@/components/DifficultyBadge";
export { StepByStep } from "@/components/StepByStep";

interface LearnLayoutProps {
  article: LearnArticle;
  prev: LearnArticle | null;
  next: LearnArticle | null;
  toc: { id: string; title: string }[];
  children: React.ReactNode;
}

/**
 * Maps article slug keywords to related project slugs for cross-linking.
 */
function getRelatedProjectSlugs(articleSlug: string): string[] {
  const slug = articleSlug.toLowerCase();

  if (slug.includes("staking") || slug.includes("earn-yield")) {
    return ["kinetiq", "stakedhype", "hyperbeat"];
  }
  if (slug.includes("funding-rate")) {
    return ["hlp", "hyperliquid"];
  }
  if (slug.includes("bridge") || slug.includes("hyperunit")) {
    return ["debridge", "across-protocol", "layerzero"];
  }
  if (slug.includes("dex") || slug.includes("perp-dex")) {
    return ["hyperswap", "kittenswap"];
  }
  if (slug.includes("lending") || slug.includes("defi-projects")) {
    return ["hyperlend", "felix-protocol", "morpho"];
  }
  if (slug.includes("hlp-vault")) {
    return ["hlp", "hyperliquid", "hyperbeat"];
  }
  if (slug.includes("trading-bot")) {
    return ["pvp-trade", "insilico", "hyperliquid"];
  }
  // Default/general
  return ["hyperliquid", "hlp"];
}

export async function LearnLayout({ article, prev, next, toc, children }: LearnLayoutProps) {
  const relatedSlugs = getRelatedProjectSlugs(article.slug);
  const relatedProjects = await prisma.project.findMany({
    where: {
      slug: { in: relatedSlugs },
      approvalStatus: "APPROVED",
    },
    select: {
      slug: true,
      name: true,
      tagline: true,
      logoUrl: true,
    },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <BreadcrumbSchema
        items={[
          { name: "Learn", href: "https://perp.wiki/learn" },
          { name: article.title, href: `https://perp.wiki/learn/${article.slug}` },
        ]}
      />
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <Link href="/learn" className="hover:text-[var(--hw-text-muted)]">Learn</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{article.title}</span>
      </div>

      <div className="flex gap-10">
        {/* Sticky TOC — desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20">
            <Link
              href="/learn"
              className="mb-6 block text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
            >
              &larr; Back to Learn
            </Link>
            <div className="mb-4 text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] font-[family-name:var(--font-jetbrains-mono)]">
              On this page
            </div>
            <nav className="space-y-1.5 border-l border-[var(--hw-border)] pl-3">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-xs text-[var(--hw-text-dim)] hover:text-[var(--hw-green)] transition-colors py-0.5"
                >
                  {item.title}
                </a>
              ))}
            </nav>

            {/* Quick links sidebar */}
            <div className="mt-8 border-t border-[var(--hw-border)] pt-6">
              <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] font-[family-name:var(--font-jetbrains-mono)] mb-3">
                Quick links
              </div>
              <div className="space-y-1.5">
                <Link href="/projects" className="block text-xs text-[var(--hw-text-dim)] hover:text-[var(--hw-green)] transition-colors">
                  Browse Projects &rarr;
                </Link>
                <Link href="/markets" className="block text-xs text-[var(--hw-text-dim)] hover:text-[var(--hw-green)] transition-colors">
                  Live Markets &rarr;
                </Link>
                <Link href="/tools" className="block text-xs text-[var(--hw-text-dim)] hover:text-[var(--hw-green)] transition-colors">
                  Trading Tools &rarr;
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <article className="min-w-0 flex-1 max-w-3xl">
          <header
            className="mb-8 pb-6 border-b border-[var(--hw-border)] relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none opacity-10"
              style={{
                background: "radial-gradient(circle at top right, var(--hw-green-glow), transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className="bg-[var(--hw-green-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--hw-green)]"
                  style={{ borderRadius: "2px" }}
                >
                  {article.category}
                </span>
                <span className="text-xs text-[var(--hw-text-dim)]">{article.readingTime} read</span>
                {article.datePublished && (
                  <span className="text-xs text-[var(--hw-text-dim)]">
                    Updated {article.datePublished}
                  </span>
                )}
              </div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
                {article.title}
              </h1>
              <p className="mt-3 text-[var(--hw-text-muted)] max-w-2xl">{article.description}</p>
            </div>
          </header>

          <div className="prose-hw">{children}</div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-12 border-t border-[var(--hw-border)] pt-8">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
                Related Projects
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/projects/${rp.slug}`}
                    className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)]"
                    style={{ borderRadius: "4px" }}
                  >
                    <div className="flex items-start gap-3">
                      <ProjectLogo name={rp.name} logoUrl={rp.logoUrl} size="sm" className="mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                          {rp.name}
                        </span>
                        {rp.tagline && (
                          <p className="text-xs text-[var(--hw-text-dim)] mt-0.5 line-clamp-2">
                            {rp.tagline}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {(() => {
            const related = LEARN_ARTICLES
              .filter((a) => a.category === article.category && a.slug !== article.slug)
              .slice(0, 3);
            if (related.length === 0) return null;
            return (
              <div className="mt-10 border-t border-[var(--hw-border)] pt-8">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
                  Related Articles
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((ra) => (
                    <Link
                      key={ra.slug}
                      href={`/learn/${ra.slug}`}
                      className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)]"
                      style={{ borderRadius: "4px" }}
                    >
                      <span className="text-[10px] text-[var(--hw-text-dim)] uppercase tracking-wider">{ra.category}</span>
                      <span className="block text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors mt-1 line-clamp-2">
                        {ra.title}
                      </span>
                      <span className="block text-xs text-[var(--hw-text-dim)] mt-1">{ra.readingTime} read</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* CTA Banner */}
          <div
            className="mt-10 border border-[var(--hw-border)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              borderRadius: "4px",
              background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)",
            }}
          >
            <div>
              <p className="text-sm font-medium text-[var(--hw-text)]">
                Explore the Hyperliquid ecosystem
              </p>
              <p className="text-xs text-[var(--hw-text-dim)] mt-0.5">
                Discover projects, compare protocols, and track markets
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all hover:opacity-90"
                style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
              >
                Browse Projects
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[var(--hw-green)] text-[var(--hw-green)] hover:bg-[var(--hw-green-subtle)] transition-all"
                style={{ borderRadius: "4px" }}
              >
                Compare Projects
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] transition-all"
                style={{ borderRadius: "4px" }}
              >
                More Articles
              </Link>
            </div>
          </div>

          {/* Prev/Next nav */}
          <nav className="mt-10 grid grid-cols-2 gap-4 border-t border-[var(--hw-border)] pt-6">
            <div>
              {prev ? (
                <Link
                  href={`/learn/${prev.slug}`}
                  className="group block border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
                  style={{ borderRadius: "4px" }}
                >
                  <span className="text-[10px] text-[var(--hw-text-dim)] uppercase tracking-wider">Previous</span>
                  <span className="block text-sm text-[var(--hw-text-muted)] group-hover:text-[var(--hw-text)] transition-colors mt-1">
                    &larr; {prev.title}
                  </span>
                </Link>
              ) : null}
            </div>
            <div className="text-right">
              {next ? (
                <Link
                  href={`/learn/${next.slug}`}
                  className="group block border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
                  style={{ borderRadius: "4px" }}
                >
                  <span className="text-[10px] text-[var(--hw-text-dim)] uppercase tracking-wider">Next</span>
                  <span className="block text-sm text-[var(--hw-text-muted)] group-hover:text-[var(--hw-text)] transition-colors mt-1">
                    {next.title} &rarr;
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        </article>
      </div>
    </div>
  );
}

/* ============================================================ */
/* Reusable prose components for learn articles                  */
/* ============================================================ */

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mt-10 mb-4 scroll-mt-20 flex items-center gap-2"
    >
      <span className="inline-block h-1 w-5 bg-[var(--hw-green)]" style={{ borderRadius: 1 }} />
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] mb-4">{children}</p>
  );
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)] underline underline-offset-2">
      {children}
    </Link>
  );
}

/** Highlighted callout box for key facts or warnings */
export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "tip";
  title?: string;
  children: React.ReactNode;
}) {
  const colors = {
    info: { border: "var(--hw-cyan)", bg: "rgba(0,200,224,0.05)", icon: "i" },
    warning: { border: "var(--hw-gold)", bg: "rgba(240,180,41,0.05)", icon: "!" },
    tip: { border: "var(--hw-green)", bg: "rgba(0,229,160,0.05)", icon: "✓" },
  };
  const c = colors[type];
  return (
    <div
      className="my-6 border-l-3 p-4"
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: c.border,
        background: c.bg,
        borderRadius: "0 4px 4px 0",
      }}
    >
      {title && (
        <div className="text-sm font-semibold text-[var(--hw-text)] mb-1.5 flex items-center gap-2">
          <span
            className="inline-flex h-5 w-5 items-center justify-center text-[10px] font-bold shrink-0"
            style={{ borderRadius: "4px", background: c.border, color: "var(--hw-bg)" }}
          >
            {c.icon}
          </span>
          {title}
        </div>
      )}
      <div className="text-sm text-[var(--hw-text-muted)] leading-relaxed">{children}</div>
    </div>
  );
}

/** Key facts box with outlined items */
export function KeyFacts({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <div
      className="my-6 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
      style={{ borderRadius: "4px" }}
    >
      <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] mb-3 font-[family-name:var(--font-jetbrains-mono)]">
        Key Facts
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label} className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-[var(--hw-text-dim)]">{f.label}</span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-medium text-[var(--hw-text)]">
              {f.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6 overflow-x-auto border border-[var(--hw-border)]" style={{ borderRadius: "4px" }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 text-left text-[var(--hw-text)] font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-[var(--hw-surface)]" : ""}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-[var(--hw-border)] last:border-b-0 px-4 py-2.5 text-[var(--hw-text-muted)]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="my-8">
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
        style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
      >
        {children}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}

/** TL;DR summary box — place at the top of articles */
export function TldrBox({ items }: { items: string[] }) {
  return (
    <div
      className="my-6 border border-[var(--hw-border-bright)] bg-[var(--hw-surface)] p-5"
      style={{ borderRadius: "4px", borderLeft: "3px solid var(--hw-green)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex h-5 items-center px-1.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ borderRadius: "2px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
        >
          TL;DR
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-[var(--hw-text-muted)]">
            <span className="text-[var(--hw-green)] shrink-0 mt-0.5">&#10003;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Featured project card for inline article mentions */
export function FeatureCard({
  name,
  slug,
  description,
  logoUrl,
  category,
}: {
  name: string;
  slug: string;
  description: string;
  logoUrl?: string | null;
  category?: string;
}) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group my-4 flex items-start gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-green)]"
      style={{ borderRadius: "4px" }}
    >
      <ProjectLogo name={name} logoUrl={logoUrl ?? null} size="md" className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
            {name}
          </span>
          {category && (
            <span
              className="bg-[var(--hw-green-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--hw-text-dim)]"
              style={{ borderRadius: "2px" }}
            >
              {category}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--hw-text-dim)] mt-0.5 line-clamp-2">{description}</p>
        <span className="text-[10px] text-[var(--hw-green)] mt-1 inline-block">View on perp.wiki &rarr;</span>
      </div>
    </Link>
  );
}

/** Secondary outlined CTA button */
export function CTAOutline({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="my-6">
      <Link
        href={href}
        className="inline-flex items-center gap-2 border border-[var(--hw-green)] px-5 py-2 text-sm font-medium text-[var(--hw-green)] hover:bg-[var(--hw-green-subtle)] transition-colors"
        style={{ borderRadius: "4px" }}
      >
        {children}
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
