import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LayerBadge } from "@/components/LayerBadge";
import { ProjectLogo } from "@/components/ProjectLogo";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { ReviewForm } from "@/components/ReviewForm";
import { SuggestionForm } from "@/components/SuggestionForm";
import { HelpfulButton } from "@/components/HelpfulButton";
import { getMarketTicker } from "@/lib/market-map";
import { LiveMarketCard } from "@/components/LiveMarketCard";
import { ProjectTabs } from "@/components/ProjectTabs";
import { WebsitePreview } from "@/components/WebsitePreview";
import { LAYER_META } from "@/lib/categories";
import { getRelatedArticlesForCategory } from "@/lib/learn-articles";
import { getCtaLabel, getStatusColor, getHostname } from "@/lib/format";
import Link from "next/link";
import type { Metadata } from "next";

interface FaqItem {
  question: string;
  answer: string;
}

function generateFaqs(
  project: {
    name: string;
    tagline: string | null;
    description: string | null;
    category: string;
    layer: string;
    website: string | null;
  },
  dossierData: DossierData | null,
): FaqItem[] {
  const faqs: FaqItem[] = [];
  const layerMeta = LAYER_META[project.layer];
  const layerLabel = layerMeta?.label ?? project.layer;
  const layerDesc = layerMeta?.description ?? "blockchain layer";

  // 1. What is {project.name}?
  const intro =
    project.tagline ||
    (project.description ? project.description.split(". ")[0] + "." : null);
  if (intro) {
    faqs.push({
      question: `What is ${project.name}?`,
      answer: `${project.name} is ${intro.charAt(0).toLowerCase() === intro.charAt(0) ? intro : intro.charAt(0).toLowerCase() + intro.slice(1)}`,
    });
  }

  // 2. What layer does it run on?
  faqs.push({
    question: `What layer does ${project.name} run on?`,
    answer:
      project.layer === "BOTH"
        ? `${project.name} spans multiple Hyperliquid layers, operating across both HyperCore and HyperEVM.`
        : `${project.name} runs on ${layerLabel}, Hyperliquid's ${layerDesc.charAt(0).toLowerCase() + layerDesc.slice(1)}.`,
  });

  // 3. Is it audited?
  if (dossierData?.auditStatus) {
    faqs.push({
      question: `Is ${project.name} audited?`,
      answer: dossierData.auditStatus,
    });
  } else {
    faqs.push({
      question: `Is ${project.name} audited?`,
      answer: `Check ${project.name}'s official documentation for the latest audit status and security information.`,
    });
  }

  // 4. What category?
  faqs.push({
    question: `What category is ${project.name}?`,
    answer: `${project.name} is a ${project.category} protocol in the Hyperliquid ecosystem.`,
  });

  // 5. How do I use it?
  if (project.website) {
    faqs.push({
      question: `How do I use ${project.name}?`,
      answer: `Visit ${getHostname(project.website, "the official website")} to get started. ${project.name} is a ${project.category} application on Hyperliquid's ${layerLabel} layer.`,
    });
  }

  return faqs;
}

