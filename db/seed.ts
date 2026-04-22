import { eq, like } from "drizzle-orm";
import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

async function seed() {
  console.log("Seeding global data...");
  const db = getDb();

  // 1. Seed badges
  const existingBadges = await db.select().from(schema.badges);
  if (existingBadges.length === 0) {
    const badgeData = [
      { name: "星际探索者", description: "完成第一篇博客阅读", icon: "rocket", color: "#c8956c", requirement: "read_first_post" },
      { name: "知识收藏家", description: "完成5篇博客阅读", icon: "book", color: "#6b8cae", requirement: "read_5_posts" },
      { name: "实验室研究员", description: "完成第一个虚拟实验", icon: "flask", color: "#8fbc8f", requirement: "complete_first_lab" },
      { name: "答题高手", description: "完成第一个测验并获得满分", icon: "star", color: "#d4a574", requirement: "perfect_quiz" },
      { name: "内容创作者", description: "发布第一篇博客", icon: "pen", color: "#b8a9c9", requirement: "create_first_post" },
      { name: "满月读者", description: "阅读所有博客内容", icon: "moon", color: "#e0e0e0", requirement: "read_all_posts" },
    ];
    for (const badge of badgeData) {
      await db.insert(schema.badges).values(badge);
    }
    console.log(`  Seeded ${badgeData.length} badges`);
  }

  // 2. Seed blogposts (system/global posts)
  const existingPosts = await db.select().from(schema.blogposts);
  let postIds: number[] = existingPosts.map(p => p.id);

  if (existingPosts.length === 0) {
    const blogpostData = [
      {
        authorId: 1,
        title: "大语言模型概述",
        excerpt: "探索LLM的核心特征、发展历程与代表模型，从Transformer到AGI的知识之旅。",
        content: `# 大语言模型概述

**大语言模型**（Large Language Model，简称LLM）是基于深度学习技术构建的人工智能模型，专门用于理解和生成自然语言。

## 核心特征

- **参数量巨大**：从数十亿到数万亿不等
- **涌现能力**：规模达到某个阈值后突然表现出新的能力
- **上下文学习**：通过提示词就能完成新任务

## 发展历程

| 时间 | 里程碑 |
|------|--------|
| 2017 | Transformer架构提出 |
| 2020 | GPT-3发布（1750亿参数） |
| 2022 | ChatGPT发布 |

参见[[Transformer架构]]、[[预训练与微调]]、[[提示工程]]`,
        category: "AI基础",
        tags: ["概述", "AI", "LLM"],
        readTime: 8,
        published: true,
      },
      {
        authorId: 1,
        title: "Transformer架构",
        excerpt: "深入理解Attention Is All You Need，掌握现代NLP的基石架构。",
        content: `# Transformer架构

**Transformer**是2017年Google提出的神经网络架构，成为所有现代大语言模型的基础。

## 核心创新

完全基于**注意力机制**，摒弃了RNN和CNN。

## 架构组成

### 编码器（Encoder）
- 多头自注意力机制
- 前馈神经网络
- 层归一化 + 残差连接

### 解码器（Decoder）
- 掩码多头注意力
- Softmax输出概率分布

## 关键组件

### 位置编码
由于Transformer没有循环结构，需要显式注入位置信息。

### 多头注意力
将注意力计算并行执行多次，捕捉不同的关系模式。`,
        category: "架构",
        tags: ["架构", "Transformer", "深度学习"],
        readTime: 12,
        published: true,
      },
      {
        authorId: 1,
        title: "注意力机制",
        excerpt: "从Scaled Dot-Product到Multi-Head，揭开注意力机制的数学之美。",
        content: `# 注意力机制

**注意力机制**让模型能够动态地关注输入中最相关的部分。

## Scaled Dot-Product Attention

\`\`\`
Attention(Q, K, V) = softmax(QK^T / √d_k) · V
\`\`\`

## 自注意力 vs 交叉注意力

### 自注意力
Q、K、V都来自同一个输入序列。

### 交叉注意力
Q来自解码器，K和V来自编码器。

## 多头注意力
将注意力计算并行执行h次。`,
        category: "架构",
        tags: ["注意力机制", "深度学习"],
        readTime: 10,
        published: true,
      },
      {
        authorId: 1,
        title: "预训练与微调",
        excerpt: "掌握Pre-training & Fine-tuning范式，从LoRA到全参数微调的方法论。",
        content: `# 预训练与微调

**预训练-微调**范式是大语言模型成功的关键方法论。

## 预训练

### 自回归语言建模
目标：给定前面的词，预测下一个词。

### 掩码语言建模
随机掩码输入中15%的词，让模型预测被掩码的词。

## 微调

### LoRA
只训练低秩适配矩阵，大幅减少参数量。

## 训练成本
GPT-3级别的模型训练需要数百万到数千万美元。`,
        category: "训练",
        tags: ["训练", "微调", "LoRA"],
        readTime: 15,
        published: true,
      },
      {
        authorId: 1,
        title: "提示工程",
        excerpt: "从Zero-Shot到Chain-of-Thought，解锁大模型潜能的实用技巧。",
        content: `# 提示工程

**提示工程**是设计和优化输入提示的技术。

## Zero-Shot Prompting
直接描述任务，不提供示例。

## Few-Shot Prompting
提供几个输入-输出示例。

## Chain-of-Thought
引导模型逐步推理，提升复杂任务表现。

## 高级技巧
- 角色设定
- 思维树
- 自我一致性`,
        category: "实践",
        tags: ["提示工程", "实践"],
        readTime: 10,
        published: true,
      },
      {
        authorId: 1,
        title: "RAG检索增强生成",
        excerpt: "让LLM拥有实时知识，构建企业级知识库问答系统。",
        content: `# RAG（检索增强生成）

**RAG**将外部知识检索与LLM生成能力结合。

## 架构

### 1. 索引
文档 → 分块 → 向量化 → 存入向量数据库

### 2. 检索
用户问题 → 向量化 → 相似度搜索

### 3. 生成
检索到的文档 + 用户问题 → LLM → 生成回答

## 常用工具
- Pinecone、Milvus、Chroma
- LangChain、LlamaIndex`,
        category: "应用",
        tags: ["RAG", "应用", "向量检索"],
        readTime: 12,
        published: true,
      },
    ];

    for (const post of blogpostData) {
      const [result] = await db.insert(schema.blogposts).values(post);
      postIds.push(Number(result.insertId));
    }
    console.log(`  Seeded ${blogpostData.length} blogposts`);
  }

  // 3. Seed labs linked to actual post IDs
  const existingLabs = await db.select().from(schema.virtualLabs);
  if (existingLabs.length === 0 && postIds.length >= 2) {
    const labData = [
      {
        blogpostId: postIds[1], // Transformer架构
        title: "注意力分数计算器",
        description: "通过交互式工具理解Scaled Dot-Product Attention的计算过程。",
        instructions: "输入Query和Key向量，观察注意力分数的计算结果。",
        codeTemplate: "function attentionScore(Q, K, d_k) {\n  return dotProduct(Q, K) / Math.sqrt(d_k);\n}",
        expectedOutput: "理解注意力分数的数值范围",
        order: 1,
      },
      {
        blogpostId: postIds[1],
        title: "多头注意力可视化",
        description: "可视化多头注意力中不同头的关注模式。",
        instructions: "观察不同注意力头的关注热力图。",
        codeTemplate: "for (let h = 0; h < 8; h++) {\n  visualizeAttention(h);\n}",
        expectedOutput: "识别不同注意力头的专业化模式",
        order: 2,
      },
      {
        blogpostId: postIds[3], // 预训练与微调
        title: "LoRA参数实验",
        description: "探索不同秩(r)对LoRA微调效果的影响。",
        instructions: "调整LoRA的秩参数，观察可训练参数数量变化。",
        codeTemplate: "const loraConfig = {\n  r: 8,\n  lora_alpha: 16,\n  target_modules: ['q_proj', 'v_proj']\n};",
        expectedOutput: "找到性能和效率的最佳平衡",
        order: 1,
      },
      {
        blogpostId: postIds[4], // 提示工程
        title: "提示词模板工坊",
        description: "构建和测试不同的提示词模板。",
        instructions: "使用不同的提示工程技术比较输出质量。",
        codeTemplate: "const examples = [{ input: '...', output: '...' }];\nconst prompt = buildFewShotPrompt(examples, userInput);",
        expectedOutput: "掌握不同提示技术的适用场景",
        order: 1,
      },
    ];
    for (const lab of labData) {
      await db.insert(schema.virtualLabs).values(lab);
    }
    console.log(`  Seeded ${labData.length} labs`);
  }

  // 4. Seed quizzes linked to actual post IDs
  const existingQuizzes = await db.select().from(schema.quizzes);
  if (existingQuizzes.length === 0 && postIds.length >= 2) {
    const quizData = [
      {
        blogpostId: postIds[0], // 大语言模型概述
        question: "Transformer架构是哪一年提出的？",
        options: ["2015", "2017", "2019", "2020"],
        correctAnswer: 1,
        explanation: "Transformer架构于2017年在论文《Attention Is All You Need》中提出。",
        order: 1,
      },
      {
        blogpostId: postIds[0],
        question: "GPT-3大约有多少参数？",
        options: ["15亿", "100亿", "1750亿", "1万亿"],
        correctAnswer: 2,
        explanation: "GPT-3拥有约1750亿参数。",
        order: 2,
      },
      {
        blogpostId: postIds[1], // Transformer架构
        question: "注意力计算中的缩放因子是什么？",
        options: ["d_k", "√d_k", "d_k²", "1/d_k"],
        correctAnswer: 1,
        explanation: "注意力分数通过除以√d_k进行缩放，防止Softmax梯度消失。",
        order: 1,
      },
      {
        blogpostId: postIds[1],
        question: "多头注意力中通常有多少个头？",
        options: ["2", "4", "8或16", "64"],
        correctAnswer: 2,
        explanation: "多头注意力通常使用8或16个头。",
        order: 2,
      },
      {
        blogpostId: postIds[3], // 预训练与微调
        question: "LoRA的全称是什么？",
        options: ["Low-Rank Adaptation", "Large Object Recognition", "Long Range Attention", "Local Response Activation"],
        correctAnswer: 0,
        explanation: "LoRA = Low-Rank Adaptation，通过低秩矩阵减少可训练参数。",
        order: 1,
      },
      {
        blogpostId: postIds[4], // 提示工程
        question: "Chain-of-Thought提示工程的核心思想是什么？",
        options: ["使用更多示例", "让模型逐步推理", "增加提示长度", "使用更复杂的模型"],
        correctAnswer: 1,
        explanation: "Chain-of-Thought引导模型逐步推理，提升复杂任务表现。",
        order: 1,
      },
    ];
    for (const quiz of quizData) {
      await db.insert(schema.quizzes).values(quiz);
    }
    console.log(`  Seeded ${quizData.length} quizzes`);
  }

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
