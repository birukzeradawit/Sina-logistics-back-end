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

const createBlockSchema = z.object({
  key: z.string().min(2).max(100),
  page: z.string().min(2).max(50),
  label: z.string().min(2).max(100),
  type: z.enum(["TEXT", "RICH_TEXT", "IMAGE_URL"]).default("TEXT"),
  value: z.string().max(10000).default(""),
});

const updateSchema = z.object({
  key: z.string().min(1),
  value: z.string().max(10000),
});

// POST /api/content — staff only. Creates a new content block.
export async function POST(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staffId = (session.user as any).id as string;
  const body = await req.json().catch(() => null);
  const parsed = createBlockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid content block data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.contentBlock.findUnique({
    where: { key: parsed.data.key },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A content block with this key already exists." },
      { status: 409 }
    );
  }

  const created = await prisma.contentBlock.create({
    data: {
      key: parsed.data.key,
      page: parsed.data.page.toLowerCase(),
      label: parsed.data.label,
      type: parsed.data.type,
      value: parsed.data.value,
      updatedById: staffId,
    },
  });

  await prisma.auditLog.create({
    data: {
      staffActorId: staffId,
      action: "CONTENT_CREATED",
      target: parsed.data.key,
    },
  });

  revalidateTag("cms");

  return NextResponse.json(created, { status: 201 });
}

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

// DELETE /api/content?key=... — staff only. Deletes a content block.
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = req.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Key is required." }, { status: 400 });
  }

  const staffId = (session.user as any).id as string;

  await prisma.contentBlock.delete({ where: { key } });

  await prisma.auditLog.create({
    data: {
      staffActorId: staffId,
      action: "CONTENT_DELETED",
      target: key,
    },
  });

  revalidateTag("cms");

  return NextResponse.json({ success: true });
}
