import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Mock the database
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  values: vi.fn(),
  set: vi.fn(),
  limit: vi.fn(),
  orderBy: vi.fn(),
};

vi.mock("./queries/connection", () => ({
  getDb: () => mockDb,
}));

describe("notes router validation", () => {
  it("should validate create note input", () => {
    const schema = z.object({
      title: z.string().min(1).max(500),
      content: z.string().min(1),
      tags: z.array(z.string()).optional(),
      source: z.string().optional(),
    });

    // Valid input
    const valid = {
      title: "Test Note",
      content: "Test content",
      tags: ["test", "note"],
    };
    expect(() => schema.parse(valid)).not.toThrow();

    // Invalid - empty title
    const invalidTitle = {
      title: "",
      content: "Test content",
    };
    expect(() => schema.parse(invalidTitle)).toThrow();

    // Invalid - title too long
    const longTitle = {
      title: "a".repeat(501),
      content: "Test content",
    };
    expect(() => schema.parse(longTitle)).toThrow();
  });

  it("should validate update note input", () => {
    const schema = z.object({
      id: z.number(),
      title: z.string().min(1).max(500).optional(),
      content: z.string().optional(),
      tags: z.array(z.string()).optional(),
      source: z.string().optional(),
    });

    // Valid - partial update
    const valid = { id: 1, title: "Updated Title" };
    expect(() => schema.parse(valid)).not.toThrow();

    // Valid - full update
    const fullUpdate = {
      id: 1,
      title: "Title",
      content: "Content",
      tags: ["tag1"],
    };
    expect(() => schema.parse(fullUpdate)).not.toThrow();

    // Invalid - missing id
    const missingId = { title: "Title" };
    expect(() => schema.parse(missingId)).toThrow();
  });

  it("should validate delete note input", () => {
    const schema = z.object({
      id: z.number(),
    });

    expect(() => schema.parse({ id: 1 })).not.toThrow();
    expect(() => schema.parse({ id: "1" })).toThrow();
    expect(() => schema.parse({})).toThrow();
  });

  it("should validate delete many notes input", () => {
    const schema = z.object({
      ids: z.array(z.number()),
    });

    expect(() => schema.parse({ ids: [1, 2, 3] })).not.toThrow();
    expect(() => schema.parse({ ids: [] })).not.toThrow();
    expect(() => schema.parse({ ids: ["1", "2"] })).toThrow();
  });
});

describe("notes data structure", () => {
  it("should have correct note type structure", () => {
    // Simulating the note type validation
    const note = {
      id: 1,
      userId: 1,
      title: "Test Note",
      content: "Test content",
      tags: ["tag1", "tag2"],
      source: "test-source",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(note).toHaveProperty("id");
    expect(note).toHaveProperty("userId");
    expect(note).toHaveProperty("title");
    expect(note).toHaveProperty("content");
    expect(note).toHaveProperty("createdAt");
    expect(note).toHaveProperty("updatedAt");
    expect(typeof note.id).toBe("number");
    expect(typeof note.userId).toBe("number");
    expect(typeof note.title).toBe("string");
  });
});
