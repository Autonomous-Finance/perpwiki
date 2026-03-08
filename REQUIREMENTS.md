# HyperWiki — Build Requirements
> Comprehensive specification for building hype.wiki — the definitive intelligence directory for the Hyperliquid ecosystem.
> Reference: pm.wiki (polywiki codebase) as architectural ancestor — same stack, completely different design.

---

## 1. What We're Building

**hype.wiki** — A curated, SEO-first wiki/directory of every project in the Hyperliquid ecosystem.

Think: what pm.wiki is for prediction markets → what hype.wiki will be for Hyperliquid.

**Why this exists:**
- Hyperliquid has $30B FDV and 100+ ecosystem projects
- The ONLY existing community resource is a GitHub markdown repo (not a real website)
- HYPE airdrop wave 2 is incoming → ecosystem will explode in projects and users
- Community desperately needs an organized discovery layer

**NOT another generic crypto directory.** This is deeply specific to the Hyperliquid ecosystem — the language, categories, and framing should feel native to someone who lives on Hyperliquid CT.

---

## 2. Design System — Hyperliquid-Adjacent, NOT a Clone

### Color Palette (Hyperliquid-inspired but our own system)
Hyperliquid uses: very dark navy backgrounds, neon green accents, clean sans-serif typography.
We borrow the vibe but make it our own:

```css
/* Core palette — do NOT use these exact tokens, derive our own names */
--hl-void: #080C10;           /* deepest background — darker than Hyperliquid's own dark */
--hl-surface: #0D1117;        /* card/panel background */
--hl-surface-raised: #131920; /* elevated elements */
--hl-border: #1E2832;         /* subtle borders */
--hl-border-bright: #2A3A4A;  /* active/hover borders */

/* Green spectrum — our signature, adjacent to HL's green */
--hl-green: #00E5A0;          /* primary accent — Hyperliquid's signature neon green */
--hl-green-dim: #00B87D;      /* darker variant */  
--hl-green-glow: rgba(0,229,160,0.15); /* glow effect */
--hl-green-subtle: rgba(0,229,160,0.08); /* very subtle bg tint */

/* Secondary tones */
--hl-cyan: #00C8E0;           /* secondary accent */
--hl-gold: #F0B429;           /* premium/featured indicator */
--hl-red: #FF4D6A;            /* risk/warning */

/* Text */
--hl-text: #E8F4F0;           /* primary text — slightly green-tinted white */
--hl-text-muted: #7A9A8E;     /* secondary text */
--hl-text-dim: #3D5A52;       /* very muted */

/* Tier colors */
--hl-tier-core: #00E5A0;      /* HyperCore layer */
--hl-tier-evm: #00C8E0;       /* HyperEVM layer */
--hl-tier-hip3: #A78BFA;      /* HIP-3 markets */
--hl-tier-tools: #F0B429;     /* tools/analytics */
```

### Typography
- **Display font**: `Space Grotesk` (modern, techy, feels crypto-native)
- **Body font**: `Inter` (readable, clean)
- **Mono**: `JetBrains Mono` (code, addresses, numbers)
- No serifs. No Bootstrap. No rounded-everything.

### Visual Language
- **Dark by default** (no light mode, period — this is a crypto platform)
- **Subtle green gradients** as section dividers, not boxes
- **Glowing borders** on hover states — `box-shadow: 0 0 12px rgba(0,229,160,0.3)`
- **Scanlines aesthetic** subtly applied to hero — like a trading terminal
- **Data-dense** — not sparse whitespace but organized information density
- **Numbers formatted like a terminal** — monospace, right-aligned
- Grid cards should feel like a trading dashboard, not a marketing page
- Category pills: sharp corners or very subtle radius (2px max) — not round

### What to AVOID (pm.wiki patterns to NOT copy)
- No purple/blue gradient (pm.wiki colors)
- No rounded card corners > 4px
- No light backgrounds
- No "clean startup" whitespace aesthetic
- No generic Lucide icons (this is a fresh codebase — build custom from scratch)
- Don't copy any component code from pm.wiki — rethink each one for this context

---

## 3. Tech Stack (same as pm.wiki — proven)

