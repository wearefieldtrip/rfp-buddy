import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addRfpFile, deleteRfpFile, fetchRfpFiles } from './filesApi';
import { useAuth } from '../auth/useAuth';

export function useRfpFiles(rfpId: string) {
  return useQuery({
    queryKey: ['rfp_files', rfpId],
    queryFn: () => fetchRfpFiles(rfpId),
    enabled: !!rfpId,
  });
}

export function useAddRfpFile(rfpId: string) {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: (input: { drive_url: string; file_name: string }) => {
      if (!session) throw new Error('Not signed in');
      return addRfpFile({ rfp_id: rfpId, added_by: session.user.id, ...input });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rfp_files', rfpId] });
    },
  });
}

export function useDeleteRfpFile(rfpId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRfpFile(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rfp_files', rfpId] });
    },
  });
}
