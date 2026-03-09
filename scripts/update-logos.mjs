import Database from "better-sqlite3";

const DB_PATH = process.env.DATABASE_PATH || "prisma/dev.db";
const db = new Database(DB_PATH);

// Hardcoded known logos
const KNOWN_LOGOS = {
  "hyperliquid": "https://unavatar.io/twitter/HyperliquidX",
  "hlp": "https://unavatar.io/twitter/HyperliquidX",
  "purr": "https://unavatar.io/twitter/Hy_Purr_liquid",
  "felix-protocol": "https://unavatar.io/twitter/FelixProtocol",
  "kinetiq": "https://unavatar.io/twitter/kinetiq_xyz",
  "hyperlend": "https://unavatar.io/twitter/HyperLend_xyz",
  "hyperbeat": "https://unavatar.io/twitter/HyperBeat_xyz",
  "liminal": "https://unavatar.io/twitter/liminal_xyz",
  "unit-protocol": "https://unavatar.io/twitter/HyperUnit",
  "hypurr-fun": "https://unavatar.io/twitter/hypurrfun",
  "hyperps": "https://unavatar.io/twitter/hyperps_xyz",
};

const updateStmt = db.prepare("UPDATE Project SET logoUrl = ? WHERE slug = ?");

// 1. Apply hardcoded known logos
let knownCount = 0;
for (const [slug, logoUrl] of Object.entries(KNOWN_LOGOS)) {
  const result = updateStmt.run(logoUrl, slug);
  if (result.changes > 0) {
    console.log(`[known] ${slug} → ${logoUrl}`);
    knownCount++;
  }
}
console.log(`Updated ${knownCount} projects from known logos map.\n`);

// 2. For projects with twitter but no logoUrl, derive from handle
const projectsWithTwitter = db
  .prepare("SELECT slug, twitter FROM Project WHERE twitter IS NOT NULL AND twitter != '' AND (logoUrl IS NULL OR logoUrl = '')")
  .all();

let derivedCount = 0;
for (const project of projectsWithTwitter) {
  const twitterUrl = project.twitter;
  // Extract handle from URL like https://twitter.com/handle or https://x.com/handle
  const match = twitterUrl.match(/(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)/);
  if (match) {
    const handle = match[1];
    const logoUrl = `https://unavatar.io/twitter/${handle}`;
    updateStmt.run(logoUrl, project.slug);
    console.log(`[derived] ${project.slug} → ${logoUrl}`);
    derivedCount++;
  }
}
console.log(`\nDerived ${derivedCount} logos from twitter handles.`);
console.log(`Total updates: ${knownCount + derivedCount}`);

db.close();
