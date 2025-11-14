// src/db/migrate.turso.ts
import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

async function main() {
  const url = process.env.TURSO_DATABASE_URL!;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const client = createClient({ url, authToken });
  const db = drizzle(client);
  console.log("TURSO_DATABASE_URL:", process.env.TURSO_DATABASE_URL);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Turso migrations applied");
  
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
