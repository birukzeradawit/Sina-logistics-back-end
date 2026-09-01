import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendNewInquiryEmail } from "@/lib/email";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// The public site (static HTML) and this backend can live on different
// domains/ports, so the browser's CORS check needs an explicit allow-list.
// Set PUBLIC_SITE_ORIGIN in .env to the real domain once deployed —
// defaults to allowing any origin so local development (opening the static
// files directly, or from a different port) isn't blocked while testing.
const ALLOWED_ORIGIN = process.env.PUBLIC_SITE_ORIGIN || "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Browsers send an OPTIONS preflight request before the real POST when
// calling across origins — this just needs to answer with the CORS headers.
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

// GET /api/inquiries — staff only, powers the dashboard list.
export async function GET() {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(inquiries);
}


// Generous but real limit — a genuine visitor submits once; this stops a
// script from flooding the inquiries table or spamming the notification inbox.
const inquiryLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 m"),
  prefix: "ratelimit:inquiry-submit",
});

const inquirySchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  sector: z.string().max(100).optional(),
  message: z.string().min(1).max(4000),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await inquiryLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: corsHeaders() }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission.", details: parsed.error.flatten() },
      { status: 400, headers: corsHeaders() }
    );
  }

  const inquiry = await prisma.inquiry.create({ data: parsed.data });

  // Don't let a slow/failed email delay the response to the visitor —
  // the inquiry is already saved regardless of whether the email succeeds.
  sendNewInquiryEmail(parsed.data).catch(() => {});

  return NextResponse.json(
    { success: true, id: inquiry.id },
    { headers: corsHeaders() }
  );
}
