
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { checkWaitlistStatus, joinWaitlist } from '@/services/waitlistService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { IconCheck } from '@tabler/icons-react';

const WaitlistButton = () => {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      
      try {
        const status = await checkWaitlistStatus('Personas', user.id);
        setIsJoined(status === true);
      } catch (error) {
        console.error('Error checking waitlist status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user]);

  const handleJoinWaitlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await joinWaitlist('Personas', user.id);
      setIsJoined(true);
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

  if (isJoined) {
    return (
      <Button variant="outline" className="mr-4 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-600" disabled>
        <IconCheck className="mr-1 h-4 w-4" />
        Joined
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
