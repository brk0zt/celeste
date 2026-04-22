import { z } from "zod";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  updateBio: authedQuery
    .input(z.object({ bio: z.string().max(500) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.update(users)
        .set({ bio: input.bio })
        .where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
