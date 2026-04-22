import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { blogposts } from "../db/schema";

const STARTER_BLOGPOSTS = [
  {
    title: "大语言模型概述",
    excerpt: "探索LLM的核心特征、发展历程与代表模型，从Transformer到AGI的知识之旅。",
    content: `# 大语言模型概述

**大语言模型**（Large Language Model，简称LLM）是基于深度学习技术构建的人工智能模型，专门用于理解和生成自然语言。它们通过在海量文本数据上进行训练，学会了语言的统计规律和语义表示。

## 核心特征

- **参数量巨大**：从数十亿到数万亿不等
- **涌现能力**：规模达到某个阈值后突然表现出新的能力
- **上下文学习**：通过提示词（prompt）就能完成新任务，无需微调
- **多任务通用**：一个模型可以处理翻译、摘要、问答、代码生成等多种任务

## 发展历程

| 时间 | 里程碑 |
|------|--------|
| 2017 | Transformer架构提出 |
| 2018 | GPT-1、BERT发布 |
| 2019 | GPT-2发布（15亿参数） |
| 2020 | GPT-3发布（1750亿参数） |
| 2022 | ChatGPT发布，引发AI革命 |
| 2023 | GPT-4、Claude、Gemini等大模型涌现 |
| 2024 | 多模态大模型、推理模型（o1）出现 |

## 主要代表模型

- **OpenAI**：GPT系列、GPT-4、o1推理模型
- **Anthropic**：Claude系列
- **Google**：Gemini、PaLM
- **Meta**：LLaMA系列（开源）
- **DeepSeek**：DeepSeek-V3、DeepSeek-R1
- **阿里**：通义千问（Qwen）

参见[[Transformer架构]]、[[预训练与微调]]、[[提示工程]]`,
    category: "AI基础",
    tags: ["概述", "AI", "LLM"],
    readTime: 8,
    bannerUrl: "",
  },
  {
    title: "Transformer架构",
    excerpt: "深入理解Attention Is All You Need，掌握现代NLP的基石架构。",
    content: `# Transformer架构

**Transformer**是2017年Google在论文《Attention Is All You Need》中提出的神经网络架构，它彻底改变了自然语言处理领域，成为所有现代大语言模型的基础。

## 核心创新

Transformer完全基于**注意力机制**（Attention），摒弃了之前广泛使用的循环神经网络（RNN）和卷积神经网络（CNN）。

> "Attention Is All You Need" —— 论文标题本身就说明了核心思想

## 架构组成

Transformer由**编码器**（Encoder）和**解码器**（Decoder）两部分组成：

### 编码器（Encoder）

- 由N个相同的编码器层堆叠（原论文中N=6）
- 每层包含：
  1. **多头自注意力机制** —— 让每个词关注序列中所有其他词
  2. **前馈神经网络** —— 对每个位置独立进行非线性变换
  3. **层归一化 + 残差连接** —— 稳定训练

### 解码器（Decoder）

- 同样由N个相同的解码器层堆叠
- 每层额外包含**掩码多头注意力** —— 防止看到未来的词
- 最终通过Softmax输出概率分布

## 关键组件

### 位置编码（Positional Encoding）

由于Transformer没有循环结构，需要显式注入位置信息：

\`\`\`
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
\`\`\`

### 多头注意力（Multi-Head Attention）

将注意力机制并行执行多次，让模型在不同表示子空间中捕捉不同的关系模式。

## 为什么Transformer如此强大

1. **并行计算** —— 不像RNN需要顺序处理
2. **长距离依赖** —— 注意力可以直接连接任意两个位置
3. **可扩展性** —— 堆叠更多层、增加更多参数就能持续提升性能

参见[[注意力机制]]、[[大语言模型概述]]、[[预训练与微调]]`,
    category: "架构",
    tags: ["架构", "Transformer", "深度学习"],
    readTime: 12,
    bannerUrl: "",
  },
  {
    title: "注意力机制",
    excerpt: "从Scaled Dot-Product到Multi-Head，揭开注意力机制的数学之美。",
    content: `# 注意力机制

**注意力机制**（Attention Mechanism）是深度学习中最具革命性的创新之一，它让模型能够动态地关注输入中最相关的部分。

## 直观理解

注意力机制模仿人类的注意力：当我们阅读一段话时，不会对所有词给予同等的关注，而是会根据当前任务聚焦于关键信息。

## Scaled Dot-Product Attention

Transformer中使用的注意力计算：

\`\`\`
Attention(Q, K, V) = softmax(QK^T / √d_k) · V
\`\`\`

### 三个关键矩阵

| 矩阵 | 含义 | 作用 |
|------|------|------|
| **Q** (Query) | 查询 | 当前位置想"问什么" |
| **K** (Key) | 键 | 其他位置的"标签" |
| **V** (Value) | 值 | 其他位置的"实际内容" |

### 计算步骤

1. 计算Q和K的点积，得到注意力分数
2. 除以√d_k进行缩放（防止Softmax梯度消失）
3. Softmax归一化为概率分布
4. 与V相乘，得到加权求和的输出

## 自注意力 vs 交叉注意力

### 自注意力（Self-Attention）

Q、K、V都来自同一个输入序列。每个词都可以"看"到序列中所有其他词。

> 例：在"The cat sat on the mat"中，处理"sat"时，自注意力会让它关注到"cat"和"mat"。

### 交叉注意力（Cross-Attention）

Q来自解码器，K和V来自编码器。用于seq2seq任务中让解码器关注编码器的输出。

## 多头注意力（Multi-Head Attention）

将注意力计算并行执行h次（通常h=8或16），每次使用不同的线性投影：

\`\`\`
MultiHead(Q,K,V) = Concat(head_1, ..., head_h) · W^O
\`\`\`

其中每个head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)

### 为什么需要多头？

- 不同头可以学习不同的关系类型
- 一个头可能学习语法关系，另一个学习语义关系
- 增加模型的表达能力

## 掩码注意力（Masked Attention）

在解码器中，使用上三角掩码矩阵防止位置i关注到位置>i的词，确保自回归生成。

## 应用扩展

- **视觉Transformer（ViT）**：将注意力用于图像处理
- **图注意力网络（GAT）**：将注意力用于图结构数据
- **多模态注意力**：跨模态注意力（如图像-文本对齐）

参见[[Transformer架构]]、[[大语言模型概述]]`,
    category: "架构",
    tags: ["注意力机制", "深度学习", "核心概念"],
    readTime: 10,
    bannerUrl: "",
  },
  {
    title: "预训练与微调",
    excerpt: "掌握Pre-training & Fine-tuning范式，从LoRA到全参数微调的方法论。",
    content: `# 预训练与微调

**预训练-微调**（Pre-training & Fine-tuning）范式是大语言模型成功的关键方法论。它分为两个阶段：先在大量无标注数据上学习通用语言表示，再在特定任务的标注数据上进行调整。

## 预训练（Pre-training）

### 目标

让模型学习语言的通用表示：语法、语义、世界知识、推理能力等。

### 主要方法

#### 1. 自回归语言建模（Autoregressive LM）

**代表**：GPT系列

目标：给定前面的词，预测下一个词

\`\`\`
L = -Σ log P(x_i | x_1, x_2, ..., x_{i-1})
\`\`\`

优点：擅长生成任务
缺点：只能单向编码上下文

#### 2. 掩码语言建模（Masked LM）

**代表**：BERT

随机掩码输入中15%的词，让模型预测被掩码的词

优点：双向编码，理解能力更强
缺点：不适合直接生成

#### 3. 前缀语言建模（Prefix LM）

**代表**：T5、GLM

结合以上两种方法的优点

## 微调（Fine-tuning）

### 全参数微调

在预训练模型的所有参数上继续训练，需要大量计算资源。

### 高效微调方法

#### LoRA（Low-Rank Adaptation）

只训练低秩适配矩阵，大幅减少参数量：

\`\`\`
W' = W + ΔW = W + BA
\`\`\`

其中B ∈ R^(d×r)，A ∈ R^(r×k)，r << d,k

通常r=8或16，可训练参数减少99%以上。

#### 其他高效方法

| 方法 | 原理 |
|------|------|
| **Prompt Tuning** | 学习软提示嵌入 |
| **Prefix Tuning** | 学习前缀向量 |
| **Adapter** | 在层间插入小型适配模块 |
| **IA³** | 学习缩放向量 |

## 预训练数据

### 数据来源

- Common Crawl（网页数据）
- GitHub（代码数据）
- 书籍（BooksCorpus、Gutenberg）
- 维基百科
- 学术论文
- 社交媒体对话

### 数据清洗

- 去重（MinHash/LSH）
- 质量过滤（基于困惑度、规则过滤）
- 隐私脱敏（PII检测与移除）
- 毒性内容过滤

## 训练成本

GPT-3级别的模型训练成本：

- 算力：数千张V100/A100 GPU
- 时间：数周到数月
- 费用：数百万到数千万美元

参见[[大语言模型概述]]、[[Transformer架构]]、[[模型评估]]`,
    category: "训练",
    tags: ["训练", "微调", "LoRA", "方法论"],
    readTime: 15,
    bannerUrl: "",
  },
  {
    title: "提示工程",
    excerpt: "从Zero-Shot到Chain-of-Thought，解锁大模型潜能的实用技巧。",
    content: `# 提示工程

**提示工程**（Prompt Engineering）是设计和优化输入提示（prompt），以引导大语言模型产生期望输出的技术。它是使用LLM最核心、最高效的技能。

## 基本原则

1. **清晰具体** —— 明确告诉模型你想要什么
2. **提供上下文** —— 给模型足够的背景信息
3. **给出示例** —— 用样例展示期望的输出格式
4. **分解任务** —— 复杂任务拆分成简单步骤

## 核心技巧

### Zero-Shot Prompting

直接描述任务，不提供示例：

\`\`\`
请将以下英文翻译成中文：
"The future of AI is bright."
\`\`\`

### Few-Shot Prompting

提供几个输入-输出示例，让模型学习模式：

\`\`\`
英文 → 中文
"Hello" → "你好"
"Good morning" → "早上好"
"How are you?" → "你好吗？"
"Nice to meet you" → 
\`\`\`

### Chain-of-Thought（思维链）

引导模型逐步推理，显著提升复杂任务表现：

\`\`\`
问题：小明有5个苹果，给了小红2个，又买了3个，现在有几个？

让我们一步步思考：
- 初始有5个苹果
- 给了小红2个，还剩 5 - 2 = 3个
- 又买了3个，现在有 3 + 3 = 6个
- 答案：6个苹果
\`\`\`

### 高级技巧

| 技巧 | 说明 |
|------|------|
| **角色设定** | "你是一位资深程序员..." |
| **思维树（ToT）** | 探索多个推理路径 |
| **自我一致性** | 多次采样选择最一致的答案 |
| **ReAct** | 推理+行动循环，结合工具使用 |
| **反射（Reflection）** | 让模型自我评估和改进 |

## 结构化输出

通过提示让模型输出JSON、Markdown等结构化格式：

\`\`\`
请分析以下评论的情感，以JSON格式输出：
{"sentiment": "positive/negative/neutral", "confidence": 0-1, "reason": "..."}
\`\`\`

## 常见陷阱

- **提示注入攻击** —— 用户输入覆盖系统指令
- **模糊指令** —— 模型不理解真实意图
- **过度拟合示例** —— 模型只模仿格式不理解逻辑
- **忽略边缘情况** —— 没有考虑所有可能的输入

参见[[大语言模型概述]]、[[RAG]]、[[AI安全与对齐]]`,
    category: "实践",
    tags: ["提示工程", "实践", "Prompt"],
    readTime: 10,
    bannerUrl: "",
  },
  {
    title: "RAG检索增强生成",
    excerpt: "让LLM拥有实时知识，构建企业级知识库问答系统。",
    content: `# RAG（检索增强生成）

**RAG**（Retrieval-Augmented Generation，检索增强生成）是一种将外部知识检索与LLM生成能力结合的技术框架。它让模型能够访问训练数据中没有的最新、专有信息。

## 为什么需要RAG

大语言模型存在固有局限：

- **知识截止日期** —— 无法知道训练后的新信息
- **幻觉问题** —— 可能生成看似合理但实际错误的内容
- **专有知识缺失** —— 不了解企业内部的私有数据

RAG通过检索外部文档来解决这些问题。

## RAG架构

典型的RAG流程包含三个核心组件：

### 1. 索引（Indexing）

\`\`\`
文档 → 分块 → 向量化 → 存入向量数据库
\`\`\`

- **文档加载**：PDF、Word、网页、数据库等
- **分块策略**：按段落、固定大小、语义分块
- **嵌入模型**：将文本转为向量（如text-embedding-ada-002）

### 2. 检索（Retrieval）

\`\`\`
用户问题 → 向量化 → 相似度搜索 → 返回Top-K文档
\`\`\`

- **向量搜索**：余弦相似度、欧氏距离
- **混合搜索**：向量搜索 + 关键词搜索（BM25）
- **重排序（Reranking）**：用更精确的模型重新排序

### 3. 生成（Generation）

\`\`\`
[系统指令 + 检索到的文档 + 用户问题] → LLM → 生成回答
\`\`\`

## RAG vs 微调

| 维度 | RAG | 微调 |
|------|-----|------|
| 知识更新 | 实时更新向量库 | 需要重新训练 |
| 所需数据 | 原始文档 | 标注数据 |
| 幻觉风险 | 低（有文档支撑） | 中 |
| 成本 | 低 | 高 |
| 适用场景 | 知识库问答 | 风格/格式定制 |

## 高级RAG技术

### 查询优化

- **查询扩展**：用LLM扩展同义词和相关词
- **假设文档嵌入（HyDE）**：生成假设答案再检索
- **查询重写**：优化用户原始查询

### 多路召回

- 多向量表示（摘要向量、关键词向量等）
- 图检索（知识图谱增强）
- 多模态检索（文本+图像）

### 后处理

- **上下文压缩**：只保留最相关的片段
- **引用生成**：让模型标注信息来源

## 常用工具

- **向量数据库**：Pinecone、Milvus、Chroma、Weaviate、Qdrant
- **框架**：LangChain、LlamaIndex、Haystack
- **嵌入模型**：OpenAI Ada、BGE、M3E

参见[[提示工程]]、[[大语言模型概述]]、[[模型评估]]`,
    category: "应用",
    tags: ["RAG", "应用", "向量检索", "架构"],
    readTime: 12,
    bannerUrl: "",
  },
];

