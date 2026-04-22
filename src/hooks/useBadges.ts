import { useCallback, useMemo } from 'react';
import { trpc } from '@/providers/trpc';
import type { Badge, UserBadge } from '@/types';

export function useBadges() {
  const utils = trpc.useUtils();

  const { data: dbBadges = [], isLoading: allLoading } = trpc.badges.list.useQuery(
    undefined,
    { retry: false }
  );

  const { data: dbUserBadges = [], isLoading: myLoading } = trpc.badges.myBadges.useQuery(
    undefined,
    { retry: false }
  );

  const badges: Badge[] = useMemo(() => {
    return dbBadges.map((b) => ({
      id: String(b.id),
      name: b.name,
      description: b.description ?? undefined,
      icon: b.icon ?? undefined,
      color: b.color ?? undefined,
      requirement: b.requirement ?? undefined,
    }));
  }, [dbBadges]);

  const userBadges: UserBadge[] = useMemo(() => {
    return dbUserBadges.map((b) => ({
      id: String(b.id),
      name: b.name,
      description: b.description ?? undefined,
      icon: b.icon ?? undefined,
      color: b.color ?? undefined,
      awardedAt: b.awardedAt,
    }));
  }, [dbUserBadges]);

  const awardMutation = trpc.badges.award.useMutation({
    onSuccess: () => {
      utils.badges.myBadges.invalidate();
    },
  });

  const seedMutation = trpc.badges.seed.useMutation({
    onSuccess: () => {
      utils.badges.list.invalidate();
    },
  });

  const awardBadge = useCallback((badgeId: number) => {
    awardMutation.mutate({ badgeId });
  }, [awardMutation]);

  const seedBadges = useCallback(() => {
    seedMutation.mutate();
  }, [seedMutation]);

  return {
    badges,
    userBadges,
    isLoading: allLoading || myLoading,
    awardBadge,
    seedBadges,
  };
}
