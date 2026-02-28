import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { StoredImage, ImageId, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

// ─── Image Queries ─────────────────────────────────────────────────────────────

export function useGetAllImages() {
  const { actor, isFetching } = useActor();

  return useQuery<StoredImage[]>({
    queryKey: ['images'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetImage(id: ImageId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<StoredImage | null>({
    queryKey: ['image', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getImage(id);
    },
    enabled: !!actor && !isFetching && !!id,
    retry: false,
  });
}

export function useUploadImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<ImageId, Error, { bytes: Uint8Array<ArrayBuffer>; onProgress?: (pct: number) => void }>({
    mutationFn: async ({ bytes, onProgress }) => {
      if (!actor) throw new Error('Actor not available');
      let blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }
      return actor.uploadImage(blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

export function useDeleteImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, ImageId>({
    mutationFn: async (id: ImageId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

// ─── User Profile Queries ──────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
