import { unstable_cache } from "next/cache";
import { prisma } from "./db";

export async function getContentMap(page: string): Promise<Record<string, string>> {
  return unstable_cache(
    async () => {
      const blocks = await prisma.contentBlock.findMany({ where: { page } });
      return Object.fromEntries(blocks.map((b) => [b.key, b.value]));
    },
    ["content-map", page],
    { revalidate: 30, tags: ["cms"] }
  )();
}

export function cms(map: Record<string, string>, key: string, fallback: string) {
  const value = map[key]?.trim();
  return value ? value : fallback;
}

/** Split a heading so the last word can be styled as the gold accent. */
export function splitHeading(text: string) {
  const i = text.lastIndexOf(" ");
  if (i < 0) return { start: text, accent: "" };
  return { start: text.slice(0, i), accent: text.slice(i + 1) };
}
