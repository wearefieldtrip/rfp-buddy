import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  attachRfpDocument,
  createRfp,
  deleteRfp,
  fetchProfiles,
  fetchRfp,
  fetchRfps,
  generateQuestions,
  scoreRfp,
  updateRfp,
} from './api';
import type { CreateRfpInput, Rfp } from './types';
import { useAuth } from '../auth/useAuth';

export function useRfps() {
  return useQuery({ queryKey: ['rfps'], queryFn: fetchRfps });
}

export function useRfp(id: string) {
  const query = useQuery({ queryKey: ['rfps', id], queryFn: () => fetchRfp(id), enabled: !!id });
  useRfpRealtimeSync(id);
  return query;
}

// Subscribes to changes on a single rfp row so the UI picks up when the
// score-rfp edge function finishes in the background, without polling.
function useRfpRealtimeSync(id: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`rfp-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rfps', filter: `id=eq.${id}` },
        () => {
          void queryClient.invalidateQueries({ queryKey: ['rfps', id] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [id, queryClient]);
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

export function useUpdateRfp(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRfpInput & { owner_id: string | null }) => updateRfp(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rfps'] });
      void queryClient.invalidateQueries({ queryKey: ['rfps', id] });
    },
  });
}

export function useAttachRfpDocument(id: string) {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: (input: { drive_url: string }) => {
      if (!session) throw new Error('Not signed in');
      return attachRfpDocument(id, input, session.user.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rfps', id] });
      void queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
}

export function useDeleteRfp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRfp(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
}

export function useScoreRfp(rfp: Rfp) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => scoreRfp(rfp.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rfps', rfp.id] });
      void queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
}

export function useGenerateQuestions(rfp: Rfp) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => generateQuestions(rfp.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rfps', rfp.id] });
      void queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
}
