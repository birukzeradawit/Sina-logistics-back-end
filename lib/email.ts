import nodemailer from "nodemailer";

const hasSmtpConfig = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null;

const DEFAULT_FROM = process.env.SMTP_FROM || '"SINA Supplies & Logistics" <no-reply@sinatrading.et>';

export type InquiryEmailPayload = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  sector?: string | null;
  message: string;
  createdAt?: Date | string;
};

export async function sendStaffInquiryAlert(inquiry: InquiryEmailPayload) {
  const staffRecipient = process.env.STAFF_NOTIFICATION_EMAIL || "info@sinatrading.et";
  const fullName = `${inquiry.firstName} ${inquiry.lastName}`;
  const sectorLabel = inquiry.sector || "General Inquiry";

  const textContent = `
[NEW LEAD] SINA Supplies & Logistics

A new inquiry has been received from the website contact form.

Customer: ${fullName}
Email: ${inquiry.email}
Phone: ${inquiry.phone || "Not provided"}
Sector: ${sectorLabel}

Message:
"${inquiry.message}"

Log in to the staff CRM to view and manage this lead:
http://localhost:3000/staff
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#F7F5F1;font-family:system-ui,-apple-system,sans-serif;color:#111112;">
  <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:8px;border:1px solid rgba(17,17,18,0.1);padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
    <div style="border-bottom:2px solid #E8940C;padding-bottom:16px;margin-bottom:24px;">
      <span style="color:#E8940C;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">SINA Staff CRM Alert</span>
      <h2 style="margin:6px 0 0 0;font-size:22px;color:#111112;">New Quote / Inquiry Received</h2>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
      <tr>
        <td style="padding:8px 0;color:#7B7B78;width:120px;font-weight:600;">Customer:</td>
        <td style="padding:8px 0;color:#111112;font-weight:700;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#7B7B78;font-weight:600;">Email:</td>
        <td style="padding:8px 0;"><a href="mailto:${inquiry.email}" style="color:#E8940C;text-decoration:none;">${inquiry.email}</a></td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#7B7B78;font-weight:600;">Phone:</td>
        <td style="padding:8px 0;color:#111112;">${inquiry.phone || "Not provided"}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#7B7B78;font-weight:600;">Target Sector:</td>
        <td style="padding:8px 0;"><span style="background:#FAF3E3;color:#8F5B08;padding:3px 10px;border-radius:4px;font-weight:600;font-size:12px;">${sectorLabel}</span></td>
      </tr>
    </table>

    <div style="background:#FAF9F6;border-left:4px solid #E8940C;padding:16px;border-radius:0 6px 6px 0;margin-bottom:28px;">
      <div style="font-size:12px;font-weight:700;color:#7B7B78;text-transform:uppercase;margin-bottom:6px;">Inquiry Message:</div>
      <div style="font-size:14px;line-height:1.6;color:#111112;white-space:pre-wrap;">${inquiry.message}</div>
    </div>

    <div style="text-align:center;">
      <a href="http://localhost:3000/staff" style="display:inline-block;background:#111112;color:#FFCB47;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;">
        Open Staff CRM Pipeline →
      </a>
    </div>
  </div>
</body>
</html>
`.trim();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: staffRecipient,
        subject: `[New Lead] ${sectorLabel} — ${fullName}`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[Email] Staff alert sent to ${staffRecipient}`);
    } catch (err) {
      console.error("[Email] Failed to send staff alert via SMTP:", err);
    }
  } else {
    console.log(`\n--- [EMAIL DISPATCH SIMULATION: STAFF ALERT] ---`);
    console.log(`To: ${staffRecipient}`);
    console.log(`Subject: [New Lead] ${sectorLabel} — ${fullName}`);
    console.log(textContent);
    console.log(`------------------------------------------------\n`);
  }
}

export async function sendCustomerInquiryConfirmation(inquiry: InquiryEmailPayload) {
  const fullName = `${inquiry.firstName} ${inquiry.lastName}`;

  const textContent = `
Dear ${fullName},

Thank you for reaching out to SINA Supplies & Logistics.

We have received your inquiry regarding "${inquiry.sector || "our services"}". One of our dedicated account specialists is reviewing your request and will contact you within 1 business day with details and quotation estimates.

Summary of your message:
"${inquiry.message}"

Best regards,
SINA Supplies & Logistics Team
Addis Ababa, Ethiopia | info@sinatrading.et
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#F7F5F1;font-family:system-ui,-apple-system,sans-serif;color:#111112;">
  <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:8px;border:1px solid rgba(17,17,18,0.1);padding:36px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
      <span style="display:inline-block;width:12px;height:12px;background:#E8940C;border-radius:2px;"></span>
      <span style="font-size:18px;font-weight:700;color:#111112;letter-spacing:-0.01em;">SINA Supplies &amp; Logistics</span>
    </div>

    <h1 style="font-size:22px;color:#111112;margin:0 0 14px 0;">Thank you for contacting us, ${inquiry.firstName}!</h1>
    <p style="font-size:14px;line-height:1.6;color:#5B5B58;margin:0 0 20px 0;">
      We have received your inquiry. Our supply chain and logistics team is currently reviewing your project requirements and will reach out to you within <strong>1 business day</strong> with tailored solutions and quotation estimates.
    </p>

    <div style="background:#FAF9F6;border:1px solid rgba(17,17,18,0.08);border-radius:6px;padding:18px;margin-bottom:24px;">
      <div style="font-size:12px;font-weight:700;color:#7B7B78;text-transform:uppercase;margin-bottom:8px;">Your Submitted Request:</div>
      <div style="font-size:13px;line-height:1.5;color:#111112;font-style:italic;">"${inquiry.message}"</div>
      ${inquiry.sector ? `<div style="margin-top:10px;font-size:12px;color:#7B7B78;"><strong>Selected Sector:</strong> ${inquiry.sector}</div>` : ""}
    </div>

    <div style="border-top:1px solid rgba(17,17,18,0.08);padding-top:20px;font-size:13px;color:#7B7B78;line-height:1.5;">
      Need immediate assistance? Reach our sales desk directly at <a href="mailto:info@sinatrading.et" style="color:#E8940C;text-decoration:none;">info@sinatrading.et</a> or call +251 11 000 0000.
    </div>
  </div>
</body>
</html>
`.trim();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: inquiry.email,
        subject: `Thank you for contacting SINA Supplies & Logistics`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[Email] Customer confirmation sent to ${inquiry.email}`);
    } catch (err) {
      console.error("[Email] Failed to send customer confirmation via SMTP:", err);
    }
  } else {
    console.log(`\n--- [EMAIL DISPATCH SIMULATION: CUSTOMER RECEIPT] ---`);
    console.log(`To: ${inquiry.email}`);
    console.log(`Subject: Thank you for contacting SINA Supplies & Logistics`);
    console.log(textContent);
    console.log(`----------------------------------------------------\n`);
  }
}
