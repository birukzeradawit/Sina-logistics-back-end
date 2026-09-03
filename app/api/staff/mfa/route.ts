import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { prisma } from "@/lib/db";
import { generateMfaSecret, generateMfaQrCode, verifyMfaToken } from "@/lib/mfa";
import { verifyPassword } from "@/lib/password";
import { z } from "zod";

const pendingSecrets = new Map<string, { secret: string; otpauthUrl: string; qrCodeDataUrl: string; createdAt: number }>();

export async function GET(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const user = await prisma.staffUser.findUnique({
    where: { id: userId },
    select: { email: true, mfaSecret: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isEnabled = !!user.mfaSecret;
  if (isEnabled) {
    return NextResponse.json({ isEnabled: true });
  }

  const forceNew = req.nextUrl.searchParams.get("new") === "true";
  let pending = pendingSecrets.get(userId);

  const isExpired = pending && Date.now() - pending.createdAt > 3600 * 1000;

  if (!pending || forceNew || isExpired) {
    const { secret, otpauthUrl } = generateMfaSecret(user.email);
    const qrCodeDataUrl = await generateMfaQrCode(otpauthUrl);
    pending = { secret, otpauthUrl, qrCodeDataUrl, createdAt: Date.now() };
    pendingSecrets.set(userId, pending);
  }

  return NextResponse.json({
    isEnabled: false,
    secret: pending.secret,
    qrCodeDataUrl: pending.qrCodeDataUrl,
    otpauthUrl: pending.otpauthUrl,
  });
}

const enableSchema = z.object({
  token: z.string().min(6).max(8),
  secret: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json().catch(() => null);
  const parsed = enableSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
  }

  const pending = pendingSecrets.get(userId);
  const secretToVerify = parsed.data.secret || pending?.secret;

  if (!secretToVerify) {
    return NextResponse.json(
      { error: "No setup key found. Please refresh the page to generate a new QR Code." },
      { status: 400 }
    );
  }

  const isValid = verifyMfaToken(parsed.data.token, secretToVerify);

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid authenticator code. Please check that you scanned the current QR code on screen and try again." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.staffUser.update({
      where: { id: userId },
      data: { mfaSecret: secretToVerify },
    }),
    prisma.auditLog.create({
      data: {
        staffActorId: userId,
        action: "MFA_ENROLLED",
        target: session.user.email ?? "staff",
      },
    }),
  ]);

  pendingSecrets.delete(userId);

  return NextResponse.json({ success: true, message: "Two-Factor Authentication is now enabled." });
}

const disableSchema = z.object({
  password: z.string().min(1),
});

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json().catch(() => null);
  const parsed = disableSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Password is required to disable MFA." }, { status: 400 });
  }

  const user = await prisma.staffUser.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const isValidPassword = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.staffUser.update({
      where: { id: userId },
      data: { mfaSecret: null },
    }),
    prisma.auditLog.create({
      data: {
        staffActorId: userId,
        action: "MFA_DISABLED",
        target: user.email,
      },
    }),
  ]);

  pendingSecrets.delete(userId);

  return NextResponse.json({ success: true, message: "Two-Factor Authentication has been disabled." });
}
