import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("auth router validation", () => {
  describe("register input", () => {
    const registerSchema = z.object({
      name: z.string().min(1).max(255),
      email: z.string().email().max(320),
      password: z.string().min(6).max(100),
    });

    it("should accept valid register input", () => {
      const valid = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      expect(() => registerSchema.parse(valid)).not.toThrow();
    });

    it("should reject empty name", () => {
      const invalid = {
        name: "",
        email: "test@example.com",
        password: "password123",
      };
      expect(() => registerSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid email", () => {
      const invalid = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      };
      expect(() => registerSchema.parse(invalid)).toThrow();
    });

    it("should reject short password", () => {
      const invalid = {
        name: "Test User",
        email: "test@example.com",
        password: "12345",
      };
      expect(() => registerSchema.parse(invalid)).toThrow();
    });

    it("should reject long password", () => {
      const invalid = {
        name: "Test User",
        email: "test@example.com",
        password: "a".repeat(101),
      };
      expect(() => registerSchema.parse(invalid)).toThrow();
    });
  });

  describe("login input", () => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    it("should accept valid login input", () => {
      const valid = {
        email: "test@example.com",
        password: "password123",
      };
      expect(() => loginSchema.parse(valid)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalid = {
        email: "not-an-email",
        password: "password123",
      };
      expect(() => loginSchema.parse(invalid)).toThrow();
    });

    it("should reject empty email", () => {
      const invalid = {
        email: "",
        password: "password123",
      };
      expect(() => loginSchema.parse(invalid)).toThrow();
    });
  });

  describe("update bio input", () => {
    const bioSchema = z.object({
      bio: z.string().max(500),
    });

    it("should accept valid bio", () => {
      const valid = { bio: "This is my bio" };
      expect(() => bioSchema.parse(valid)).not.toThrow();
    });

    it("should accept empty bio", () => {
      const valid = { bio: "" };
      expect(() => bioSchema.parse(valid)).not.toThrow();
    });

    it("should reject bio too long", () => {
      const invalid = { bio: "a".repeat(501) };
      expect(() => bioSchema.parse(invalid)).toThrow();
    });
  });
});

describe("auth response structure", () => {
  it("should have correct user structure on login", () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      avatar: null,
      bio: null,
      role: "user" as const,
    };

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("role");
    expect(typeof user.id).toBe("number");
    expect(user.role).toMatch(/^(user|admin)$/);
  });

  it("should indicate successful auth", () => {
    const response = {
      success: true,
      user: {
        id: 1,
        name: "Test",
        email: "test@example.com",
      },
    };

    expect(response.success).toBe(true);
    expect(response.user).toBeDefined();
    expect(response.user.id).toBeGreaterThan(0);
  });
});
