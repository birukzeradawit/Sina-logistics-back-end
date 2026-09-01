import bcrypt from "bcryptjs";

// 12 rounds is a reasonable balance of security vs. login latency in 2026.
// Never lower this to speed up logins — it exists specifically to make
// brute-forcing a stolen password hash slow.
const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
