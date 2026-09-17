import NextAuth from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = NextAuth(staffAuthOptions);
export { handler as GET, handler as POST };

