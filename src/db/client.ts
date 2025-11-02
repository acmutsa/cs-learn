// src/db/client.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const g = globalThis as unknown as { _db?: ReturnType<typeof drizzle> };

export function getDb() {
  if (!g._db) {
    const sqlite = new Database("./data/app.db", { fileMustExist: false });
    sqlite.pragma("foreign_keys = ON");
    g._db = drizzle(sqlite, { schema });
  }
  return g._db;
}
