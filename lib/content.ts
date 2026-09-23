import { unstable_cache } from "next/cache";
import { prisma } from "./db";

const contentCache = new Map<string, { data: Record<string, string>; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000;

export async function getContentMap(page: string): Promise<Record<string, string>> {
  const cached = contentCache.get(page);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const blocks = await prisma.contentBlock.findMany({ where: { page } });
    const data = Object.fromEntries(blocks.map((b: any) => [b.key, b.value]));
    contentCache.set(page, { data, timestamp: now });
    return data;
  } catch (err) {
    console.error(`[lib/content] Failed to fetch content for page ${page}:`, err);
    return cached ? cached.data : {};
  }
}

export function invalidateContentCache() {
  contentCache.clear();
}

export function cms(map: Record<string, string>, key: string, fallback: string) {
  const value = map[key]?.trim();
  return value ? value : fallback;
}

export function splitHeading(text: string) {
  const i = text.lastIndexOf(" ");
  if (i < 0) return { start: text, accent: "" };
  return { start: text.slice(0, i), accent: text.slice(i + 1) };
}
