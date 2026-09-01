import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { prisma } from "@/lib/db";
import { z } from "zod";

// GET /api/content?page=home — public, used by the actual site pages to
// render their editable text/images. No auth needed to READ content.
export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");
  const blocks = await prisma.contentBlock.findMany({
    where: page ? { page } : undefined,
    orderBy: { key: "asc" },
  });
  return NextResponse.json(blocks);
}

const updateSchema = z.object({
  key: z.string().min(1),
  value: z.string().max(10000),
});

// PATCH /api/content — staff only. Updates one content block by key.
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  const staffId = (session.user as any).id as string;

  const updated = await prisma.contentBlock.update({
    where: { key: parsed.data.key },
    data: { value: parsed.data.value, updatedById: staffId },
  });

  await prisma.auditLog.create({
    data: {
      staffActorId: staffId,
      action: "CONTENT_UPDATED",
      target: parsed.data.key,
    },
  });

  revalidateTag("cms");

  return NextResponse.json(updated);
}
