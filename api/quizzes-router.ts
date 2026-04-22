import { z } from "zod";
import { eq, asc, like } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { quizzes, blogposts } from "../db/schema";

const STARTER_QUIZZES = [
  {
    targetTitle: "大语言模型概述",
    question: "Transformer架构是哪一年提出的？",
    options: ["2015", "2017", "2019", "2020"],
    correctAnswer: 1,
    explanation: "Transformer架构于2017年在论文《Attention Is All You Need》中提出。",
    order: 1,
  },
  {
    targetTitle: "大语言模型概述",
    question: "GPT-3大约有多少参数？",
    options: ["15亿", "100亿", "1750亿", "1万亿"],
    correctAnswer: 2,
    explanation: "GPT-3拥有约1750亿参数，是2020年发布时最大的语言模型之一。",
    order: 2,
  },
  {
    targetTitle: "Transformer架构",
    question: "注意力计算中的缩放因子是什么？",
    options: ["d_k", "√d_k", "d_k²", "1/d_k"],
    correctAnswer: 1,
    explanation: "注意力分数通过除以√d_k进行缩放，防止Softmax梯度消失。",
    order: 1,
  },
  {
    targetTitle: "Transformer架构",
    question: "多头注意力中通常有多少个头？",
    options: ["2", "4", "8或16", "64"],
    correctAnswer: 2,
    explanation: "多头注意力通常使用8或16个头，让模型在不同子空间中捕捉关系。",
    order: 2,
  },
  {
    targetTitle: "预训练与微调",
    question: "LoRA的全称是什么？",
    options: ["Low-Rank Adaptation", "Large Object Recognition", "Long Range Attention", "Local Response Activation"],
    correctAnswer: 0,
    explanation: "LoRA = Low-Rank Adaptation，通过低秩矩阵减少可训练参数。",
    order: 1,
  },
  {
    targetTitle: "提示工程",
    question: "Chain-of-Thought提示工程的核心思想是什么？",
    options: ["使用更多示例", "让模型逐步推理", "增加提示长度", "使用更复杂的模型"],
    correctAnswer: 1,
    explanation: "Chain-of-Thought引导模型逐步推理，显著提升复杂任务表现。",
    order: 1,
  },
];

export const quizzesRouter = createRouter({
  listByPost: publicQuery
    .input(z.object({ blogpostId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const quizList = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.blogpostId, input.blogpostId))
        .orderBy(asc(quizzes.order));
      return quizList;
    }),

  get: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, input.id));
      return quiz ?? null;
    }),

  create: authedQuery
    .input(z.object({
      blogpostId: z.number(),
      question: z.string().min(1),
      options: z.array(z.string()),
      correctAnswer: z.number(),
      explanation: z.string().optional(),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(quizzes).values(input);
      return { id: Number(result.insertId) };
    }),

  seed: publicQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select().from(quizzes);
    if (existing.length > 0) return { success: true, alreadySeeded: true };

    for (const quiz of STARTER_QUIZZES) {
      const [targetPost] = await db
        .select()
        .from(blogposts)
        .where(like(blogposts.title, `%${quiz.targetTitle}%`));

      if (targetPost) {
        await db.insert(quizzes).values({
          blogpostId: targetPost.id,
          question: quiz.question,
          options: quiz.options,
          correctAnswer: quiz.correctAnswer,
          explanation: quiz.explanation,
          order: quiz.order,
        });
      }
    }
    return { success: true };
  }),
});
