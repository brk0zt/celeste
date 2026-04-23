import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  json,
  int,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  avatar: text("avatar"),
  bio: text("bio"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const notes = mysqlTable("notes", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  tags: json("tags").$type<string[]>(),
  source: text("source"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

export const blogposts = mysqlTable("blogposts", {
  id: serial("id").primaryKey(),
  authorId: bigint("authorId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  bannerUrl: text("bannerUrl"),
  videoUrl: text("videoUrl"),
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>(),
  readTime: int("readTime"),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Blogpost = typeof blogposts.$inferSelect;
export type InsertBlogpost = typeof blogposts.$inferInsert;

export const userProgress = mysqlTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  blogpostId: bigint("blogpostId", { mode: "number", unsigned: true }).notNull(),
  readPercent: int("readPercent").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  lastReadAt: timestamp("lastReadAt").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

export const badges = mysqlTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  color: varchar("color", { length: 20 }),
  requirement: text("requirement"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

export const userBadges = mysqlTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  badgeId: bigint("badgeId", { mode: "number", unsigned: true }).notNull(),
  awardedAt: timestamp("awardedAt").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

export const virtualLabs = mysqlTable("virtual_labs", {
  id: serial("id").primaryKey(),
  blogpostId: bigint("blogpostId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  instructions: text("instructions"),
  codeTemplate: text("codeTemplate"),
  expectedOutput: text("expectedOutput"),
  order: int("order").default(0).notNull(),
});

export type VirtualLab = typeof virtualLabs.$inferSelect;
export type InsertVirtualLab = typeof virtualLabs.$inferInsert;

export const quizzes = mysqlTable("quizzes", {
  id: serial("id").primaryKey(),
  blogpostId: bigint("blogpostId", { mode: "number", unsigned: true }).notNull(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>(),
  correctAnswer: int("correctAnswer").notNull(),
  explanation: text("explanation"),
  order: int("order").default(0).notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;
