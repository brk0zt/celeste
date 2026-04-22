import { useCallback } from 'react';
import { trpc } from '@/providers/trpc';

export function useProgress() {
  const utils = trpc.useUtils();

  const updateMutation = trpc.progress.update.useMutation({
    onSuccess: () => {
      utils.progress.list.invalidate();
      utils.progress.stats.invalidate();
    },
  });

  const { data: stats } = trpc.progress.stats.useQuery(
    undefined,
    { retry: false }
  );

  const updateProgress = useCallback((blogpostId: number, readPercent: number, completed?: boolean) => {
    updateMutation.mutate({ blogpostId, readPercent, completed });
  }, [updateMutation]);

  return {
    updateProgress,
    stats,
  };
}
