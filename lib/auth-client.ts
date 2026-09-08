import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { verifyPassword } from "./password";
import { clientLoginLimiter } from "./rate-limit";

export const clientAuthOptions: NextAuthOptions = {
  secret: process.env.CLIENT_AUTH_SECRET || process.env.STAFF_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: "sina-client-session",
      options: { httpOnly: true, sameSite: "lax", secure: true, path: "/" },
    },
  },
  providers: [
    CredentialsProvider({
      id: "client-credentials",
      name: "Client Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const ip = req?.headers?.["x-forwarded-for"] ?? "unknown";

        const { success } = await clientLoginLimiter.limit(`${ip}:${email}`);
        if (!success) {
          throw new Error("Too many login attempts. Please try again shortly.");
        }

        const user = await (prisma as any).clientUser.findUnique({
          where: { email },
        });

        if (!user || !user.isActive) return null;

        const valid = await verifyPassword(credentials.password, user.passwordHash);
        if (!valid) return null;

        await (prisma as any).clientUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.company = (user as any).company;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = token.sub;
      (session.user as any).firstName = token.firstName;
      (session.user as any).lastName = token.lastName;
      (session.user as any).company = token.company;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
