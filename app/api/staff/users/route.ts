import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { z } from "zod";

const createStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
});

const updateStaffSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
  resetMfa: z.boolean().optional(),
});

export async function GET() {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden. Admin role required." }, { status: 403 });
  }

  const [rawUsers, auditLogs] = await Promise.all([
    prisma.staffUser.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        mfaSecret: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.auditLog.findMany({
      take: 40,
      orderBy: { createdAt: "desc" },
      include: {
        staffActor: {
          select: { email: true, role: true },
        },
      },
    }),
  ]);

  const users = rawUsers.map((u: any) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    hasMfa: !!u.mfaSecret,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
  }));

  return NextResponse.json({ users, auditLogs });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden. Admin role required." }, { status: 403 });
  }

  const currentAdminId = (session.user as any).id as string;
  const body = await req.json().catch(() => null);
  const parsed = createStaffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.staffUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const newUser = await prisma.staffUser.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      role: parsed.data.role,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      staffActorId: currentAdminId,
      action: "STAFF_USER_CREATED",
      target: `${newUser.email} (${newUser.role})`,
    },
  });

  return NextResponse.json({ ...newUser, hasMfa: false }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden. Admin role required." }, { status: 403 });
  }

  const currentAdminId = (session.user as any).id as string;
  const body = await req.json().catch(() => null);
  const parsed = updateStaffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid update data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id, role, isActive, password, resetMfa } = parsed.data;
  const targetUser = await prisma.staffUser.findUnique({ where: { id } });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (id === currentAdminId && isActive === false) {
    return NextResponse.json(
      { error: "You cannot deactivate your own admin account." },
      { status: 400 }
    );
  }

  const updateData: any = {};
  if (role !== undefined) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (password) {
    updateData.passwordHash = await hashPassword(password);
  }
  if (resetMfa === true) {
    updateData.mfaSecret = null;
  }

  const updated = await prisma.staffUser.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      mfaSecret: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  const actions = [];
  if (resetMfa) actions.push("MFA_RESET");
  if (role) actions.push(`ROLE_${role}`);
  if (isActive !== undefined) actions.push(isActive ? "ACTIVATED" : "DEACTIVATED");
  if (password) actions.push("PASSWORD_RESET");

  await prisma.auditLog.create({
    data: {
      staffActorId: currentAdminId,
      action: "STAFF_USER_UPDATED",
      target: `${targetUser.email} [${actions.join(", ")}]`,
    },
  });

  return NextResponse.json({
    id: updated.id,
    email: updated.email,
    role: updated.role,
    isActive: updated.isActive,
    hasMfa: !!updated.mfaSecret,
    lastLoginAt: updated.lastLoginAt,
    createdAt: updated.createdAt,
  });
}
