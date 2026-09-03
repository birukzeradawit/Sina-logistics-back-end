import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

const ISSUER_NAME = "SINA Supplies";

export function generateMfaSecret(email: string) {
  const secret = generateSecret();
  const otpauthUrl = generateURI({
    issuer: ISSUER_NAME,
    label: email,
    secret,
  });
  return { secret, otpauthUrl };
}

export async function generateMfaQrCode(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    color: {
      dark: "#111112",
      light: "#FFFFFF",
    },
    width: 250,
  });
}

export function verifyMfaToken(token: string, secret: string): boolean {
  try {
    const cleaned = token.replace(/[\s-]+/g, "").trim();
    if (!cleaned || cleaned.length < 6) return false;

    const result = verifySync({
      token: cleaned,
      secret,
      epochTolerance: 1200,
    });
    return result.valid;
  } catch {
    return false;
  }
}
