import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().max(150).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid sign up data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await (prisma as any).clientUser.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const created = await (prisma as any).clientUser.create({
    data: {
      firstName: parsed.data.firstName.trim(),
      lastName: parsed.data.lastName.trim(),
      email,
      passwordHash,
      company: parsed.data.company?.trim() || null,
      phone: parsed.data.phone?.trim() || null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      company: true,
      phone: true,
      createdAt: true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
