"use client";

import { SessionProvider } from "next-auth/react";

// basePath here is what makes signIn()/useSession() in the staff pages talk
// to /api/auth/staff/... instead of NextAuth's default /api/auth/... —
// necessary because this app has its own dedicated staff auth instance.
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth/staff">
      {children}
    </SessionProvider>
  );
}
