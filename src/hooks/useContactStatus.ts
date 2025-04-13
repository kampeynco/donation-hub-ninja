
import { useQuery } from '@tanstack/react-query';
import { getContactCountsByStatus, getRecentDonorCount } from '@/services/contacts/status';
import type { ContactCounts } from '@/types/contact';

export function useContactStatus() {
  const {
    data: statusCounts = { prospect: 0, active: 0, donor: 0, total: 0 },
    isLoading: isLoadingCounts,
    error: countsError
  } = useQuery<ContactCounts>({
    queryKey: ['contactCounts'],
    queryFn: getContactCountsByStatus
  });

  const {
    data: recentDonors = 0,
    isLoading: isLoadingRecent,
    error: recentError
  } = useQuery<number>({
    queryKey: ['recentDonors'],
    queryFn: getRecentDonorCount
  });

  return {
    statusCounts,
    recentDonors,
    isLoading: isLoadingCounts || isLoadingRecent,
    error: countsError || recentError
  };
}
