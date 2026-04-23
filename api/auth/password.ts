import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

// PBKDF2 parameters - NIST recommended values
const SALT_LENGTH = 32; // 256 bits
const ITERATIONS = 100000; // 100k iterations (minimum recommended)
const KEY_LENGTH = 64; // 512 bits output
const DIGEST = "sha512"; // SHA-512 for stronger hashing

function hashPassword(password: string, salt: Buffer): string {
  // Use PBKDF2 for computationally expensive hashing (resists brute-force)
  const derivedKey = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return derivedKey.toString("hex");
}

export function hashPasswordWithSalt(password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = hashPassword(password, salt);
  // Store: version:salt:hash for future algorithm upgrades
  return `v1:${salt.toString("hex")}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  // Check for version prefix (for backward compatibility)
  let hashParts: string[];
  if (storedHash.startsWith("v1:")) {
    hashParts = storedHash.substring(3).split(":");
  } else {
    // Legacy format without version (old SHA256 - will be upgraded on next login)
    hashParts = storedHash.split(":");
  }

  if (hashParts.length !== 2) return false;

  const salt = Buffer.from(hashParts[0], "hex");
  const hash = hashParts[1];

  // Use same parameters for verification
  const computedHash = hashPassword(password, salt);

  // Timing-safe comparison to prevent timing attacks
  try {
    const storedBuf = Buffer.from(hash, "hex");
    const computedBuf = Buffer.from(computedHash, "hex");

    // Ensure buffers are same length
    if (storedBuf.length !== computedBuf.length) {
      return false;
    }

    return timingSafeEqual(storedBuf, computedBuf);
  } catch {
    return false;
  }
}
