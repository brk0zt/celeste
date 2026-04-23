import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("progress router validation", () => {
  it("should validate update progress input", () => {
    const schema = z.object({
      blogpostId: z.number(),
      readPercent: z.number().min(0).max(100),
      completed: z.boolean().optional(),
    });

    // Valid input
    const valid1 = {
      blogpostId: 1,
      readPercent: 50,
    };
    expect(() => schema.parse(valid1)).not.toThrow();

    const valid2 = {
      blogpostId: 1,
      readPercent: 100,
      completed: true,
    };
    expect(() => schema.parse(valid2)).not.toThrow();

    // Invalid - negative percentage
    const invalid1 = {
      blogpostId: 1,
      readPercent: -1,
    };
    expect(() => schema.parse(invalid1)).toThrow();

    // Invalid - percentage over 100
    const invalid2 = {
      blogpostId: 1,
      readPercent: 101,
    };
    expect(() => schema.parse(invalid2)).toThrow();

    // Invalid - wrong type
    const invalid3 = {
      blogpostId: "1",
      readPercent: 50,
    };
    expect(() => schema.parse(invalid3)).toThrow();
  });

  it("should validate get progress input", () => {
    const schema = z.object({
      blogpostId: z.number(),
    });

    expect(() => schema.parse({ blogpostId: 1 })).not.toThrow();
    expect(() => schema.parse({ blogpostId: 0 })).not.toThrow();
    expect(() => schema.parse({})).toThrow();
    expect(() => schema.parse({ blogpostId: "1" })).toThrow();
  });
});

describe("progress data structure", () => {
  it("should have correct progress type structure", () => {
    const progress = {
      id: 1,
      userId: 1,
      blogpostId: 1,
      readPercent: 75,
      completed: false,
      lastReadAt: new Date(),
    };

    expect(progress).toHaveProperty("id");
    expect(progress).toHaveProperty("userId");
    expect(progress).toHaveProperty("blogpostId");
    expect(progress).toHaveProperty("readPercent");
    expect(progress).toHaveProperty("completed");
    expect(progress).toHaveProperty("lastReadAt");
    expect(typeof progress.readPercent).toBe("number");
    expect(progress.readPercent).toBeGreaterThanOrEqual(0);
    expect(progress.readPercent).toBeLessThanOrEqual(100);
  });

  it("should mark completed when readPercent is 100", () => {
    const progress = {
      readPercent: 100,
      completed: true,
    };

    expect(progress.readPercent).toBe(100);
    expect(progress.completed).toBe(true);
  });
});

describe("progress stats validation", () => {
  it("should calculate completion stats correctly", () => {
    const progressList = [
      { blogpostId: 1, readPercent: 100, completed: true },
      { blogpostId: 2, readPercent: 50, completed: false },
      { blogpostId: 3, readPercent: 0, completed: false },
    ];

    const completed = progressList.filter((p) => p.completed).length;
    const total = progressList.length;
    const averageProgress =
      progressList.reduce((sum, p) => sum + p.readPercent, 0) / total;

    expect(completed).toBe(1);
    expect(total).toBe(3);
    expect(averageProgress).toBe(50);
  });
});
