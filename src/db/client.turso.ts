// src/db/client.turso.ts
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

/** Use Turso (libSQL) remote database connection */
export function getTursoDb() {
  if (!db) {
    const url = process.env.TURSO_DATABASE_URL!;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    const client = createClient({ url, authToken });
    db = drizzle(client, { schema });
  }
  return db;
}