interface DossierData {
  entityName?: string;
  oneLiner?: string;
  overview?: string;
  keyMetrics?: Array<{ label: string; value: string; note?: string }>;
  howItWorks?: string;
  tokenomics?: string;
  risks?: string;
  competitors?: string[];
  team?: { description?: string; anonymous?: boolean };
  funding?: { raised?: string; investors?: string[] };
  auditStatus?: string;
  verdict?: string;
  lastUpdated?: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Not Found" };
  const seoTitle = `${project.name} — Hyperliquid Ecosystem`;
  const seoDesc = `${project.name} on Hyperliquid: overview, features, layer, and ecosystem context. Independent profile on perp.wiki.`;
  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: seoTitle,
      description: seoDesc,
    },
  };
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project || project.approvalStatus !== "APPROVED") {
    notFound();
  }

  const tags: string[] = (() => {
    try {
      return JSON.parse(project.tags);
    } catch {
      return [];
    }
  })();

  const relatedProjects = await prisma.project.findMany({
    where: {
      approvalStatus: "APPROVED",
      category: project.category,
      slug: { not: project.slug },
    },
    take: 4,
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  const dossier = await prisma.dossier.findUnique({
    where: { projectId: project.id },
  });

  let dossierData: DossierData | null = null;
  if (dossier) {
    try {
      dossierData = JSON.parse(dossier.dossierJson) as DossierData;
    } catch {
      dossierData = null;
    }
  }

  const reviews = await prisma.review.findMany({
    where: { projectId: project.id, isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;
  const starDistribution = [1, 2, 3, 4, 5].map(
    (star) => reviews.filter((r) => r.rating === star).length,
  );
  const maxStarCount = Math.max(...starDistribution, 1);

  const ticker = getMarketTicker(project.slug);

  const statusColor = getStatusColor(project.status);
  const ctaLabel = project.website ? getCtaLabel(project.category) : null;

  const faqs = generateFaqs(project, dossierData);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.name,
          url: project.website || undefined,
          applicationCategory: "FinanceApplication",
          description: project.tagline || project.description || undefined,
        }}
      />
      <JsonLd data={faqSchema} />
      <BreadcrumbSchema
        items={[
          { name: "Projects", href: "https://perp.wiki/projects" },
          { name: project.name, href: `https://perp.wiki/projects/${project.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Home
        </Link>
        {" / "}
        <Link href="/projects" className="hover:text-[var(--hw-text-muted)] transition-colors">
          Projects
        </Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{project.name}</span>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <div
        className="relative rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6 sm:p-8 mb-8 overflow-hidden"
      >
        {/* Subtle gradient glow */}
        <div
          className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(circle at top right, var(--hw-green-glow), transparent 70%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-start gap-5">
          {/* Logo */}
          <ProjectLogo
            name={project.name}
            logoUrl={project.logoUrl}
            size="lg"
            className="border-2 border-[var(--hw-border)]"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-[var(--hw-text)]">
                  {project.name}
                  {project.isVerified && (
                    <span className="verified-badge" title="Verified project" aria-label="Verified">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </h1>
                {project.tagline && (
                  <p className="mt-1.5 text-base text-[var(--hw-text-muted)] max-w-xl">{project.tagline}</p>
                )}
              </div>
              <LayerBadge layer={project.layer} />
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium"
                style={{ borderRadius: "2px", color: statusColor, background: `color-mix(in srgb, ${statusColor} 10%, transparent)` }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: statusColor }} />
                {project.status}
              </span>
              <span
                className="px-2.5 py-1 text-xs text-[var(--hw-text-muted)]"
                style={{ borderRadius: "2px", background: "var(--hw-green-subtle)" }}
              >
                {project.category}
              </span>
              {project.isFeatured && (
                <span
                  className="px-2.5 py-1 text-xs font-medium"
                  style={{ borderRadius: "2px", background: "rgba(240,180,41,0.12)", color: "var(--hw-gold)" }}
                >
                  Featured
                </span>
              )}
              {project.launchYear && (
                <span className="px-2.5 py-1 text-xs text-[var(--hw-text-dim)]" style={{ borderRadius: "2px", background: "var(--hw-bg)" }}>
                  Since {project.launchDate || project.launchYear}
                </span>
              )}
            </div>

            {/* CTA + Social row */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {ctaLabel && project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-sm transition-all hover:opacity-90"
                  style={{
                    background: "var(--hw-green)",
                    color: "var(--hw-bg)",
                  }}
                >
                  {ctaLabel}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              )}

              {/* Social buttons */}
              <div className="flex items-center gap-1">
                {project.twitter && (
                  <a
                    href={project.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-sm border border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] transition-all"
                    title="X / Twitter"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-sm border border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] transition-all"
                    title="GitHub"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  </a>
                )}
                {project.discord && (
                  <a
                    href={project.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-sm border border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] transition-all"
                    title="Discord"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
                  </a>
                )}
                {project.telegram && (
                  <a
                    href={project.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-sm border border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] transition-all"
                    title="Telegram"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </a>
                )}
                {project.website && (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-sm border border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] transition-all"
                    title="Website"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" /></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== MAIN LAYOUT ========== */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content — 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          {/* Interactive Tabs */}
          <ProjectTabs
            description={project.description}
            dossier={dossierData}
            tags={tags}
            category={project.category}
            layer={project.layer}
            status={project.status}
            launchYear={project.launchYear}
            launchDate={project.launchDate}
            website={project.website}
            isVerified={project.isVerified}
            isFeatured={project.isFeatured}
          />

          {/* ===== CTA BANNER (mid-page) ===== */}
          {project.website && (
            <div
              className="rounded-sm border border-[var(--hw-border)] p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.03) 100%)",
              }}
            >
              <div>
                <p className="text-sm font-medium text-[var(--hw-text)]">
                  Ready to try {project.name}?
                </p>
                <p className="text-xs text-[var(--hw-text-dim)] mt-0.5">
                  {project.category} on Hyperliquid {project.layer !== "BOTH" ? `(${project.layer})` : ""}
                </p>
              </div>
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-sm transition-all hover:opacity-90 shrink-0"
                style={{ background: "var(--hw-green)", color: "var(--hw-bg)" }}
              >
                {ctaLabel || "Visit Website"}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          )}

          {/* ===== WEBSITE PREVIEW ===== */}
          {project.website && (
            <div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
                Website Preview
              </h2>
              <WebsitePreview url={project.website} name={project.name} />
            </div>
          )}

          {/* ===== FAQ SECTION ===== */}
          {faqs.length > 0 && (
            <div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
                  >
                    <h3 className="text-sm font-semibold text-[var(--hw-text)] mb-1.5">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== RELATED PROJECTS ===== */}
          {relatedProjects.length > 0 && (
            <div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
                Related in {project.category}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedProjects.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/projects/${rp.slug}`}
                    className="group rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 transition-all hover:border-[var(--hw-border-bright)]"
                  >
                    <div className="flex items-start gap-3">
                      <ProjectLogo name={rp.name} logoUrl={rp.logoUrl} size="md" className="mt-0.5" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                            {rp.name}
                          </span>
                          <LayerBadge layer={rp.layer} />
                        </div>
                        {rp.tagline && (
                          <p className="text-xs text-[var(--hw-text-dim)] mt-0.5 line-clamp-2">{rp.tagline}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ===== REVIEWS ===== */}
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--hw-text)] mb-4">
              Community Reviews
            </h2>

            {reviewCount > 0 ? (
              <>
                {/* Aggregate Rating + Star Distribution */}
                <div
                  className="rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5 mb-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Average score */}
                    <div className="text-center shrink-0">
                      <div className="font-[family-name:var(--font-jetbrains-mono)] text-3xl font-bold text-[var(--hw-text)]">
                        {avgRating.toFixed(1)}
                      </div>
                      <div className="flex gap-0.5 justify-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="text-sm"
                            style={{
                              color:
                                star <= Math.round(avgRating)
                                  ? "var(--hw-gold)"
                                  : "var(--hw-text-dim)",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--hw-text-dim)] mt-1">
                        {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Star distribution bars */}
                    <div className="flex-1 w-full space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = starDistribution[star - 1];
                        const pct = (count / maxStarCount) * 100;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-[var(--hw-text-dim)] w-3 text-right shrink-0">
                              {star}
                            </span>
                            <span className="text-xs shrink-0" style={{ color: "var(--hw-gold)" }}>★</span>
                            <div
                              className="flex-1 h-2.5 overflow-hidden"
                              style={{
                                borderRadius: "1px",
                                background: "var(--hw-bg)",
                              }}
                            >
                              <div
                                className="h-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  background: "var(--hw-gold)",
                                  borderRadius: "1px",
                                  opacity: count > 0 ? 0.8 : 0.2,
                                }}
                              />
                            </div>
                            <span className="text-xs text-[var(--hw-text-dim)] w-6 shrink-0">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="space-y-3 mb-6">
                  {reviews.slice(0, 10).map((review) => (
                    <div
                      key={review.id}
                      className="rounded-sm border border-[var(--hw-border)] p-4"
                      style={{
                        background: "linear-gradient(135deg, var(--hw-surface) 0%, rgba(0,229,160,0.01) 100%)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="text-sm"
                              style={{
                                color:
                                  star <= review.rating
                                    ? "var(--hw-gold)"
                                    : "var(--hw-text-dim)",
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-[var(--hw-text-dim)]">
                          {formatRelativeTime(review.createdAt)}
                        </span>
                      </div>
                      {review.content && (
                        <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed mb-3">
                          {review.content}
                        </p>
                      )}
                      <HelpfulButton
                        reviewId={review.id}
                        initialCount={review.helpfulCount}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div
                className="rounded-sm border border-dashed border-[var(--hw-border)] p-6 text-center mb-4"
              >
                <p className="text-sm text-[var(--hw-text-muted)] mb-1">
                  No reviews yet — be the first!
                </p>
                <p className="text-xs text-[var(--hw-text-dim)]">
                  Share your experience with {project.name} to help others in the community.
                </p>
              </div>
            )}

            <div
              className="rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4"
            >
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
                Leave a Review
              </h3>
              <ReviewForm projectId={project.id} />
            </div>

            {/* Suggestion Form */}
            <div className="mt-4">
              <SuggestionForm projectId={project.id} projectName={project.name} />
            </div>
          </div>
        </div>

        {/* ========== SIDEBAR ========== */}
        <div className="space-y-4">
          {/* Live Market Data */}
          {ticker && <LiveMarketCard coin={ticker} />}

          {/* Quick Actions */}
          <div className="rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
              Quick Links
            </h3>
            <div className="space-y-2">
              {project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full rounded-sm border border-[var(--hw-border)] px-3 py-2.5 text-sm text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" /></svg>
                  <span className="truncate">{getHostname(project.website)}</span>
                  <svg className="h-3 w-3 ml-auto shrink-0 text-[var(--hw-text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                </a>
              )}
              {project.twitter && (
                <a
                  href={project.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full rounded-sm border border-[var(--hw-border)] px-3 py-2.5 text-sm text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X / Twitter
                  <svg className="h-3 w-3 ml-auto shrink-0 text-[var(--hw-text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full rounded-sm border border-[var(--hw-border)] px-3 py-2.5 text-sm text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  GitHub
                  <svg className="h-3 w-3 ml-auto shrink-0 text-[var(--hw-text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                </a>
              )}
              {project.discord && (
                <a
                  href={project.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full rounded-sm border border-[var(--hw-border)] px-3 py-2.5 text-sm text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
                  Discord
                  <svg className="h-3 w-3 ml-auto shrink-0 text-[var(--hw-text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                </a>
              )}
              {project.telegram && (
                <a
                  href={project.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full rounded-sm border border-[var(--hw-border)] px-3 py-2.5 text-sm text-[var(--hw-text-muted)] transition-all hover:border-[var(--hw-green)] hover:text-[var(--hw-green)]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Telegram
                  <svg className="h-3 w-3 ml-auto shrink-0 text-[var(--hw-text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                </a>
              )}
            </div>
          </div>

          {/* Details card */}
          <div className="rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
              Project Details
            </h3>
            <dl className="space-y-2.5 text-sm">
              <InfoRow label="Layer" value={project.layer} />
              <InfoRow label="Category" value={project.category} />
              {project.launchYear && (
                <InfoRow label="Launched" value={project.launchDate || String(project.launchYear)} />
              )}
              <InfoRow label="Status" value={project.status} />
            </dl>
          </div>

          {/* Compare */}
          {relatedProjects.length > 0 && (
            <div className="rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4">
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
                Compare
              </h3>
              <div className="space-y-2">
                {relatedProjects.slice(0, 3).map((sp) => (
                  <Link
                    key={sp.slug}
                    href={`/compare/${project.slug}-vs-${sp.slug}`}
                    className="flex items-center gap-2 text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors"
                  >
                    <span className="text-[var(--hw-text-dim)]">vs</span>
                    {sp.name}
                    <svg className="h-3 w-3 ml-auto text-[var(--hw-text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Learn More */}
          {(() => {
            const learnArticles = getRelatedArticlesForCategory(project.category);
            if (learnArticles.length === 0) return null;
            return (
              <div className="rounded-sm border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3">
                  Learn More
                </h3>
                <div className="space-y-2">
                  {learnArticles.map((la) => (
                    <Link
                      key={la.slug}
                      href={`/learn/${la.slug}`}
                      className="flex items-start gap-2 text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-green)] transition-colors"
                    >
                      <svg className="h-4 w-4 shrink-0 mt-0.5 text-[var(--hw-text-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                      <span className="line-clamp-2">{la.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[var(--hw-text-dim)]">{label}</dt>
      <dd className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--hw-text-muted)]">
        {value}
      </dd>
    </div>
  );
}
