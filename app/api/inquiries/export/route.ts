import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { staffAuthOptions } from "@/lib/auth-staff";
import { prisma } from "@/lib/db";

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(staffAuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const filterStatus = searchParams.get("status") || "ALL";
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();

  const whereClause: any = {};
  if (filterStatus !== "ALL") {
    whereClause.status = filterStatus;
  }

  const rawInquiries = await prisma.inquiry.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      statusHistory: {
        include: {
          changedBy: { select: { email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const inquiries = rawInquiries.filter((inq) => {
    if (!searchQuery) return true;
    const fullName = `${inq.firstName} ${inq.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery) ||
      inq.email.toLowerCase().includes(searchQuery) ||
      (inq.phone && inq.phone.toLowerCase().includes(searchQuery)) ||
      (inq.sector && inq.sector.toLowerCase().includes(searchQuery)) ||
      inq.message.toLowerCase().includes(searchQuery)
    );
  });

  const headers = [
    "Inquiry ID",
    "Status",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Target Sector",
    "Created Date (UTC)",
    "Last Updated",
    "Last Updated By",
    "Message / Project Scope",
  ];

  const rows = inquiries.map((inq) => {
    const latestChange = inq.statusHistory[0];
    return [
      escapeCsv(inq.id),
      escapeCsv(inq.status),
      escapeCsv(inq.firstName),
      escapeCsv(inq.lastName),
      escapeCsv(inq.email),
      escapeCsv(inq.phone || "N/A"),
      escapeCsv(inq.sector || "General"),
      escapeCsv(new Date(inq.createdAt).toISOString()),
      escapeCsv(latestChange ? new Date(latestChange.createdAt).toISOString() : "Initial"),
      escapeCsv(latestChange?.changedBy?.email || "System"),
      escapeCsv(inq.message.replace(/\r?\n/g, " ")),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const dateStamp = new Date().toISOString().split("T")[0];

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sina-inquiries-${dateStamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
