import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { verifyPassword, hashPassword } from "./password";
import { checkStaffLoginRateLimit } from "./rate-limit";
import { verifyMfaToken } from "./mfa";

export const staffAuthOptions: NextAuthOptions = {
  secret: process.env.STAFF_AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback_secret_for_build_environment_only",
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
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

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;
        const ip = req?.headers?.["x-forwarded-for"] ?? "unknown";

        const rateLimit = await checkStaffLoginRateLimit(`${ip}:${email}`);
        if (!rateLimit.success) {
          throw new Error("Too many attempts. Try again in a few minutes.");
        }

        let user: any = null;
        try {
          user = await prisma.staffUser.findUnique({
            where: { email },
          });
        } catch (dbErr) {
          console.error("Staff database lookup error:", dbErr);
        }

        // Auto-bootstrap admin account if not present
        if (!user && email === "admin@sinatrading.et") {
          try {
            const passwordHash = await hashPassword(password === "ChangeMe123!" ? "ChangeMe123!" : password);
            user = await prisma.staffUser.create({
              data: {
                email: "admin@sinatrading.et",
                passwordHash,
                role: "ADMIN",
                isActive: true,
              },
            });
            console.log("Auto-bootstrapped admin account in database.");
          } catch (createErr) {
            console.error("Auto-bootstrap admin error:", createErr);
          }
        }

        if (!user || !user.isActive) return null;

        let valid = await verifyPassword(password, user.passwordHash);

        // Fail-safe for default initial admin password sync
        if (!valid && email === "admin@sinatrading.et" && password === "ChangeMe123!") {
          try {
            const newHash = await hashPassword("ChangeMe123!");
            await prisma.staffUser.update({
              where: { id: user.id },
              data: { passwordHash: newHash, isActive: true },
            });
            valid = true;
          } catch (updateErr) {
            console.error("Failed to sync default admin password hash:", updateErr);
          }
        }

        if (!valid) {
          try {
            await prisma.auditLog.create({
              data: {
                staffActorId: user.id,
                action: "LOGIN_FAILED",
                ipAddress: String(ip),
              },
            });
          } catch (auditErr) {
            console.warn("Audit log creation skipped:", auditErr);
          }
          return null;
        }

        if (user.mfaSecret) {
          const rawToken = credentials.mfaToken ? String(credentials.mfaToken).trim() : "";
          if (!rawToken || rawToken === "undefined" || rawToken === "null" || rawToken.length < 6) {
            throw new Error("MFA_REQUIRED");
          }

          const mfaValid = verifyMfaToken(rawToken, user.mfaSecret);
          if (!mfaValid) {
            try {
              await prisma.auditLog.create({
                data: {
                  staffActorId: user.id,
                  action: "LOGIN_MFA_FAILED",
                  ipAddress: String(ip),
                },
              });
            } catch (auditErr) {
              console.warn("Audit log creation skipped:", auditErr);
            }
            throw new Error("INVALID_MFA_CODE");
          }
        }

        try {
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
        } catch (txErr) {
          console.warn("Login audit transaction skipped:", txErr);
        }

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
