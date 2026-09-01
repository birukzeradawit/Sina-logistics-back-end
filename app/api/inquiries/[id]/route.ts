import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { prisma } from "@/lib/db";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.findUnique({ where: { id: params.id } });
  if (!inquiry) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const staffId = (session.user as any).id as string;

  await prisma.$transaction([
    prisma.inquiry.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    }),
    prisma.inquiryStatusChange.create({
      data: {
        inquiryId: params.id,
        fromStatus: inquiry.status,
        toStatus: parsed.data.status,
        changedById: staffId,
      },
    }),
    prisma.auditLog.create({
      data: {
        staffActorId: staffId,
        action: "INQUIRY_STATUS_CHANGED",
        target: params.id,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
