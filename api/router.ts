import { authRouter } from "./auth-router";
import { notesRouter } from "./notes-router";
import { blogpostsRouter } from "./blogposts-router";
import { progressRouter } from "./progress-router";
import { badgesRouter } from "./badges-router";
import { labsRouter } from "./labs-router";
import { quizzesRouter } from "./quizzes-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  notes: notesRouter,
  blogposts: blogpostsRouter,
  progress: progressRouter,
  badges: badgesRouter,
  labs: labsRouter,
  quizzes: quizzesRouter,
});

export type AppRouter = typeof appRouter;
