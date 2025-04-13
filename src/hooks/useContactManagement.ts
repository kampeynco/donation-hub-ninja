
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchContacts, 
  createContact, 
  updateContact, 
  deleteContact,
  ContactData,
  EmailData,
  PhoneData,
  LocationData
} from '@/services/contacts/crud';
import { updateContactStatus } from '@/services/contacts/status';
import { toast } from 'sonner';

export function useContactManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  // Fetch contacts with pagination and filters
  const { data: contactsData, isLoading, error } = useQuery({
    queryKey: ['contacts', page, limit, filters],
    queryFn: () => fetchContacts(filters, page, limit),
  });

  const contacts = contactsData?.data || [];
  const totalContacts = contactsData?.count || 0;
  const totalPages = Math.ceil(totalContacts / limit);

  // Create a new contact
  const createContactMutation = useMutation({
    mutationFn: ({ 
      contactData, 
      email, 
      phone, 
      location 
    }: { 
      contactData: ContactData, 
      email?: EmailData, 
      phone?: PhoneData, 
      location?: LocationData 
    }) => createContact(contactData, email, phone, location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact created successfully');
    },
    onError: (error) => {
      console.error('Error creating contact:', error);
      toast.error('Failed to create contact');
    }
  });

  // Update an existing contact
  const updateContactMutation = useMutation({
    mutationFn: ({ contactId, contactData }: { contactId: string, contactData: ContactData }) => 
      updateContact(contactId, contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact updated successfully');
    },
    onError: (error) => {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    }
  });

  // Delete a contact
  const deleteContactMutation = useMutation({
    mutationFn: (contactId: string) => deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  });

  // Update a contact's status
  const updateStatusMutation = useMutation({
    mutationFn: ({ contactId, status }: { contactId: string, status: 'prospect' | 'active' | 'donor' }) => 
      updateContactStatus(contactId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact status updated');
    },
    onError: (error) => {
      console.error('Error updating contact status:', error);
      toast.error('Failed to update contact status');
    }
  });

  return {
    contacts,
    totalContacts,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    filters,
    setFilters,
    isLoading,
    error,
    createContact: createContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isCreating: createContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending
  };
}
