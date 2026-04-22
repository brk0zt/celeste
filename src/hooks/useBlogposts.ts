import { useCallback, useMemo } from 'react';
import { trpc } from '@/providers/trpc';
import type { Blogpost } from '@/types';

export function useBlogposts() {
  const utils = trpc.useUtils();

  const { data: dbPosts = [], isLoading } = trpc.blogposts.list.useQuery(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const blogposts: Blogpost[] = useMemo(() => {
    return dbPosts.map((p) => ({
      id: String(p.id),
      authorId: p.authorId,
      title: p.title,
      content: p.content,
      excerpt: p.excerpt ?? undefined,
      bannerUrl: p.bannerUrl ?? undefined,
      videoUrl: p.videoUrl ?? undefined,
      category: p.category ?? undefined,
      tags: (p.tags as string[]) ?? [],
      readTime: p.readTime ?? undefined,
      published: p.published,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }, [dbPosts]);

  const seedMutation = trpc.blogposts.seed.useMutation({
    onSuccess: () => {
      utils.blogposts.list.invalidate();
    },
  });

  const seedBlogposts = useCallback(() => {
    seedMutation.mutate();
  }, [seedMutation]);

  return {
    blogposts,
    isLoading,
    seedBlogposts,
  };
}

export function useBlogpost(id: number | null) {
  const { data, isLoading } = trpc.blogposts.get.useQuery(
    { id: id ?? 0 },
    { enabled: !!id, retry: false }
  );

  const blogpost: Blogpost | null = useMemo(() => {
    if (!data) return null;
    return {
      id: String(data.id),
      authorId: data.authorId,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt ?? undefined,
      bannerUrl: data.bannerUrl ?? undefined,
      videoUrl: data.videoUrl ?? undefined,
      category: data.category ?? undefined,
      tags: (data.tags as string[]) ?? [],
      readTime: data.readTime ?? undefined,
      published: data.published,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }, [data]);

  return { blogpost, isLoading };
}
