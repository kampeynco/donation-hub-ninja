
import { useQuery } from '@tanstack/react-query';
import { fetchContactById } from '@/services/contacts/crud';

export function useContact(contactId: string | undefined) {
  const {
    data: contact,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => fetchContactById(contactId || ''),
    enabled: !!contactId,
  });

  return {
    contact,
    isLoading,
    error,
    refetch
  };
}
