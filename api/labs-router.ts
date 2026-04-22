import { z } from "zod";
import { eq, asc, like } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { virtualLabs, blogposts } from "../db/schema";

const STARTER_LABS = [
  {
    targetTitle: "Transformer架构",
    title: "注意力分数计算器",
    description: "通过交互式工具理解Scaled Dot-Product Attention的计算过程。",
    instructions: "输入Query和Key向量，观察注意力分数的计算结果。调整数值，理解缩放因子的作用。",
    codeTemplate: "// 注意力分数计算\nfunction attentionScore(Q, K, d_k) {\n  const score = dotProduct(Q, K) / Math.sqrt(d_k);\n  return score;\n}",
    expectedOutput: "理解注意力分数的数值范围和分布特性",
    order: 1,
  },
  {
    targetTitle: "Transformer架构",
    title: "多头注意力可视化",
    description: "可视化多头注意力中不同头的关注模式。",
    instructions: "观察不同注意力头的关注热力图，理解多头机制如何捕获不同类型的关系。",
    codeTemplate: "// 多头注意力可视化\nconst heads = 8;\nfor (let h = 0; h < heads; h++) {\n  visualizeAttention(h);\n}",
    expectedOutput: "识别不同注意力头的专业化模式",
    order: 2,
  },
  {
    targetTitle: "预训练与微调",
    title: "LoRA参数实验",
    description: "探索不同秩(r)对LoRA微调效果的影响。",
    instructions: "调整LoRA的秩参数，观察可训练参数数量和模型性能的变化。",
    codeTemplate: "// LoRA配置\nconst loraConfig = {\n  r: 8,        // 秩\n  lora_alpha: 16,\n  target_modules: ['q_proj', 'v_proj']\n};",
    expectedOutput: "找到性能和效率的最佳平衡点",
    order: 1,
  },
  {
    targetTitle: "提示工程",
    title: "提示词模板工坊",
    description: "构建和测试不同的提示词模板。",
    instructions: "使用不同的提示工程技术（Zero-Shot、Few-Shot、CoT），比较输出质量。",
    codeTemplate: "// Few-Shot模板\nconst examples = [\n  { input: '...', output: '...' },\n];\nconst prompt = buildFewShotPrompt(examples, userInput);",
    expectedOutput: "掌握不同提示技术的适用场景",
    order: 1,
  },
];

export const labsRouter = createRouter({
  listByPost: publicQuery
    .input(z.object({ blogpostId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const labs = await db
        .select()
        .from(virtualLabs)
        .where(eq(virtualLabs.blogpostId, input.blogpostId))
        .orderBy(asc(virtualLabs.order));
      return labs;
    }),

  get: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [lab] = await db
        .select()
        .from(virtualLabs)
        .where(eq(virtualLabs.id, input.id));
      return lab ?? null;
    }),

  create: authedQuery
    .input(z.object({
      blogpostId: z.number(),
      title: z.string().min(1),
      description: z.string().optional(),
      instructions: z.string().optional(),
      codeTemplate: z.string().optional(),
      expectedOutput: z.string().optional(),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(virtualLabs).values(input);
      return { id: Number(result.insertId) };
    }),

  seed: publicQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select().from(virtualLabs);
    if (existing.length > 0) return { success: true, alreadySeeded: true };

    for (const lab of STARTER_LABS) {
      const [targetPost] = await db
        .select()
        .from(blogposts)
        .where(like(blogposts.title, `%${lab.targetTitle}%`));
      
      if (targetPost) {
        await db.insert(virtualLabs).values({
          blogpostId: targetPost.id,
          title: lab.title,
          description: lab.description,
          instructions: lab.instructions,
          codeTemplate: lab.codeTemplate,
          expectedOutput: lab.expectedOutput,
          order: lab.order,
        });
      }
    }
    return { success: true };
  }),
});
