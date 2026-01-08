import { Redis } from "@upstash/redis";

// Check if Redis credentials are provided
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redisClient: Redis | null = null;

if (redisUrl && redisToken) {
  redisClient = new Redis({
    url: redisUrl,
    token: redisToken,
  });
} else {
  console.warn(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not defined. Caching will be disabled."
  );
}

export const redis = redisClient;
