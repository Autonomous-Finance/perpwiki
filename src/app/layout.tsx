import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "perp.wiki",
              "url": "https://perp.wiki",
              "description": "The definitive Hyperliquid ecosystem directory — tracking every DeFi protocol, DEX, LST, and tool on HyperEVM and HyperCore.",
              "sameAs": [],
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
