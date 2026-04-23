import { createHash, randomBytes, timingSafeEqual } from "crypto";

const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha256";

function hashPassword(password: string, salt: Buffer): string {
  const hash = createHash(DIGEST);
  hash.update(salt);
  hash.update(password);
  return hash.digest("hex");
}

export function hashPasswordWithSalt(password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = hashPassword(password, salt);
  return `${salt.toString("hex")}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;

  const salt = Buffer.from(parts[0], "hex");
  const hash = parts[1];

  const computedHash = hashPassword(password, salt);
  
  // Use timing-safe comparison to prevent timing attacks
  try {
    const storedBuf = Buffer.from(hash, "hex");
    const computedBuf = Buffer.from(computedHash, "hex");
    return timingSafeEqual(storedBuf, computedBuf);
  } catch {
    return false;
  }
}
