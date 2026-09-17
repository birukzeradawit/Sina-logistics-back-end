import NextAuth from "next-auth";
import { clientAuthOptions } from "@/lib/auth-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = NextAuth(clientAuthOptions);
export { handler as GET, handler as POST };

