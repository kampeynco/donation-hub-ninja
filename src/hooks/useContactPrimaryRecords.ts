
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  setPrimaryEmail, 
  setPrimaryPhone, 
  setPrimaryLocation,
  addEmailToContact,
  addPhoneToContact,
  addLocationToContact
} from '@/services/contacts/primary';
import { toast } from 'sonner';

export function useContactPrimaryRecords(contactId: string | undefined) {
  const queryClient = useQueryClient();

  const setPrimaryEmailMutation = useMutation({
    mutationFn: (emailId: string) => 
      setPrimaryEmail(contactId || '', emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      toast.success('Primary email updated');
    },
    onError: (error) => {
      console.error('Error setting primary email:', error);
      toast.error('Failed to update primary email');
    }
  });

  const setPrimaryPhoneMutation = useMutation({
    mutationFn: (phoneId: string) => 
      setPrimaryPhone(contactId || '', phoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      toast.success('Primary phone updated');
    },
    onError: (error) => {
      console.error('Error setting primary phone:', error);
      toast.error('Failed to update primary phone');
    }
  });

  const setPrimaryLocationMutation = useMutation({
    mutationFn: (locationId: string) => 
      setPrimaryLocation(contactId || '', locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      toast.success('Primary location updated');
    },
    onError: (error) => {
      console.error('Error setting primary location:', error);
      toast.error('Failed to update primary location');
    }
  });

  const addEmailMutation = useMutation({
    mutationFn: ({ email, type, isPrimary }: { email: string, type: 'personal' | 'work' | 'other', isPrimary: boolean }) => 
      addEmailToContact(contactId || '', email, type, isPrimary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      toast.success('Email added successfully');
    },
    onError: (error) => {
      console.error('Error adding email:', error);
      toast.error('Failed to add email');
    }
  });

  const addPhoneMutation = useMutation({
    mutationFn: ({ phone, type, isPrimary }: { phone: string, type: 'mobile' | 'home' | 'work' | 'other', isPrimary: boolean }) => 
      addPhoneToContact(contactId || '', phone, type, isPrimary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      toast.success('Phone added successfully');
    },
    onError: (error) => {
      console.error('Error adding phone:', error);
      toast.error('Failed to add phone');
    }
  });

  const addLocationMutation = useMutation({
    mutationFn: ({ 
      locationData, 
      type, 
      isPrimary 
    }: { 
      locationData: {
        street?: string | null;
        city?: string | null;
        state?: string | null;
        zip?: string | null;
        country?: string | null;
      },
      type: 'home' | 'work' | 'mailing' | 'other',
      isPrimary: boolean
    }) => addLocationToContact(contactId || '', locationData, type, isPrimary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      toast.success('Address added successfully');
    },
    onError: (error) => {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  });

  return {
    setPrimaryEmail: setPrimaryEmailMutation.mutate,
    setPrimaryPhone: setPrimaryPhoneMutation.mutate,
    setPrimaryLocation: setPrimaryLocationMutation.mutate,
    addEmail: addEmailMutation.mutate,
    addPhone: addPhoneMutation.mutate,
    addLocation: addLocationMutation.mutate,
    isSettingPrimaryEmail: setPrimaryEmailMutation.isPending,
    isSettingPrimaryPhone: setPrimaryPhoneMutation.isPending,
    isSettingPrimaryLocation: setPrimaryLocationMutation.isPending,
    isAddingEmail: addEmailMutation.isPending,
    isAddingPhone: addPhoneMutation.isPending,
    isAddingLocation: addLocationMutation.isPending
  };
}
