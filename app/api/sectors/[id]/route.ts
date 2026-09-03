import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSectorSchema = z.object({
  code: z.string().min(2).max(20).optional(),
  slug: z.string().min(2).max(50).optional(),
  name: z.string().min(2).max(100).optional(),
  shortDesc: z.string().min(5).optional(),
  fullDesc: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Staff session required." }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json().catch(() => null);
  const parsed = updateSectorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", details: parsed.error.flatten() }, { status: 400 });
  }

  const target = await prisma.serviceSector.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "Sector not found." }, { status: 404 });
  }

  const updated = await prisma.serviceSector.update({
    where: { id: params.id },
    data: parsed.data,
  });

  await prisma.auditLog.create({
    data: {
      staffActorId: userId,
      action: "SECTOR_UPDATED",
      target: `${updated.code} — ${updated.name}`,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Staff session required." }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const target = await prisma.serviceSector.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "Sector not found." }, { status: 404 });
  }

  await prisma.serviceSector.delete({ where: { id: params.id } });

  await prisma.auditLog.create({
    data: {
      staffActorId: userId,
      action: "SECTOR_DELETED",
      target: `${target.code} — ${target.name}`,
    },
  });

  return NextResponse.json({ success: true, message: `Sector ${target.code} deleted.` });
}
