import { unstable_cache } from "next/cache";
import { prisma } from "./db";

const contentCache = new Map<string, { data: Record<string, string>; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000;

export async function getContentMap(page: string): Promise<Record<string, string>> {
  try {
    const blocks = await prisma.contentBlock.findMany({ where: { page } });
    const data = Object.fromEntries(blocks.map((b: any) => [b.key, b.value ?? ""]));
    return data;
  } catch (err) {
    console.error(`[lib/content] Failed to fetch content for page ${page}:`, err);
    return {};
  }
}

export function invalidateContentCache() {
  contentCache.clear();
}

export function cms(map: Record<string, string>, key: string, fallback: string) {
  if (key in map) {
    return map[key];
  }
  return fallback;
}

export function splitHeading(text: string) {
  if (!text) return { start: "", accent: "" };
  const i = text.lastIndexOf(" ");
  if (i < 0) return { start: text, accent: "" };
  return { start: text.slice(0, i), accent: text.slice(i + 1) };
}
