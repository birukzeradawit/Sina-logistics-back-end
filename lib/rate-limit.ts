import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Login attempts are rate-limited per IP+email combo, separately for staff
// and client logins, so a brute-force attempt against one doesn't get more
// budget by targeting the other. Requires a free Upstash Redis instance —
// see README for setup. Swap for any Redis-backed limiter if you're not on
// Upstash.

const redis = Redis.fromEnv();

export const staffLoginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"), // 5 attempts per 5 minutes
  prefix: "ratelimit:staff-login",
});

export const clientLoginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(8, "5 m"), // slightly more lenient — more users, lower privilege
  prefix: "ratelimit:client-login",
});

// Usage in an auth `authorize()` callback:
//
//   const key = `${ip}:${email}`;
//   const { success } = await staffLoginLimiter.limit(key);
//   if (!success) throw new Error("Too many attempts. Try again in a few minutes.");
