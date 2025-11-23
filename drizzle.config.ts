import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "turso",
  out: "./src/db/drizzle",
  dbCredentials: {
    url: "http://127.0.0.1:8080"
    // url: process.env.TURSO_DATABASE_URL!,
    // authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
