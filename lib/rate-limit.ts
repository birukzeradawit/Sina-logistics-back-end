import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let staffLoginLimiter: Ratelimit | null = null;
let clientLoginLimiter: Ratelimit | null = null;

try {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token && typeof url === "string" && url.startsWith("http")) {
    const redis = new Redis({ url, token });

    staffLoginLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "5 m"),
      prefix: "ratelimit:staff-login",
    });

    clientLoginLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, "5 m"),
      prefix: "ratelimit:client-login",
    });
  }
} catch (err) {
  console.warn("Upstash rate limiter initialization skipped:", err);
  staffLoginLimiter = null;
  clientLoginLimiter = null;
}

export async function checkStaffLoginRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (!staffLoginLimiter) return { success: true };
  try {
    return await staffLoginLimiter.limit(identifier);
  } catch (err) {
    console.warn("Staff rate limiter error, allowing login:", err);
    return { success: true };
  }
}

export async function checkClientLoginRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (!clientLoginLimiter) return { success: true };
  try {
    return await clientLoginLimiter.limit(identifier);
  } catch (err) {
    console.warn("Client rate limiter error, allowing login:", err);
    return { success: true };
  }
}

export { staffLoginLimiter, clientLoginLimiter };

