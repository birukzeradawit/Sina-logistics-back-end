import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { verifyPassword } from "./password";
import { staffLoginLimiter } from "./rate-limit";
import { verifyMfaToken } from "./mfa";

export const staffAuthOptions: NextAuthOptions = {
  secret: process.env.STAFF_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours — staff sessions expire same working day
  },
  cookies: {
    sessionToken: {
      name: "sina-staff-session",
      options: { httpOnly: true, sameSite: "lax", secure: true, path: "/" },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaToken: { label: "MFA Code", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const ip = req?.headers?.["x-forwarded-for"] ?? "unknown";
        const { success } = await staffLoginLimiter.limit(
          `${ip}:${credentials.email.toLowerCase()}`
        );
        if (!success) {
          throw new Error("Too many attempts. Try again in a few minutes.");
        }

        const user = await prisma.staffUser.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user || !user.isActive) return null;

        const valid = await verifyPassword(credentials.password, user.passwordHash);
        if (!valid) {
          await prisma.auditLog.create({
            data: {
              staffActorId: user.id,
              action: "LOGIN_FAILED",
              ipAddress: String(ip),
            },
          });
          return null;
        }

        // Two-Factor Authentication Check
        if (user.mfaSecret) {
          const rawToken = credentials.mfaToken ? String(credentials.mfaToken).trim() : "";
          if (!rawToken || rawToken === "undefined" || rawToken === "null" || rawToken.length < 6) {
            // Signal frontend to display the 6-digit MFA input
            throw new Error("MFA_REQUIRED");
          }

          const mfaValid = verifyMfaToken(rawToken, user.mfaSecret);
          if (!mfaValid) {
            await prisma.auditLog.create({
              data: {
                staffActorId: user.id,
                action: "LOGIN_MFA_FAILED",
                ipAddress: String(ip),
              },
            });
            throw new Error("INVALID_MFA_CODE");
          }
        }

        await prisma.$transaction([
          prisma.staffUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          }),
          prisma.auditLog.create({
            data: {
              staffActorId: user.id,
              action: "LOGIN",
              ipAddress: String(ip),
            },
          }),
        ]);

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      (session.user as any).id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/staff/login",
  },
};
