
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchDuplicateMatches,
  fetchDuplicateContacts,
  resolveDuplicate
} from '@/services/contacts/duplicates';
import type { DuplicateMatch } from '@/types/contact';
import { toast } from 'sonner';

export function useDuplicates() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [minConfidence, setMinConfidence] = useState(75);
  const queryClient = useQueryClient();

  // Fetch duplicate matches with pagination
  const {
    data: duplicatesData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['duplicates', page, limit, minConfidence],
    queryFn: () => fetchDuplicateMatches(minConfidence, page, limit)
  });

  const duplicates = duplicatesData?.data || [];
  const totalDuplicates = duplicatesData?.count || 0;
  const totalPages = Math.ceil(totalDuplicates / limit);

  // Fetch contacts for a specific duplicate match
  const fetchDuplicateContactsPair = async (duplicate: DuplicateMatch) => {
    return await fetchDuplicateContacts(duplicate);
  };

  // Resolve a duplicate match
  const resolveDuplicateMutation = useMutation({
    mutationFn: ({ 
      duplicateId, 
      action, 
      primaryContactId 
    }: { 
      duplicateId: string, 
      action: 'ignore' | 'merge', 
      primaryContactId?: string 
    }) => resolveDuplicate(duplicateId, action, primaryContactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duplicates'] });
      toast.success('Duplicate resolved successfully');
    },
    onError: (error) => {
      console.error('Error resolving duplicate:', error);
      toast.error('Failed to resolve duplicate');
    }
  });

  return {
    duplicates,
    totalDuplicates,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    minConfidence,
    setMinConfidence,
    isLoading,
    error,
    fetchDuplicateContacts: fetchDuplicateContactsPair,
    resolveDuplicate: resolveDuplicateMutation.mutate,
    isResolving: resolveDuplicateMutation.isPending
  };
}
