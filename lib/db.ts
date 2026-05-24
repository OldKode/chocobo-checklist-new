import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: connectionString });
  return new PrismaClient({ adapter });
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
