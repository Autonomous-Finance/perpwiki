import Link from "next/link";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { prisma } from "@/lib/prisma";
import type { LearnArticle } from "@/lib/learn-articles";

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
            <nav className="space-y-2">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-xs text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <article className="min-w-0 flex-1 max-w-3xl">
          <header className="mb-8 border-b border-[var(--hw-border)] pb-6">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="bg-[var(--hw-green-subtle)] px-2 py-0.5 text-xs text-[var(--hw-green)]"
                style={{ borderRadius: "2px" }}
              >
                {article.category}
              </span>
              <span className="text-xs text-[var(--hw-text-dim)]">{article.readingTime} read</span>
            </div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-[var(--hw-text-muted)]">{article.description}</p>
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
                    className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
                    style={{ borderRadius: "4px" }}
                  >
                    <div className="flex items-start gap-3">
                      {rp.logoUrl ? (
                        <img
                          src={rp.logoUrl}
                          alt={rp.name + " logo"}
                          className="h-8 w-8 shrink-0 rounded object-cover mt-0.5"
                        />
                      ) : (
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold text-[var(--hw-bg)]"
                          style={{ background: "var(--hw-text-dim)" }}
                        >
                          {rp.name.charAt(0)}
                        </span>
                      )}
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

          {/* Prev/Next nav */}
          <nav className="mt-12 flex justify-between border-t border-[var(--hw-border)] pt-6">
            <div>
              {prev ? (
                <Link
                  href={`/learn/${prev.slug}`}
                  className="text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-text)]"
                >
                  &larr; {prev.title}
                </Link>
              ) : null}
            </div>
            <div>
              {next ? (
                <Link
                  href={`/learn/${next.slug}`}
                  className="text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-text)]"
                >
                  {next.title} &rarr;
                </Link>
              ) : null}
            </div>
          </nav>
        </article>
      </div>
    </div>
  );
}

/* Reusable prose components for learn articles */
export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mt-10 mb-4 scroll-mt-20"
    >
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

export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2 text-left text-[var(--hw-text)] font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-[var(--hw-border)] px-4 py-2 text-[var(--hw-text-muted)]"
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
        className="inline-block border border-[var(--hw-green)] px-5 py-2 text-sm font-medium text-[var(--hw-green)] hover:bg-[var(--hw-green-subtle)] transition-colors"
        style={{ borderRadius: "2px" }}
      >
        {children}
      </Link>
    </div>
  );
}
