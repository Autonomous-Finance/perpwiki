import Link from "next/link";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LEARN_ARTICLES } from "@/lib/learn-articles";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sitemap — perp.wiki",
  description:
    "Complete site map for perp.wiki — browse all pages including projects, markets, funding rates, learn articles, ecosystem layers, and tools.",
  alternates: { canonical: "https://perp.wiki/sitemap-html" },
};

const MAIN_PAGES = [
  { href: "/", label: "Home", desc: "Homepage with ecosystem overview and project highlights" },
  { href: "/projects", label: "All Projects", desc: "Browse every Hyperliquid ecosystem project" },
  { href: "/categories", label: "Categories", desc: "All DeFi sectors in the Hyperliquid ecosystem" },
  { href: "/markets", label: "Markets", desc: "Live perpetual futures prices, volume, and open interest" },
  { href: "/funding-rates", label: "Funding Rates", desc: "Real-time funding rates across all Hyperliquid markets" },
  { href: "/stats", label: "Stats", desc: "Ecosystem statistics — TVL, volume, and open interest" },
  { href: "/trending", label: "Trending", desc: "Trending HyperEVM projects by community interest" },
];

const RESOURCE_PAGES = [
  { href: "/learn", label: "Learn Hub", desc: "Guides and tutorials for the Hyperliquid ecosystem" },
  { href: "/glossary", label: "Glossary", desc: "44 DeFi and Hyperliquid-specific terms explained" },
  { href: "/faq", label: "FAQ", desc: "Frequently asked questions about Hyperliquid" },
  { href: "/about", label: "About", desc: "About perp.wiki and its mission" },
];

const LAYER_PAGES = [
  { href: "/layer/hypercore", label: "HyperCore", desc: "Native order book engine — perpetual and spot trading" },
  { href: "/layer/hyperevm", label: "HyperEVM", desc: "EVM-compatible layer for DeFi smart contracts" },
  { href: "/layer/hip3", label: "HIP-3", desc: "Permissionless perpetual futures markets" },
];

const OTHER_PAGES = [
  { href: "/compare", label: "Compare Projects", desc: "Side-by-side analysis of competing protocols" },
  { href: "/tools", label: "Tools", desc: "Calculators and utilities for Hyperliquid traders" },
  { href: "/submit", label: "Submit a Project", desc: "Submit a new project to the directory" },
];

function SitemapSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SitemapLink({
  href,
  label,
  desc,
}: {
  href: string;
  label: string;
  desc?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-baseline gap-2 py-1.5 transition-colors"
      >
        <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
          {label}
        </span>
        {desc && (
          <span className="text-xs text-[var(--hw-text-dim)] hidden sm:inline">
            — {desc}
          </span>
        )}
      </Link>
    </li>
  );
}

export default async function SitemapHtmlPage() {
  const ecosystemProjects = await prisma.project.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <BreadcrumbSchema
        items={[
          { name: "Sitemap", href: "https://perp.wiki/sitemap-html" },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Sitemap</span>
      </nav>

      {/* Hero */}
      <div
        className="relative border border-[var(--hw-border)] bg-[var(--hw-surface)] p-8 sm:p-10 mb-10 overflow-hidden"
        style={{ borderRadius: "4px" }}
      >
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle at top right, var(--hw-green-glow), transparent 70%)" }}
        />
        <div className="relative">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-[var(--hw-text)] mb-3">
            Sitemap
          </h1>
          <p className="text-base text-[var(--hw-text-muted)] max-w-2xl">
            A complete index of every page on perp.wiki — browse by section or find the page you need.
          </p>
        </div>
      </div>

      {/* Main Pages */}
      <SitemapSection title="Main Pages">
        <ul className="border border-[var(--hw-border)] bg-[var(--hw-surface)] divide-y divide-[var(--hw-border)] px-4" style={{ borderRadius: "4px" }}>
          {MAIN_PAGES.map((page) => (
            <SitemapLink key={page.href} {...page} />
          ))}
        </ul>
      </SitemapSection>

      {/* Learn & Resources */}
      <SitemapSection title="Learn &amp; Resources">
        <ul className="border border-[var(--hw-border)] bg-[var(--hw-surface)] divide-y divide-[var(--hw-border)] px-4 mb-4" style={{ borderRadius: "4px" }}>
          {RESOURCE_PAGES.map((page) => (
            <SitemapLink key={page.href} {...page} />
          ))}
        </ul>
        <h3 className="text-sm font-medium text-[var(--hw-text-muted)] mb-2 mt-6">
          All Learn Articles
        </h3>
        <ul className="border border-[var(--hw-border)] bg-[var(--hw-surface)] divide-y divide-[var(--hw-border)] px-4" style={{ borderRadius: "4px" }}>
          {LEARN_ARTICLES.map((article) => (
            <SitemapLink
              key={article.slug}
              href={`/learn/${article.slug}`}
              label={article.title}
            />
          ))}
        </ul>
      </SitemapSection>

      {/* Ecosystem Layers */}
      <SitemapSection title="Ecosystem Layers">
        <ul className="border border-[var(--hw-border)] bg-[var(--hw-surface)] divide-y divide-[var(--hw-border)] px-4" style={{ borderRadius: "4px" }}>
          {LAYER_PAGES.map((page) => (
            <SitemapLink key={page.href} {...page} />
          ))}
        </ul>
      </SitemapSection>

      {/* Other */}
      <SitemapSection title="Tools &amp; Other">
        <ul className="border border-[var(--hw-border)] bg-[var(--hw-surface)] divide-y divide-[var(--hw-border)] px-4" style={{ borderRadius: "4px" }}>
          {OTHER_PAGES.map((page) => (
            <SitemapLink key={page.href} {...page} />
          ))}
        </ul>
      </SitemapSection>

      {/* Ecosystem Landing Pages */}
      <SitemapSection title="Ecosystem Landing Pages">
        <p className="text-sm text-[var(--hw-text-dim)] mb-3">
          Individual overview pages for each project on Hyperliquid.
        </p>
        <ul className="border border-[var(--hw-border)] bg-[var(--hw-surface)] divide-y divide-[var(--hw-border)] px-4" style={{ borderRadius: "4px" }}>
          {ecosystemProjects.map((p) => (
            <SitemapLink
              key={p.slug}
              href={`/ecosystem/${p.slug}`}
              label={`${p.name} on Hyperliquid`}
            />
          ))}
        </ul>
      </SitemapSection>

      {/* Footer note */}
      <p className="text-xs text-[var(--hw-text-dim)] text-center">
        For the XML sitemap used by search engines, see{" "}
        <a href="/sitemap.xml" className="text-[var(--hw-green)] hover:underline">
          /sitemap.xml
        </a>
        .
      </p>
    </div>
  );
}
