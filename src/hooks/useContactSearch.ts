
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchContacts } from '@/services/contacts/search';
import type { Contact } from '@/types/contact';

export function useContactSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  
  const {
    data: contacts = [],
    isLoading,
    error,
    refetch
  } = useQuery<Contact[]>({
    queryKey: ['contactSearch', searchTerm, limit],
    queryFn: async () => {
      const results = await searchContacts(searchTerm, limit);
      return results as Contact[];
    },
    enabled: searchTerm.length >= 2,
  });

  return {
    searchTerm,
    setSearchTerm,
    limit,
    setLimit,
    contacts,
    isLoading,
    error,
    refetch,
    hasSearchTerm: searchTerm.length >= 2
  };
}
