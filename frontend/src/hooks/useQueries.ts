import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NewReel, Reel, ViewRange } from '../backend';

export function useGetAllReels() {
  const { actor, isFetching } = useActor();

  return useQuery<Reel[]>({
    queryKey: ['reels', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedReels(range: ViewRange) {
  const { actor, isFetching } = useActor();

  return useQuery<Reel[]>({
    queryKey: ['reels', 'featured', range.start.toString(), range.end.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedReels(range);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReel(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Reel>({
    queryKey: ['reel', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReel(id);
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useFilterByTag(search: string, range: ViewRange) {
  const { actor, isFetching } = useActor();

  return useQuery<Reel[]>({
    queryKey: ['reels', 'tag', search, range.start.toString(), range.end.toString()],
    queryFn: async () => {
      if (!actor) return [];
      if (!search) return actor.getAllReels();
      return actor.filterByTag(search, range);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitReel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error, NewReel>({
    mutationFn: async (newReel: NewReel) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitReel(newReel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    },
  });
}

export function useIncrementViewCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementViewCount(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['reel', id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    },
  });
}
