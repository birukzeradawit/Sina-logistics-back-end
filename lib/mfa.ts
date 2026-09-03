import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

const ISSUER_NAME = "SINA Supplies";

/**
 * Generates a new base32 secret and an otpauth:// URI for the staff user.
 */
export function generateMfaSecret(email: string) {
  const secret = generateSecret();
  const otpauthUrl = generateURI({
    issuer: ISSUER_NAME,
    label: email,
    secret,
  });
  return { secret, otpauthUrl };
}

/**
 * Generates a QR Code as a Data URL for scanning in authenticator apps.
 */
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

/**
 * Verifies a 6-digit TOTP token against the secret with adaptive clock drift tolerance (±20 minutes / 40 intervals).
 */
export function verifyMfaToken(token: string, secret: string): boolean {
  try {
    const cleaned = token.replace(/[\s-]+/g, "").trim();
    if (!cleaned || cleaned.length < 6) return false;

    // Allow ±1200 seconds (20 minutes) of clock skew between phone and server
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
