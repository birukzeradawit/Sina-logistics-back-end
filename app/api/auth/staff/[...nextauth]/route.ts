import NextAuth from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";

const handler = NextAuth(staffAuthOptions);
export { handler as GET, handler as POST };
