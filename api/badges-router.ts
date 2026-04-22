import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { badges, userBadges } from "../db/schema";

const STARTER_BADGES = [
  {
    name: "星际探索者",
    description: "完成第一篇博客阅读",
    icon: "rocket",
    color: "#c8956c",
    requirement: "read_first_post",
  },
  {
    name: "知识收藏家",
    description: "完成5篇博客阅读",
    icon: "book",
    color: "#6b8cae",
    requirement: "read_5_posts",
  },
  {
    name: "实验室研究员",
    description: "完成第一个虚拟实验",
    icon: "flask",
    color: "#8fbc8f",
    requirement: "complete_first_lab",
  },
  {
    name: "答题高手",
    description: "完成第一个测验并获得满分",
    icon: "star",
    color: "#d4a574",
    requirement: "perfect_quiz",
  },
  {
    name: "内容创作者",
    description: "发布第一篇博客",
    icon: "pen",
    color: "#b8a9c9",
    requirement: "create_first_post",
  },
  {
    name: "满月读者",
    description: "阅读所有博客内容",
    icon: "moon",
    color: "#e0e0e0",
    requirement: "read_all_posts",
  },
];

export const badgesRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const allBadges = await db.select().from(badges);
    return allBadges;
  }),

  myBadges: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userBadgeList = await db
      .select({
        id: badges.id,
        name: badges.name,
        description: badges.description,
        icon: badges.icon,
        color: badges.color,
        awardedAt: userBadges.awardedAt,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, ctx.user.id));
    return userBadgeList;
  }),

  award: authedQuery
    .input(z.object({ badgeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(userBadges)
        .where(and(
          eq(userBadges.userId, ctx.user.id),
          eq(userBadges.badgeId, input.badgeId)
        ));

      if (existing.length > 0) {
        return { success: false, alreadyAwarded: true };
      }

      await db.insert(userBadges).values({
        userId: ctx.user.id,
        badgeId: input.badgeId,
      });
      return { success: true };
    }),

  seed: publicQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select().from(badges);
    if (existing.length === 0) {
      for (const badge of STARTER_BADGES) {
        await db.insert(badges).values(badge);
      }
    }
    return { success: true };
  }),
});
