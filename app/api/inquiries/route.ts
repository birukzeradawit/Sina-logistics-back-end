import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendStaffInquiryAlert, sendCustomerInquiryConfirmation } from "@/lib/email";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

let inquiryLimiter: Ratelimit | null = null;
try {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token && typeof url === "string" && url.startsWith("http")) {
    const redis = new Redis({ url, token });
    inquiryLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 m"),
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
    try {
      const ip = req.headers.get("x-forwarded-for") ?? "unknown";
      const { success } = await inquiryLimiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many submissions. Please try again later." },
          { status: 429, headers: corsHeaders() }
        );
      }
    } catch (e) {
      console.warn("Inquiry rate limiter check skipped:", e);
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

  Promise.allSettled([
    sendStaffInquiryAlert({ ...parsed.data, id: inquiry.id, createdAt: inquiry.createdAt }),
    sendCustomerInquiryConfirmation({ ...parsed.data, id: inquiry.id, createdAt: inquiry.createdAt }),
  ]).catch(() => {});

  return NextResponse.json(
    { success: true, id: inquiry.id },
    { headers: corsHeaders() }
  );
}
