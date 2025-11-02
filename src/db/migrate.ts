// src/db/migrate.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

async function main() {
  const sqlite = new Database("./data/app.db");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations applied");
}
main().catch((e) => { console.error(e); process.exit(1); });
