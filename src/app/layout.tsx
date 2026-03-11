import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000"),
  title: {
    default: "perp.wiki — Hyperliquid Ecosystem Intelligence",
    template: "%s | perp.wiki",
  },
  description:
    "Discover, compare, and research every project building on Hyperliquid. The independent intelligence directory for HyperCore, HyperEVM, and HIP-3.",
  openGraph: {
    title: "perp.wiki — Hyperliquid Ecosystem Intelligence",
    description:
      "The independent intelligence directory for the Hyperliquid ecosystem.",
    siteName: "perp.wiki",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "https://perp.wiki",
    languages: { "en": "https://perp.wiki" },
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Hyperliquid",
    "HyperEVM",
    "HyperCore",
    "perp DEX",
    "perpetual futures",
    "DeFi",
    "liquid staking",
    "HYPE token",
    "funding rates",
    "HLP vault",
    "ecosystem directory",
  ],
  category: "DeFi",
  creator: "perp.wiki",
  publisher: "perp.wiki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "perp.wiki",
              "url": "https://perp.wiki",
              "description": "The definitive Hyperliquid ecosystem directory — tracking every DeFi protocol, DEX, LST, and tool on HyperEVM and HyperCore.",
              "logo": "https://perp.wiki/icon.svg",
              "sameAs": [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "perp.wiki",
              "url": "https://perp.wiki",
              "description": "Independent directory for the Hyperliquid ecosystem and perpetual futures trading",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://perp.wiki/projects?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <link rel="dns-prefetch" href="https://api.hyperliquid.xyz" />
        <link rel="alternate" type="application/rss+xml" title="perp.wiki RSS Feed" href="/feed.xml" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
