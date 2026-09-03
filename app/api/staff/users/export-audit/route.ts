import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { prisma } from "@/lib/db";

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET() {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden. Admin role required." }, { status: 403 });
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      staffActor: {
        select: { email: true, role: true },
      },
    },
  });

  const headers = [
    "Audit ID",
    "Action",
    "Actor Email",
    "Actor Role",
    "Target / Details",
    "IP Address",
    "Timestamp (UTC)",
  ];

  const rows = logs.map((log) => [
    escapeCsv(log.id),
    escapeCsv(log.action),
    escapeCsv(log.staffActor?.email || "System"),
    escapeCsv(log.staffActor?.role || "SYSTEM"),
    escapeCsv(log.target || "N/A"),
    escapeCsv(log.ipAddress || "N/A"),
    escapeCsv(new Date(log.createdAt).toISOString()),
  ].join(","));

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const dateStamp = new Date().toISOString().split("T")[0];

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sina-audit-trail-${dateStamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
