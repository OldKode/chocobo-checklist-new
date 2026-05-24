import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: ".env.local", override: true });
loadEnv();

const cliDatabaseUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@127.0.0.1:5432/chocobo?sslmode=require";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma CLI should bypass Neon's pooler when applying migrations.
    url: cliDatabaseUrl,
  },
});
