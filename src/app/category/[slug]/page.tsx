import { prisma } from "@/lib/prisma";
import { categoryToSlug, CATEGORIES } from "@/lib/categories";
import { getCategoryContent, generateFallbackContent } from "@/lib/category-content";
import { ProjectCard } from "@/components/ProjectCard";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { getRelatedArticlesForCategory } from "@/lib/learn-articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perp.wiki";

/* ------------------------------------------------------------------ */
/*  Category-to-learn-article mapping                                  */
/* ------------------------------------------------------------------ */

const CATEGORY_LEARN_MAP: Record<string, string[]> = {
  "decentralized-exchanges": ["perp-dex-comparison", "best-hyperevm-projects", "best-hyperevm-defi-projects"],
  "lending-and-borrowing": ["best-hyperevm-defi-projects", "how-to-earn-yield-on-hyperliquid", "hyperevm-yield-farming-guide"],
  "liquid-staking": ["how-to-stake-hype", "hyperliquid-staking-guide", "best-hyperevm-defi-projects"],
  "yield-and-vaults": ["how-to-earn-yield-on-hyperliquid", "hlp-vault-guide", "hyperevm-yield-farming-guide"],
  "trading-bots-automation": ["best-hyperliquid-trading-bots", "how-to-use-hyperliquid", "hyperliquid-funding-rates-guide"],
  "trading-terminals-interfaces": ["how-to-use-hyperliquid", "hyperliquid-fees", "perp-dex-comparison"],
  "bridges-cross-chain": ["how-to-bridge-to-hyperliquid", "hyperunit-bridge-guide", "what-is-hyperevm"],
  "analytics-data": ["hyperliquid-open-interest-explained", "hyperliquid-funding-rates-guide", "what-is-hyperliquid"],
  "oracles": ["what-is-hyperevm", "hypercore-vs-hyperevm", "best-hyperevm-defi-projects"],
  "wallets-account-abstraction": ["how-to-use-hyperliquid", "what-is-hyperevm", "what-is-hyperliquid"],
  "prediction-markets": ["what-is-hip-3", "what-is-hip-1", "what-is-hyperliquid"],
  "rwa-perps": ["what-is-hip-3", "hyperliquid-open-interest-explained", "perp-dex-comparison"],
  "sdks-developer-tools": ["what-is-hyperevm", "hypercore-vs-hyperevm", "what-is-hyperliquid"],
  "security-audits": ["what-is-hyperevm", "best-hyperevm-defi-projects", "what-is-hyperliquid"],
  "data-apis": ["hyperliquid-open-interest-explained", "what-is-hyperevm", "what-is-hyperliquid"],
  "nfts-collectibles": ["what-is-hyperevm", "what-is-hip-1", "what-is-hyperliquid"],
  "communities-daos": ["what-is-hyperliquid", "hype-token-guide", "what-is-hyperevm"],
  "media-education": ["what-is-hyperliquid", "how-to-use-hyperliquid", "what-is-hyperevm"],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface Props {
  params: Promise<{ slug: string }>;
}

function slugToCategory(slug: string): string | undefined {
  const found = CATEGORIES.find((c) => categoryToSlug(c) === slug);
  if (found) return found;
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const cats = await prisma.project.groupBy({
    by: ["category"],
    where: { approvalStatus: "APPROVED" },
  });
  return cats.map((c) => ({ slug: categoryToSlug(c.category) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Not Found" };
  const content = getCategoryContent(slug);
  const description = content
    ? content.intro
    : `Top ${category} projects in the Hyperliquid ecosystem. Independent directory with features and ecosystem context. perp.wiki`;
  return {
    title: `Best ${category} on Hyperliquid 2026`,
    description,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Try known categories first, then do a DB lookup
  let category = slugToCategory(slug);
  if (!category) {
    const allCats = await prisma.project.groupBy({
      by: ["category"],
      where: { approvalStatus: "APPROVED" },
    });
    const match = allCats.find((c) => categoryToSlug(c.category) === slug);
    if (match) {
      category = match.category;
    }
  }

  if (!category) notFound();

  const projects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED", category },
    orderBy: [{ isFeatured: "desc" }, { isVerified: "desc" }, { name: "asc" }],
  });

  if (projects.length === 0) notFound();

  // Compute aggregate stats
  const totalProjects = projects.length;
  const verifiedCount = projects.filter((p) => p.isVerified).length;
  const featuredProject = projects.find((p) => p.isFeatured) ?? null;

  // Get category content (rich or fallback)
  const content = getCategoryContent(slug) ?? generateFallbackContent(category, slug);

  // Get related learn articles
  const learnSlugs = CATEGORY_LEARN_MAP[slug] ?? [];
  const { getArticle } = await import("@/lib/learn-articles");
  const relatedArticles = learnSlugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => a != null)
    .slice(0, 3);

  // If no mapped articles, fall back to the category-based helper
  if (relatedArticles.length === 0) {
    const fallbackArticles = getRelatedArticlesForCategory(category);
    relatedArticles.push(...fallbackArticles);
  }

  // FAQ items
  const faqItems = [
    {
      question: `What are the best ${category} projects on Hyperliquid?`,
      answer: content.faqAnswers.best,
    },
    {
      question: `How does ${category} work on Hyperliquid?`,
      answer: content.faqAnswers.howWorks,
    },
    {
      question: `Is ${category} safe on Hyperliquid?`,
      answer: content.faqAnswers.safety,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* CollectionPage JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} Projects on Hyperliquid`,
          description: content.intro,
          url: `${SITE_URL}/category/${slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `${SITE_URL}/projects/${p.slug}`,
            })),
          },
        }}
      />

      {/* FAQPage JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Categories", href: `${SITE_URL}/category` },
          { name: category, href: `${SITE_URL}/category/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <Link href="/category" className="hover:text-[var(--hw-text-muted)]">Categories</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{category}</span>
      </div>

      {/* ── Hero / Header ── */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
        {content.headline}
      </h1>
      <p className="text-base text-[var(--hw-text-muted)] mb-6 max-w-3xl leading-relaxed">
        {content.intro}
      </p>

      {/* ── Aggregate Stats ── */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
          <p className="text-2xl font-bold text-[var(--hw-green)] font-[family-name:var(--font-space-grotesk)]">
            {totalProjects}
          </p>
          <p className="text-xs text-[var(--hw-text-dim)] mt-1">
            Project{totalProjects !== 1 ? "s" : ""} Listed
          </p>
        </div>
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
          <p className="text-2xl font-bold text-[var(--hw-text)] font-[family-name:var(--font-space-grotesk)]">
            {verifiedCount}
          </p>
          <p className="text-xs text-[var(--hw-text-dim)] mt-1">
            Verified
          </p>
        </div>
        {featuredProject && (
          <div className="col-span-2 sm:col-span-1 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: "4px" }}>
            <p className="text-xs text-[var(--hw-text-dim)] mb-1">Featured Project</p>
            <Link
              href={`/projects/${featuredProject.slug}`}
              className="text-base font-semibold text-[var(--hw-green)] hover:underline font-[family-name:var(--font-space-grotesk)]"
            >
              {featuredProject.name}
            </Link>
          </div>
        )}
      </div>

      {/* ── Project Grid ── */}
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
        All {category} Projects
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
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

      {/* ── Deep Dive Section ── */}
      <div className="mb-12 max-w-3xl">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
          Understanding {category} on Hyperliquid
        </h2>
        {content.deepDive.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-sm text-[var(--hw-text-muted)] leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}

        <h3 className="text-base font-semibold text-[var(--hw-text)] mt-6 mb-2">Key Projects</h3>
        <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed mb-4">
          {content.keyProjects}
        </p>

        <h3 className="text-base font-semibold text-[var(--hw-text)] mt-6 mb-2">
          Why {category} Matters on Hyperliquid
        </h3>
        <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
          {content.whyItMatters}
        </p>
      </div>

      {/* ── Compare Section ── */}
      {content.comparePairs.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Compare {category} Projects
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.comparePairs.map((pair) => (
              <Link
                key={`${pair.slugA}-${pair.slugB}`}
                href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
                className="flex items-center justify-between border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 hover:border-[var(--hw-green)] transition-colors"
                style={{ borderRadius: "4px" }}
              >
                <span className="text-sm font-medium text-[var(--hw-text)]">
                  {pair.nameA} vs {pair.nameB}
                </span>
                <span className="text-xs text-[var(--hw-text-dim)]">&rarr;</span>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--hw-text-dim)]">
            <Link href="/compare" className="text-[var(--hw-green)] hover:underline">
              View all comparisons &rarr;
            </Link>
          </p>
        </div>
      )}

      {/* ── Related Categories ── */}
      {content.relatedCategories.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Related Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {content.relatedCategories.map((rc) => (
              <Link
                key={rc.slug}
                href={`/category/${rc.slug}`}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2 text-sm text-[var(--hw-text-muted)] hover:border-[var(--hw-green)] hover:text-[var(--hw-text)] transition-colors"
                style={{ borderRadius: "4px" }}
              >
                {rc.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Learn More ── */}
      {relatedArticles.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Learn More
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 hover:border-[var(--hw-green)] transition-colors"
                style={{ borderRadius: "4px" }}
              >
                <h3 className="text-sm font-semibold text-[var(--hw-text)] mb-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-[var(--hw-text-dim)] line-clamp-2 mb-2">
                  {article.description}
                </p>
                <span className="text-xs text-[var(--hw-green)]">
                  {article.readingTime} read &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Glossary Terms ── */}
      {content.glossaryTerms.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
            Key Terms
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.glossaryTerms.map((term) => (
              <Link
                key={term}
                href={`/glossary#${term.toLowerCase().replace(/\s+/g, "-")}`}
                className="bg-[var(--hw-green-subtle)] px-3 py-1.5 text-xs text-[var(--hw-text-muted)] hover:text-[var(--hw-text)] transition-colors"
                style={{ borderRadius: "2px" }}
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ Section ── */}
      <div className="mb-12 max-w-3xl">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((faq, i) => (
            <div key={i} className="border-b border-[var(--hw-border)] pb-6 last:border-b-0">
              <h3 className="text-base font-semibold text-[var(--hw-text)] mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Compare CTA ── */}
      <div
        className="mt-8 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6 text-center"
        style={{ borderRadius: "4px" }}
      >
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)] mb-2">
          Compare {category} Projects
        </h3>
        <p className="text-sm text-[var(--hw-text-muted)] mb-4">
          See how {category} projects on Hyperliquid stack up against each other side-by-side.
        </p>
        <Link
          href={`/compare#${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[var(--hw-bg)] transition-all hover:opacity-90"
          style={{ borderRadius: "4px", background: "var(--hw-green)" }}
        >
          Compare {category} projects side-by-side
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* ── Footer Links ── */}
      <div className="border-t border-[var(--hw-border)] pt-6 flex flex-wrap gap-4 text-sm text-[var(--hw-text-dim)]">
        <Link href="/projects" className="hover:text-[var(--hw-text-muted)] transition-colors">
          All Projects
        </Link>
        <Link href="/compare" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Compare Projects
        </Link>
        <Link href="/glossary" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Glossary
        </Link>
        <Link href="/learn" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Learn Hub
        </Link>
        <Link href="/category" className="hover:text-[var(--hw-text-muted)] transition-colors">
          All Categories
        </Link>
      </div>
    </div>
  );
}
