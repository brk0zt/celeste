import { describe, it, expect } from "vitest";
import { hashPasswordWithSalt, verifyPassword } from "./password";

describe("password hashing", () => {
  it("should hash password and verify correctly", () => {
    const password = "testpassword123";
    const hashed = hashPasswordWithSalt(password);
    
    // Hash should contain salt and hash separated by colon
    expect(hashed).toContain(":");
    expect(hashed.length).toBeGreaterThan(32);
    
    // Same password should verify against hash
    const isValid = verifyPassword(password, hashed);
    expect(isValid).toBe(true);
  });

  it("should reject wrong password", () => {
    const password = "testpassword123";
    const wrongPassword = "wrongpassword456";
    const hashed = hashPasswordWithSalt(password);
    
    const isValid = verifyPassword(wrongPassword, hashed);
    expect(isValid).toBe(false);
  });

  it("should generate different hashes for same password", () => {
    const password = "testpassword123";
    const hash1 = hashPasswordWithSalt(password);
    const hash2 = hashPasswordWithSalt(password);
    
    // Due to random salt, hashes should be different
    expect(hash1).not.toBe(hash2);
    
    // But both should verify
    expect(verifyPassword(password, hash1)).toBe(true);
    expect(verifyPassword(password, hash2)).toBe(true);
  });

  it("should reject invalid hash format", () => {
    const isValid = verifyPassword("password", "invalidhash");
    expect(isValid).toBe(false);
  });

  it("should handle empty password", () => {
    const password = "";
    const hashed = hashPasswordWithSalt(password);
    
    expect(verifyPassword(password, hashed)).toBe(true);
    expect(verifyPassword("notempty", hashed)).toBe(false);
  });
});
