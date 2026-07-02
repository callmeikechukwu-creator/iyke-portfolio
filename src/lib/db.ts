import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  // Read at call time so Next.js has already loaded .env.local
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    if (connectionString.startsWith("postgres://") || connectionString.startsWith("postgresql://")) {
      const pool = new pg.Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    }

    if (connectionString.startsWith("prisma+postgres://")) {
      return new PrismaClient({
        accelerateUrl: connectionString,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    }
  }

  // Fallback — will fail loudly if DATABASE_URL is truly missing
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
