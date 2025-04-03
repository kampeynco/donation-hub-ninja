
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  checkWaitlistStatus, 
  joinWaitlist, 
  WaitlistStatus,
  WaitlistEntry
} from '@/services/waitlistService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { IconCheck, IconX } from '@tabler/icons-react';

type WaitlistStatusState = {
  status: WaitlistStatus;
  rejection_reason: string | null;
} | null;

const WaitlistButton = () => {
  const { user } = useAuth();
  const [waitlistStatus, setWaitlistStatus] = useState<WaitlistStatusState>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      if (!user) {
        if (isMounted) {
          setLoading(false);
          setWaitlistStatus(null);
        }
        return;
      }
      
      try {
        const status = await checkWaitlistStatus('Personas', user.id);
        if (isMounted) {
          setWaitlistStatus(status);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking waitlist status:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkStatus();
    
    // Cleanup function to prevent updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleJoinWaitlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await joinWaitlist('Personas', user.id);
      const status = await checkWaitlistStatus('Personas', user.id);
      setWaitlistStatus(status);
      toast({
        title: 'Joined waitlist',
        description: 'You\'ve been added to the Personas waitlist.',
      });
    } catch (error: any) {
      toast({
        title: 'Error joining waitlist',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button disabled className="mr-4">
        Loading...
      </Button>
    );
  }

  if (waitlistStatus?.status === 'joined') {
    return (
      <Button variant="outline" className="mr-4 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-600" disabled>
        <IconCheck className="mr-1 h-4 w-4" />
        Added to Waitlist
      </Button>
    );
  }

  if (waitlistStatus?.status === 'approved') {
    return (
      <Button variant="outline" className="mr-4 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-600" disabled>
        <IconCheck className="mr-1 h-4 w-4" />
        Access Granted
      </Button>
    );
  }

  if (waitlistStatus?.status === 'rejected') {
    return (
      <Button variant="outline" className="mr-4 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-600" disabled>
        <IconX className="mr-1 h-4 w-4" />
        Access Denied
      </Button>
    );
  }

  if (waitlistStatus?.status === 'declined') {
    return (
      <Button onClick={handleJoinWaitlist} className="mr-4">
        Reconsider & Join Waitlist
      </Button>
    );
  }

  return (
    <Button onClick={handleJoinWaitlist} className="mr-4">
      Join Waitlist
    </Button>
  );
};

export default WaitlistButton;
