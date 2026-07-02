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
        max: 2, // Prevent pool exhaustion on Neon free tier (max 10 connections limit)
        connectionTimeoutMillis: 15000, // 15s to allow database cold start/wakeup
        idleTimeoutMillis: 15000, // Close idle connections sooner to free up slots
      });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({
        adapter,
        log: ["error"],
      });
    }

    if (connectionString.startsWith("prisma+postgres://")) {
      return new PrismaClient({
        accelerateUrl: connectionString,
        log: ["error"],
      });
    }
  }

  // Fallback — will fail loudly if DATABASE_URL is truly missing
  return new PrismaClient({
    log: ["error"],
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
