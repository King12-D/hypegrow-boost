
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = useMutation({
    mutationFn: async ({ 
      eventType, 
      eventData 
    }: { 
      eventType: string; 
      eventData?: Record<string, any> 
    }) => {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: user?.id,
          event_type: eventType,
          event_data: eventData,
          ip_address: null, // Will be populated server-side if needed
          user_agent: navigator.userAgent,
        });

      if (error) throw error;
    },
  });

  const track = (eventType: string, eventData?: Record<string, any>) => {
    trackEvent.mutate({ eventType, eventData });
  };

  return { track };
};
