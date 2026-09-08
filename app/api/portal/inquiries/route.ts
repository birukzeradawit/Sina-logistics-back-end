import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { clientAuthOptions } from "@/lib/auth-client";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendCustomerInquiryConfirmation, sendStaffInquiryAlert } from "@/lib/email";

const inquirySchema = z.object({
  sector: z.string().max(100).optional(),
  message: z.string().min(1).max(4000),
});

export async function GET() {
  const session = await getServerSession(clientAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientUserId = (session.user as any).id as string;

  const inquiries = await prisma.inquiry.findMany({
    where: { clientUserId } as any,
    orderBy: { createdAt: "desc" },
    include: {
      statusHistory: {
        include: {
          changedBy: { select: { id: true, email: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json(inquiries);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(clientAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const clientUserId = (session.user as any).id as string;
  const user = await (prisma as any).clientUser.findUnique({ where: { id: clientUserId } });

  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Account unavailable." }, { status: 403 });
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      sector: parsed.data.sector?.trim() || null,
      message: parsed.data.message.trim(),
      clientUserId: user.id,
    } as any,
  });

  const emailPayload = {
    id: inquiry.id,
    firstName: inquiry.firstName,
    lastName: inquiry.lastName,
    email: inquiry.email,
    phone: inquiry.phone,
    sector: inquiry.sector,
    message: inquiry.message,
    createdAt: inquiry.createdAt,
  };

  Promise.allSettled([
    sendStaffInquiryAlert(emailPayload),
    sendCustomerInquiryConfirmation(emailPayload),
  ]).catch(() => {});

  return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
}
