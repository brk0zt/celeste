import { useMemo } from 'react';
import { trpc } from '@/providers/trpc';
import type { VirtualLab, Quiz } from '@/types';

export function useLabs(blogpostId: number | null) {
  const { data: dbLabs = [], isLoading } = trpc.labs.listByPost.useQuery(
    { blogpostId: blogpostId ?? 0 },
    { enabled: !!blogpostId, retry: false }
  );

  const labs: VirtualLab[] = useMemo(() => {
    return dbLabs.map((l) => ({
      id: String(l.id),
      blogpostId: l.blogpostId,
      title: l.title,
      description: l.description ?? undefined,
      instructions: l.instructions ?? undefined,
      codeTemplate: l.codeTemplate ?? undefined,
      expectedOutput: l.expectedOutput ?? undefined,
      order: l.order,
    }));
  }, [dbLabs]);

  return { labs, isLoading };
}

export function useQuizzes(blogpostId: number | null) {
  const { data: dbQuizzes = [], isLoading } = trpc.quizzes.listByPost.useQuery(
    { blogpostId: blogpostId ?? 0 },
    { enabled: !!blogpostId, retry: false }
  );

  const quizzes: Quiz[] = useMemo(() => {
    return dbQuizzes.map((q) => ({
      id: String(q.id),
      blogpostId: q.blogpostId,
      question: q.question,
      options: (q.options as string[]) ?? [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ?? undefined,
      order: q.order,
    }));
  }, [dbQuizzes]);

  return { quizzes, isLoading };
}
