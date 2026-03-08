/**
 * apply-migrations.mjs
 *
 * Reads Prisma migration SQL files from prisma/migrations/ and applies them
 * to the production SQLite database (DATABASE_PATH env var).
 *
 * Uses a _prisma_migrations tracking table (same as Prisma) to avoid
 * re-applying migrations that have already been applied.
 */
import Database from "better-sqlite3";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const dbPath = process.env.DATABASE_PATH || path.resolve("dev.db");
const migrationsDir = path.resolve("prisma", "migrations");

console.log(`[migrations] Database: ${dbPath}`);
console.log(`[migrations] Migrations dir: ${migrationsDir}`);

const db = new Database(dbPath);

// Create tracking table if it doesn't exist (compatible with Prisma's format)
db.exec(`
  CREATE TABLE IF NOT EXISTS _prisma_migrations (
    id TEXT PRIMARY KEY,
    checksum TEXT NOT NULL DEFAULT '',
    finished_at TEXT,
    migration_name TEXT NOT NULL,
    logs TEXT,
    rolled_back_at TEXT,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    applied_steps_count INTEGER NOT NULL DEFAULT 0
  );
`);

// Get already-applied migrations
const applied = new Set(
  db.prepare("SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL")
    .all()
    .map(row => row.migration_name)
);

// Read migration directories (sorted alphabetically = chronological order)
const migrationDirs = readdirSync(migrationsDir)
  .filter(name => {
    const migrationSql = path.join(migrationsDir, name, "migration.sql");
    return existsSync(migrationSql);
  })
  .sort();

let appliedCount = 0;

for (const dirName of migrationDirs) {
  if (applied.has(dirName)) {
    console.log(`[migrations] Already applied: ${dirName}`);
    continue;
  }

  const sqlPath = path.join(migrationsDir, dirName, "migration.sql");
  const sql = readFileSync(sqlPath, "utf-8");
  const checksum = crypto.createHash("sha256").update(sql).digest("hex");

  console.log(`[migrations] Applying: ${dirName}`);

  const startedAt = new Date().toISOString();

  try {
    db.exec(sql);

    db.prepare(`
      INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(
      crypto.randomUUID(),
      checksum,
      new Date().toISOString(),
      dirName,
      startedAt
    );

    appliedCount++;
    console.log(`[migrations] Applied: ${dirName}`);
  } catch (err) {
    console.error(`[migrations] FAILED: ${dirName}`, err.message);
    process.exit(1);
  }
}

db.close();

if (appliedCount === 0) {
  console.log("[migrations] Database is up to date.");
} else {
  console.log(`[migrations] Applied ${appliedCount} migration(s).`);
}
