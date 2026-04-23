import { describe, it, expect } from "vitest";
import { signSessionToken, verifySessionToken } from "./session";
import type { SessionPayload } from "./types";

describe("session tokens", () => {
  it("should sign and verify valid token", async () => {
    const payload: SessionPayload = {
      userId: 123,
      email: "test@example.com",
    };
    
    const token = await signSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
    
    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
  });

  it("should reject invalid token", async () => {
    const verified = await verifySessionToken("invalid.token.here");
    expect(verified).toBeNull();
  });

  it("should reject empty token", async () => {
    const verified = await verifySessionToken("");
    expect(verified).toBeNull();
  });

  it("should handle different user IDs", async () => {
    const payloads: SessionPayload[] = [
      { userId: 1, email: "user1@test.com" },
      { userId: 999999, email: "user999999@test.com" },
      { userId: 0, email: "zero@test.com" },
    ];
    
    for (const payload of payloads) {
      const token = await signSessionToken(payload);
      const verified = await verifySessionToken(token);
      expect(verified?.userId).toBe(payload.userId);
      expect(verified?.email).toBe(payload.email);
    }
  });
});
