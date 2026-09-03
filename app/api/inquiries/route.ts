import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendStaffInquiryAlert, sendCustomerInquiryConfirmation } from "@/lib/email";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ALLOWED_ORIGIN = process.env.PUBLIC_SITE_ORIGIN || "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

// GET /api/inquiries — staff only, powers the CRM dashboard list.
export async function GET() {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      statusHistory: {
        include: {
          changedBy: {
            select: { id: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return NextResponse.json(inquiries);
}

// Rate limiting — fallback to memory limiter if Redis envs not supplied
let inquiryLimiter: Ratelimit | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    inquiryLimiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "ratelimit:inquiry-submit",
    });
  }
} catch {
  inquiryLimiter = null;
}

const inquirySchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  sector: z.string().max(100).optional(),
  message: z.string().min(1).max(4000),
});

export async function POST(req: NextRequest) {
  if (inquiryLimiter) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await inquiryLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429, headers: corsHeaders() }
      );
    }
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

  // Dispatch dual notifications (Staff alert + Customer confirmation receipt) asynchronously
  Promise.allSettled([
    sendStaffInquiryAlert({ ...parsed.data, id: inquiry.id, createdAt: inquiry.createdAt }),
    sendCustomerInquiryConfirmation({ ...parsed.data, id: inquiry.id, createdAt: inquiry.createdAt }),
  ]).catch(() => {});

  return NextResponse.json(
    { success: true, id: inquiry.id },
    { headers: corsHeaders() }
  );
}