export const blogpostsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const posts = await db
      .select()
      .from(blogposts)
      .where(eq(blogposts.published, true))
      .orderBy(desc(blogposts.createdAt));
    return posts;
  }),

  get: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [post] = await db
        .select()
        .from(blogposts)
        .where(eq(blogposts.id, input.id));
      return post ?? null;
    }),

  create: authedQuery
    .input(z.object({
      title: z.string().min(1),
      content: z.string(),
      excerpt: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      readTime: z.number().optional(),
      bannerUrl: z.string().optional(),
      videoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [result] = await db.insert(blogposts).values({
        authorId: ctx.user.id,
        ...input,
        tags: input.tags ?? [],
        published: true,
      });
      return { id: Number(result.insertId) };
    }),

  update: authedQuery
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      readTime: z.number().optional(),
      bannerUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      await db.update(blogposts)
        .set(updates)
        .where(and(
          eq(blogposts.id, id),
          eq(blogposts.authorId, ctx.user.id)
        ));
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(blogposts)
        .where(and(
          eq(blogposts.id, input.id),
          eq(blogposts.authorId, ctx.user.id)
        ));
      return { success: true };
    }),

  seed: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const existing = await db
      .select()
      .from(blogposts)
      .where(eq(blogposts.authorId, ctx.user.id));

    if (existing.length === 0) {
      for (const starter of STARTER_BLOGPOSTS) {
        await db.insert(blogposts).values({
          authorId: ctx.user.id,
          ...starter,
          published: true,
        });
      }
    }
    return { success: true };
  }),
});
