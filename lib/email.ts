import nodemailer from "nodemailer";

// Generic SMTP setup — works with Gmail, SendGrid, Mailgun, or any SMTP
// provider by just changing the env vars. See .env.example for what to fill in.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendNewInquiryEmail(inquiry: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  sector?: string | null;
  message: string;
}) {
  const to = process.env.STAFF_NOTIFICATION_EMAIL;
  if (!to) {
    console.warn(
      "STAFF_NOTIFICATION_EMAIL not set — skipping inquiry notification email."
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"SINA Website" <no-reply@sinatrading.et>',
      to,
      subject: `New Inquiry — ${inquiry.sector || "General"} — ${inquiry.firstName} ${inquiry.lastName}`,
      text:
        `New inquiry received on the website:\n\n` +
        `Name: ${inquiry.firstName} ${inquiry.lastName}\n` +
        `Email: ${inquiry.email}\n` +
        `Phone: ${inquiry.phone || "Not provided"}\n` +
        `Sector: ${inquiry.sector || "Not specified"}\n\n` +
        `Message:\n${inquiry.message}\n\n` +
        `View and manage this lead in the staff dashboard.`,
    });
  } catch (err) {
    // A failed notification email should never block the inquiry from being
    // saved — the lead is already in the database regardless. Log and move on.
    console.error("Failed to send inquiry notification email:", err);
  }
}
