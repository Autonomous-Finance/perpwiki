import { LEARN_ARTICLES } from "@/lib/learn-articles";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hyperliquid Guides & Resources 2026 | perp.wiki",
  description:
    "Learn about Hyperliquid, HyperEVM, HYPE staking, HLP vault, trading bots, and the Hyperliquid ecosystem. Guides for beginners and advanced users.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <BreadcrumbSchema
        items={[
          { name: "Learn", href: "https://perp.wiki/learn" },
        ]}
      />
      <div className="mb-2 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Learn</span>
      </div>

      <div className="border-b border-[var(--hw-border)] pb-8 mb-10">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[var(--hw-text)]">
          Learn Hyperliquid
        </h1>
        <p className="mt-3 text-lg text-[var(--hw-text-muted)] max-w-2xl">
          In-depth guides to understand the Hyperliquid ecosystem — from the basics to advanced protocol mechanics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARN_ARTICLES.map((article) => (
          <Link key={article.slug} href={`/learn/${article.slug}`}>
            <div
              className="flex h-full flex-col gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 transition-all hover:border-[var(--hw-green)] hover:shadow-[0_0_8px_rgba(0,229,160,0.08)]"
              style={{ borderRadius: "4px" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="bg-[var(--hw-green-subtle)] px-2 py-0.5 text-xs text-[var(--hw-green)]"
                  style={{ borderRadius: "2px" }}
                >
                  {article.category}
                </span>
                <span className="text-xs text-[var(--hw-text-dim)]">{article.readingTime}</span>
              </div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[var(--hw-text)]">
                {article.title}
              </h2>
              <p className="text-sm text-[var(--hw-text-muted)] line-clamp-3">
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
