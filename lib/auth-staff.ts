import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { verifyPassword } from "./password";
import { staffLoginLimiter } from "./rate-limit";

// This is a SEPARATE NextAuth config from the client portal (see auth-client.ts),
// with its own secret and its own cookie name, so a session token issued for
// one can never be replayed against the other.

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
        // In production, add a `token` field here for the TOTP/MFA code
        // and verify it against StaffUser.mfaSecret before returning a user.
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const ip = req?.headers?.["x-forwarded-for"] ?? "unknown";
        const { success } = await staffLoginLimiter.limit(
          `${ip}:${credentials.email}`
        );
        if (!success) {
          throw new Error("Too many attempts. Try again in a few minutes.");
        }

        const user = await prisma.staffUser.findUnique({
          where: { email: credentials.email },
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
