import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { userProgress, blogposts } from "../db/schema";

export const progressRouter = createRouter({
  get: authedQuery
    .input(z.object({ blogpostId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [progress] = await db
        .select()
        .from(userProgress)
        .where(and(
          eq(userProgress.userId, ctx.user.id),
          eq(userProgress.blogpostId, input.blogpostId)
        ));
      return progress ?? null;
    }),

  update: authedQuery
    .input(z.object({
      blogpostId: z.number(),
      readPercent: z.number().min(0).max(100),
      completed: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { blogpostId, readPercent, completed } = input;
      const existing = await db
        .select()
        .from(userProgress)
        .where(and(
          eq(userProgress.userId, ctx.user.id),
          eq(userProgress.blogpostId, blogpostId)
        ));

      if (existing.length > 0) {
        await db.update(userProgress)
          .set({
            readPercent,
            completed: completed ?? readPercent >= 100,
            lastReadAt: new Date(),
          })
          .where(eq(userProgress.id, existing[0].id));
      } else {
        await db.insert(userProgress).values({
          userId: ctx.user.id,
          blogpostId,
          readPercent,
          completed: completed ?? readPercent >= 100,
        });
      }
      return { success: true };
    }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id))
      .orderBy(desc(userProgress.lastReadAt));
    return progress;
  }),

  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id));

    const totalPosts = await db.select().from(blogposts);
    const completed = progress.filter(p => p.completed).length;
    const inProgress = progress.filter(p => !p.completed && p.readPercent > 0).length;

    return {
      totalPosts: totalPosts.length,
      completed,
      inProgress,
      notStarted: totalPosts.length - completed - inProgress,
    };
  }),
});
