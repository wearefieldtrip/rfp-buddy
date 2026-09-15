import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRfp, fetchProfiles, fetchRfp, fetchRfps } from './api';
import type { CreateRfpInput } from './types';
import { useAuth } from '../auth/useAuth';

export function useRfps() {
  return useQuery({ queryKey: ['rfps'], queryFn: fetchRfps });
}

export function useRfp(id: string) {
  return useQuery({ queryKey: ['rfps', id], queryFn: () => fetchRfp(id), enabled: !!id });
}

export function useProfiles() {
  return useQuery({ queryKey: ['profiles'], queryFn: fetchProfiles });
}

export function useCreateRfp() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: (input: CreateRfpInput & { owner_id: string | null }) => {
      if (!session) throw new Error('Not signed in');
      return createRfp(input, session.user.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
}
