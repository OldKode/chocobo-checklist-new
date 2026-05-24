import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    "postgresql://placeholder:placeholder@127.0.0.1:5432/chocobo?sslmode=require"
  );
}

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: getDatabaseUrl() });
  return new PrismaClient({ adapter });
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function getPrismaClient() {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }

  return global.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
