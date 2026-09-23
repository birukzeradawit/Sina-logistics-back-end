import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const staffLoginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"),
  prefix: "ratelimit:staff-login",
});

export const clientLoginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(8, "5 m"),
  prefix: "ratelimit:client-login",
});
