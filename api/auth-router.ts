import { z } from "zod";
import * as cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { findUserByEmail, createUser, updateUser } from "./queries/users";
import { hashPasswordWithSalt, verifyPassword } from "./auth/password";
import { signSessionToken } from "./auth/session";

// Cookie helper for auth
async function setAuthCookie(resHeaders: Headers, userId: number, email: string, reqHeaders: Headers) {
  const token = await signSessionToken({ userId, email });
  const opts = getSessionCookieOptions(reqHeaders);
  resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: Session.maxAgeMs / 1000,
    }),
  );
}

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  // Register new user
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        password: z.string().min(6).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if email already exists
      const existingUser = await findUserByEmail(input.email);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // Hash password
      const passwordHash = hashPasswordWithSalt(input.password);

      // Create user
      const result = await createUser({
        name: input.name,
        email: input.email,
        passwordHash,
        role: "user",
      });

      const userId = Number(result.insertId);

      // Set auth cookie
      await setAuthCookie(ctx.resHeaders, userId, input.email, ctx.req.headers);

      return {
        success: true,
        user: {
          id: userId,
          name: input.name,
          email: input.email,
        },
      };
    }),

  // Login with email/password
  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Find user by email
      const user = await findUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Verify password
      const isValid = verifyPassword(input.password, user.passwordHash);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Update last sign in time
      await updateUser(user.id, { lastSignInAt: new Date() });

      // Set auth cookie
      await setAuthCookie(ctx.resHeaders, user.id, user.email, ctx.req.headers);

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          role: user.role,
        },
      };
    }),

  updateBio: authedQuery
    .input(z.object({ bio: z.string().max(500) }))
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user.id, { bio: input.bio });
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
