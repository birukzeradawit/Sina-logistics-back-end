import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Every request to /staff/** (except the login page itself) passes through
// here before it reaches a page. This is the enforcement point — even if a
// page component forgets to check auth, the middleware still blocks it.
// No /portal path exists — the business model doesn't need a client login.

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/staff") && pathname !== "/staff/login") {
    const token = await getToken({
      req,
      secret: process.env.STAFF_AUTH_SECRET,
      cookieName: "sina-staff-session",
    });
    if (!token) {
      return NextResponse.redirect(new URL("/staff/login", req.url));
    }
    if (pathname.startsWith("/staff/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/staff", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*"],
};

