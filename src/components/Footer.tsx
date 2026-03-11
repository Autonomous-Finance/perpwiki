import Link from "next/link";

const exploreLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Categories", href: "/categories" },
  { label: "Markets", href: "/markets" },
  { label: "Funding Rates", href: "/funding-rates" },
  { label: "Stats", href: "/stats" },
  { label: "Trending", href: "/trending" },
  { label: "Compare", href: "/compare" },
  { label: "Tools", href: "/tools" },
];

const learnLinks = [
  { label: "Learn Hub", href: "/learn" },
  { label: "Glossary", href: "/glossary" },
  { label: "FAQ", href: "/faq" },
  { label: "What is Hyperliquid?", href: "/learn/what-is-hyperliquid" },
  { label: "What is HyperEVM?", href: "/learn/what-is-hyperevm" },
  { label: "Staking Guide", href: "/learn/hyperliquid-staking-guide" },
];

const ecosystemLinks = [
  { label: "HyperCore Layer", href: "/layer/hypercore" },
  { label: "HyperEVM Layer", href: "/layer/hyperevm" },
  { label: "HIP-3 Projects", href: "/layer/hip3" },
  { label: "Submit Project", href: "/submit" },
  { label: "About", href: "/about" },
];

const networkLinks = [
  { label: "pm.wiki — Prediction Markets", href: "https://pm.wiki" },
  { label: "canton.wiki — Canton Network", href: "https://canton.wiki" },
  { label: "polyguana.com — Analytics", href: "https://polyguana.com" },
];

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--hw-text)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--hw-text-muted)] transition-colors duration-150 hover:text-[var(--hw-green)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--hw-border)] bg-[var(--hw-surface)]">
      {/* Main footer columns */}
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-widest text-[var(--hw-text)]">
                PERP<span className="font-light text-[var(--hw-green)]">.</span>WIKI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--hw-text-dim)]">
              The definitive Hyperliquid ecosystem directory. Tracking every
              DeFi protocol, DEX, LST, lending platform, and tool on HyperEVM
              and HyperCore.
            </p>
            <p className="mt-3 text-xs text-[var(--hw-text-dim)]">
              Independent. Not affiliated with Hyperliquid Labs.
            </p>
            {/* Social links */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://x.com/perpwiki"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-8 w-8 rounded-sm border border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:text-[var(--hw-green)] hover:border-[var(--hw-green)] transition-colors"
                title="Follow @perpwiki on X"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <FooterLinkColumn title="Explore" links={exploreLinks} />

          {/* Column 3: Learn */}
          <FooterLinkColumn title="Learn" links={learnLinks} />

          {/* Column 4: Ecosystem */}
          <FooterLinkColumn title="Ecosystem" links={ecosystemLinks} />

          {/* Column 5: Network */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--hw-text)]">
              Network
            </h3>
            <ul className="mt-4 space-y-2.5">
              {networkLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--hw-text-muted)] transition-colors duration-150 hover:text-[var(--hw-green)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-[var(--hw-green)] transition-colors duration-150 hover:underline"
                >
                  Submit a Project
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--hw-border)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="text-xs text-[var(--hw-text-dim)]">
            &copy; 2026 perp.wiki &mdash; The Hyperliquid Ecosystem Directory
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs text-[var(--hw-text-dim)]">
              <a href="/feed.xml" className="hover:text-[var(--hw-green)] transition-colors">RSS</a>
              <span className="text-[var(--hw-border)]">·</span>
              <a href="/llms.txt" className="hover:text-[var(--hw-green)] transition-colors">llms.txt</a>
              <span className="text-[var(--hw-border)]">·</span>
              <a href="/sitemap.xml" className="hover:text-[var(--hw-green)] transition-colors">Sitemap</a>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-[var(--hw-text-dim)] lg:text-right">
              Live market data, funding rates, and project research updated daily.
            </p>
            {/* Scroll to top */}
            <a
              href="#main-content"
              className="shrink-0 flex items-center justify-center h-8 w-8 rounded-sm border border-[var(--hw-border)] text-[var(--hw-text-dim)] hover:text-[var(--hw-green)] hover:border-[var(--hw-green)] transition-colors"
              aria-label="Scroll to top"
              title="Back to top"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