```
Next.js 15+ (App Router, TypeScript strict)
React 19
Prisma + better-sqlite3 (SQLite)
Tailwind CSS v4
Litestream → S3 (continuous backup, same as pm.wiki)
pnpm (required — NOT npm or yarn)
```

### Deployment Target (same pattern as pm.wiki)
- Docker container on Hetzner Runner
- Litestream sidecar for S3 backup
- Traefik reverse proxy
- Dokploy orchestration
- **Local dev port: 4000** (`PORT=4000 pnpm dev`)

---

## 4. Data Model

### Core entities (Prisma schema)

```prisma
model Project {
  id            String    @id @default(cuid())
  slug          String    @unique
  name          String
  tagline       String?
  description   String?
  website       String?
  twitter       String?
  github        String?
  discord       String?
  telegram      String?
  logoUrl       String?
  
  // Hyperliquid-specific classification
  layer         Layer     @default(BOTH)        // HYPERCORE | HYPEREVM | BOTH | HIP3
  category      String                          // see category list below
  tags          String    @default("[]")        // JSON array
  status        Status    @default(ACTIVE)      // ACTIVE | BETA | DEPRECATED | DEAD
  
  launchYear    Int?
  launchDate    String?   // "2024-Q3" format when exact date unknown
  
  // Quality signals  
  isVerified    Boolean   @default(false)       // team confirmed presence
  isFeatured    Boolean   @default(false)
  isHip3        Boolean   @default(false)       // built on HIP-3
  
  // Submission
  submittedBy   String?
  approvalStatus ApprovalStatus @default(APPROVED)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  dossier       Dossier?
  reviews       Review[]
  suggestions   Suggestion[]
}

model Dossier {
  id              String   @id @default(cuid())
  projectId       String   @unique
  project         Project  @relation(fields: [projectId], references: [id])
  
  seedId          String   @unique
  entityName      String
  schemaVersion   String   @default("2.0")
  dossierJson     String   // full v2.0 JSON blob
  qualityScore    Float    @default(0.0)
  readyToPublish  Boolean  @default(false)
  
  importedAt      DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Review {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  
  rating      Int      // 1-5
  content     String?
  authorId    String?
  isPublished Boolean  @default(false)
  
  createdAt   DateTime @default(now())
}

model Suggestion {
  id           String   @id @default(cuid())
  projectId    String?
  project      Project? @relation(fields: [projectId], references: [id])
  
  field        String?
  value        String?
  type         String?
  status       String   @default("pending")
  
  createdAt    DateTime @default(now())
}

enum Layer {
  HYPERCORE
  HYPEREVM
  HIP3
  BOTH
}

enum Status {
  ACTIVE
  BETA
  DEPRECATED
  DEAD
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## 5. Category System (Hyperliquid-native)

These are the exact categories to use — designed for the Hyperliquid ecosystem:

### HyperCore Layer (native on-chain perp orderbook)
- `Trading Terminals & Interfaces` — front-ends for HyperCore perps
- `Trading Bots & Automation` — automated strategies on HyperCore  
- `Analytics & Data` — volume, OI, PnL, leaderboard analytics
- `Portfolio Trackers` — position monitoring tools

### HyperEVM Layer (EVM smart contracts on Hyperliquid L1)
- `Liquid Staking` — stHYPE, kHYPE, LHYPE protocols
- `Lending & Borrowing` — overcollateralized debt on HyperEVM
- `Decentralized Exchanges` — spot DEXs on HyperEVM
- `Yield & Vaults` — strategy vaults, yield optimizers
- `Bridges & Cross-Chain` — moving assets onto/off Hyperliquid
- `Wallets & Account Abstraction`

### HIP-3 Markets (permissionless custom perp markets)
- `Prediction Markets` — probability markets built on HIP-3 (Ultra Markets, HyperOdd)
- `RWA Perps` — real-world asset perpetuals
- `Event Contracts` — event-based settlement markets
- `Meme Perps` — memecoin perpetual markets

### Ecosystem Infrastructure
- `Oracles` — price feeds for HyperEVM protocols
- `SDKs & Developer Tools` — building on Hyperliquid
- `Security & Audits` — audit firms, monitoring
- `Data APIs` — programmatic data access

### Community & Social
- `Communities & DAOs`
- `Media & Education`
- `Airdrop Trackers`

---

## 6. Pages & Routes

```
/                          Homepage — featured projects, stats, category nav
/projects                  Full directory with filters
/projects/[slug]           Project detail page (classic view OR dossier view)
/category/[slug]           Category page — all projects in a category
/layer/hypercore           All HyperCore projects
/layer/hyperevm            All HyperEVM projects  
/layer/hip3                All HIP-3 projects
/learn                     Learning hub index
/learn/[slug]              Individual learn article
/ecosystem                 Visual ecosystem map
/compare/[slug-vs-slug]    Compare two projects side by side
/data                      Live Hyperliquid stats (TVL, volume, OI from public API)
/submit                    Submit a new project
/admin                     Admin panel (protected)
/api/admin/*               Admin API (same pattern as pm.wiki)
/api/og                    OG image generation
/sitemap.xml               Auto-generated sitemap
/robots.txt                Crawler config
```

---

## 7. Homepage Design

The homepage is the crown jewel. It should feel like a **trading terminal crossed with a wiki**.

### Hero Section
- Full-width dark hero with subtle scanline texture (CSS, not image)
- Large heading: "The Hyperliquid Ecosystem" in Space Grotesk, bold
- Subheading: "Every project. Every layer. One place." 
- Live stats bar directly below: Total Projects | HyperCore | HyperEVM | HIP-3 | Total TVL (from public API)
- Pulsing green dot next to "Live" stats indicator
- Search bar: prominent, centered, glass-morphism style with green border on focus

### Layer Navigator  
Three distinct panels for HYPERCORE / HYPEREVM / HIP-3:
- Each with its tier color
- Project count
- Featured 3 projects as mini-cards
- "Explore →" link

### Featured Projects Grid
- 6-9 cards, verified projects first
- Each card: logo + name + layer badge (CORE/EVM/HIP-3) + one-liner + category tag
- Dark card background with green border on hover + glow effect
- NO star ratings shown on homepage — leads with content

### Category Browse
- Similar to pm.wiki but styled as a sidebar nav, not a grid
- Group by LAYER first, then category within layer
- Count badges

### Learn Hub Teaser
- 3 featured learn articles
- Terminal-styled preview cards

### Live Data Strip (if Hyperliquid public API available)
- Scrolling ticker of top HyperCore perp prices + 24h change
- Updates every 30s
- Green for positive, red for negative

---

## 8. Project Detail Page

Two modes:
1. **Classic view** (no dossier): standard data table — name, tagline, description, links, layer, category, launch year, team, tags
2. **Dossier view** (if dossier exists, readyToPublish=true): rich Wikipedia-style content

### Dossier view tabs:
- **Overview**: summary, key facts table, timeline strip (horizontal scroll), feature highlights
- **Deep Dive**: full feature list, use cases, comparisons table, risk checklist
- **Evidence**: sources list with freshness indicators, data completeness ring

### Dossier visual style:
- Section headers with custom Hyperliquid-themed SVG icons (NOT Lucide)
- Timeline: horizontal strip with green node dots at each event
- Risk items: color-coded severity (green/yellow/red)
- Source freshness: terminal-style timestamp formatting

---

## 9. Learn Hub

Learning articles covering the Hyperliquid ecosystem. These are SEO goldmines.

### Seed articles to create on launch:
1. "What is Hyperliquid? The Complete Guide 2026"
2. "HyperCore vs HyperEVM: What's the Difference?"
3. "What is HIP-3? Permissionless Perp Markets Explained"
4. "Best Hyperliquid Trading Terminals Compared"
5. "Hyperliquid Liquid Staking: stHYPE vs kHYPE vs LHYPE"
6. "How to Bridge to Hyperliquid"
7. "Hyperliquid Airdrop Guide: How to Farm HYPE Wave 2"
8. "HyperEVM DeFi: Best Protocols by TVL"

### Article structure:
- `LearnArticleLayout` with sticky TOC + prev/next navigation
- Inline `ProjectMention` chips for any project referenced
- `ComparisonCTA` blocks every 3-4 sections ("Compare these protocols →")
- Article JSON-LD schema
- OG image per article

---

## 10. Ecosystem Map Page (`/ecosystem`)

An interactive visual showing how all the layers connect:
- Static SVG/CSS diagram (NOT a force-graph library — too heavy)
- Three layers visible: HyperCore → HyperEVM → HIP-3
- Each layer shows top projects as nodes
- Lines showing which HyperEVM projects plug into HyperCore
- Color-coded by category
- Clicking a node → project page
- This is a SEO magnet — "hyperliquid ecosystem map" is a searched term

---

## 11. Live Data Page (`/data`)

Pull from Hyperliquid's public REST API:
- Top perp markets: name, mark price, 24h volume, OI, funding rate
- Protocol stats: total open interest, 24h volume, total unique traders
- Top gainers/losers (24h)

Hyperliquid public API:
- Info endpoint: `https://api.hyperliquid.xyz/info`
- POST body: `{"type": "meta"}` for market metadata
- POST body: `{"type": "metaAndAssetCtxs"}` for live prices + OI

---

## 12. Admin API (same pattern as pm.wiki)

```
GET  /api/admin/projects          List all projects
GET  /api/admin/projects?status=pending   Pending submissions
GET  /api/admin/projects/[slug]   Get project
PATCH /api/admin/projects/[slug]  Update project fields
PUT  /api/admin/dossiers/[projectId]   Upsert dossier (S3-as-authority pattern)
POST /api/admin/projects/[slug]/logo    Upload logo (download → S3 → DB)
GET  /api/admin/suggestions       List suggestions
POST /api/admin/suggestions/[id]/approve
POST /api/admin/suggestions/[id]/reject
GET  /api/admin/stats             Dashboard stats
```

Auth: `Authorization: Bearer <ADMIN_API_KEY>` (set in .env)

---

## 13. SEO Requirements

Every page must have:
- Unique `<title>` with keyword + "| HYPE.WIKI"  
- `<meta description>` 120-160 chars
- `og:title`, `og:description`, `og:image` (custom generated)
- `twitter:card: "summary_large_image"`
- Canonical URL
- JSON-LD structured data (appropriate schema per page type)

OG images:
- Dark background (--hl-void)
- Green accent
- Project logo if available
- Project name + category badge
- "HYPE.WIKI" branding in corner

Sitemap:
- Auto-generated at `/sitemap.xml`
- Homepage, all project pages, all category pages, all learn articles
- Priority: homepage 1.0, projects 0.8, categories 0.7, learn 0.7

robots.txt:
- Block AI crawlers (GPTBot, anthropic-ai, ClaudeBot, etc.)
- Allow all search engine crawlers

---

## 14. Seed Data — Projects to Seed

Initialize with these known projects (research each one properly):

### HyperCore
- Hyperliquid (the DEX itself — meta entry)
- HyperBeat (analytics)
- Predicade (whale tracking terminal)
- Betmoar (prediction interface using HL data)

### Liquid Staking (HyperEVM)
- Kinetiq (kHYPE — largest liquid staking)
- Felix (feHYPE)  
- Liminal (stHYPE)
- Looped HYPE
- Gliquid (gHYPE)

### Lending (HyperEVM)
- HyperLend
- Felix (also a lending protocol)
- Hypurr.fi

### DEXs (HyperEVM)
- HyperSwap (if exists)

### HIP-3 Markets
- Ultra Markets (10x leveraged prediction markets)
- HyperOdd (leveraged markets on Hyperliquid HIP-3)
- Ventuals (first HIP-3 VC prediction market)

### Analytics
- HyperBeat
- Coinpilot
- Hyperbloom

### Bridges
- HyperBridge (if exists)

### Wallets
- dotHYPE

---

## 15. Build Stages

### Stage 1 — Foundation (DO THIS FIRST)
Goal: Running skeleton on port 4000 with real data

1. Initialize Next.js 15 project with TypeScript strict + Tailwind v4 + pnpm
2. Set up Prisma schema (models above) + SQLite
3. Design system: CSS variables, fonts (Space Grotesk + Inter from Google Fonts), global styles
4. Basic layout: Header (nav), Footer, dark background
5. Seed 20-30 projects with real data (research each one — don't make up data)
6. Homepage: hero + live stats + layer navigator + project grid + category browse
7. Project detail page: classic view working
8. `/projects` listing with filters (layer, category, search)
9. Admin API: GET/PATCH projects endpoint
10. Sitemap + robots.txt
11. `PORT=4000 pnpm dev` works

### Stage 2 — Content & SEO
1. Learn hub: `/learn` index + 3 seed articles (at minimum: "What is Hyperliquid", "HyperCore vs HyperEVM", "What is HIP-3")
2. Category pages: `/category/[slug]` with proper metadata
3. Layer pages: `/layer/hypercore`, `/layer/hyperevm`, `/layer/hip3`
4. OG image generation (Satori-based, dark + green design)
5. Full JSON-LD on all pages
6. Compare page: `/compare/[slug-vs-slug]`

### Stage 3 — Rich Features
1. Dossier system (v2.0 schema, same as pm.wiki)
2. Ecosystem map page
3. Live data page (Hyperliquid API integration)
4. User submissions (`/submit`)
5. Review system

---

## 16. Custom Icon System

Do NOT use Lucide. Build custom SVG icons from scratch.
Each icon should feel like it was designed for a perp trading platform:

- `LayerCoreIcon` — orderbook-style visualization (bid/ask stacks)
- `LayerEvmIcon` — circuit with smart contract nodes
- `LayerHip3Icon` — a cone (prediction cone) with perp line through it  
- `LiquidStakingIcon` — HYPE token being "staked" into a vault
- `LendingIcon` — two nodes with collateral/debt flows
- `AnalyticsIcon` — PnL curve with data points
- `BridgeIcon` — arch bridge with data packets crossing
- `TerminalIcon` — screen with orderbook + cursor
- `TimelineIcon` — horizontal timeline nodes
- `RiskIcon` — volatility curve with shaded downside area
- `FeaturesIcon` — matrix of capability checkboxes
- `SourcesIcon` — data stack with verification mark

---

## 17. Key Differences from pm.wiki / canton.wiki

| Feature | pm.wiki | hype.wiki |
|---|---|---|
| Domain context | Prediction markets | Hyperliquid ecosystem |
| Primary dimension | Category | **Layer** (Core/EVM/HIP-3) |
| Color scheme | Purple/dark | **Dark navy + neon green** |
| Typography | System sans | **Space Grotesk + JetBrains Mono** |
| Design feel | Clean editorial | **Trading terminal** |
| Live data | None | **Hyperliquid API ticker** |
| Key unique page | Ecosystem pulse | **Ecosystem map + Live data** |
| Icons | Custom SVG (new) | **Custom SVG (different set)** |
| Card style | Rounded corners | **Sharp/minimal radius** |

---

## 18. Environment Variables

```env
DATABASE_URL="file:./dev.db"
ADMIN_API_KEY="generate-a-strong-secret-here"
NEXT_PUBLIC_SITE_URL="http://localhost:4000"
SITE_NAME="hype.wiki"
LITESTREAM_ACCESS_KEY_ID=""   # fill for production
LITESTREAM_SECRET_ACCESS_KEY="" # fill for production
S3_ENDPOINT=""                # fill for production  
S3_BUCKET="sqlite-backup"
S3_PATH="db_backups/hyperwiki/production.sqlite3"
```

---

## 19. First Run Target

When Stage 1 is complete, running `PORT=4000 pnpm dev` from `/home/cloudbeams/workspace/hyperwiki` should show:

- Dark navy homepage with green accents
- "The Hyperliquid Ecosystem" hero
- Live project count stat
- 3 layer cards (HyperCore / HyperEVM / HIP-3) with project counts
- 20+ seeded projects browseable by layer and category
- Search working
- Individual project pages working
- Mobile responsive (hamburger nav on mobile)
- No console errors

---

## 20. Notification on Completion

When Stage 1 is fully working and `PORT=4000 pnpm dev` serves the site:

```bash
openclaw system event --text "HyperWiki Stage 1 complete — running on port 4000. $(curl -s -o /dev/null -w '%{http_code}' http://localhost:4000/) HTTP status" --mode now
```
