"use client";

import { SessionProvider } from "next-auth/react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider basePath="/api/auth/client">{children}</SessionProvider>;
}
