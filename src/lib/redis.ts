import { Redis } from "@upstash/redis";

interface RedisClientType {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any, options?: { ex?: number }): Promise<string>;
  incr(key: string): Promise<number>;
  del(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
}

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redisClient: RedisClientType;

if (url && token) {
  try {
    redisClient = new Redis({ url, token }) as unknown as RedisClientType;
  } catch (error) {
    console.error("Failed to initialize Upstash Redis client:", error);
    redisClient = createMockRedis();
  }
} else {
  redisClient = createMockRedis();
}

function createMockRedis(): RedisClientType {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[Redis] Upstash Redis credentials not configured. Using local mock client.");
  }
  
  const store = new Map<string, any>();

  return {
    get: async <T = any>(key: string): Promise<T | null> => {
      const val = store.get(key);
      return val !== undefined ? (val as T) : null;
    },
    set: async (key: string, value: any, options?: { ex?: number }): Promise<string> => {
      store.set(key, value);
      return "OK";
    },
    incr: async (key: string): Promise<number> => {
      const current = store.get(key) || 0;
      const next = Number(current) + 1;
      store.set(key, next);
      return next;
    },
    del: async (key: string): Promise<number> => {
      const existed = store.has(key);
      store.delete(key);
      return existed ? 1 : 0;
    },
    expire: async (key: string, seconds: number): Promise<number> => {
      // Return 1 indicating the timeout was set successfully
      return 1;
    },
  };
}

export const redis = redisClient;
