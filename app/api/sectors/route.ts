import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { prisma } from "@/lib/db";
import { z } from "zod";

const sectorSchema = z.object({
  code: z.string().min(2).max(20),
  slug: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  shortDesc: z.string().min(5),
  fullDesc: z.string().optional(),
  features: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  const includeInactive = session?.user && req.nextUrl.searchParams.get("all") === "true";

  const sectors = await prisma.serviceSector.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(sectors);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Staff session required." }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json().catch(() => null);
  const parsed = sectorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.serviceSector.findFirst({
    where: {
      OR: [{ code: parsed.data.code }, { slug: parsed.data.slug }],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "A sector with this code or slug already exists." }, { status: 409 });
  }

  const created = await prisma.serviceSector.create({
    data: parsed.data,
  });

  await prisma.auditLog.create({
    data: {
      staffActorId: userId,
      action: "SECTOR_CREATED",
      target: `${created.code} — ${created.name}`,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
