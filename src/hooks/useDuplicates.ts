
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDuplicates, fetchDuplicateContactsById, resolveDuplicateMatch } from '@/services/contacts/duplicates';
import { toast } from 'sonner';
import type { DuplicateMatch, Contact } from '@/types/contact';

interface ResolveDuplicateParams {
  duplicateId: string;
  action: 'merge' | 'ignore';
  primaryContactId?: string;
}

export function useDuplicates() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [minConfidence, setMinConfidence] = useState(75);
  const queryClient = useQueryClient();

  // Fetch duplicates
  const { 
    data: duplicatesData = { data: [], count: 0 },
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['duplicates', page, limit, minConfidence],
    queryFn: () => fetchDuplicates({ page, limit, minConfidence }),
  });

  // Fetch duplicate contact details
  const fetchDuplicateContacts = async (duplicate: DuplicateMatch) => {
    try {
      const result = await fetchDuplicateContactsById(duplicate.contact1_id, duplicate.contact2_id);
      return {
        contact1: result.contact1,
        contact2: result.contact2
      };
    } catch (error) {
      console.error('Error fetching duplicate contacts:', error);
      throw error;
    }
  };

  // Resolve duplicate
  const resolveMutation = useMutation({
    mutationFn: (params: ResolveDuplicateParams) => resolveDuplicateMatch(params),
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
    duplicates: duplicatesData.data,
    totalDuplicates: duplicatesData.count,
    page,
    setPage,
    limit,
    setLimit,
    minConfidence,
    setMinConfidence,
    totalPages: Math.ceil(duplicatesData.count / limit),
    isLoading,
    error,
    fetchDuplicateContacts,
    resolveDuplicate: resolveMutation.mutate,
    isResolving: resolveMutation.isPending
  };
}
