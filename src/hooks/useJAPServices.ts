
import { useQuery } from '@tanstack/react-query';
import { JustAnotherPanelAPI } from '@/services/justAnotherPanelApi';
import { supabase } from '@/integrations/supabase/client';

export const useJAPServices = () => {
  return useQuery({
    queryKey: ['jap-services'],
    queryFn: async () => {
      // Get API key from Supabase secrets/environment
      const apiKey = process.env.REACT_APP_JAP_API_KEY || 
                     import.meta.env.VITE_JAP_API_KEY;
      
      if (!apiKey) {
        throw new Error('JustAnotherPanel API key not configured');
      }

      const api = new JustAnotherPanelAPI(apiKey);
      const services = await api.getServices();

      // Group services by platform and type
      const groupedServices = services.reduce((acc, service) => {
        const platform = service.category.split(' - ')[0] || 'Other';
        const serviceType = service.name.includes('Followers') ? 'Followers' :
                           service.name.includes('Likes') ? 'Likes' :
                           service.name.includes('Views') ? 'Views' :
                           service.name.includes('Comments') ? 'Comments' :
                           service.name.includes('Subscribers') ? 'Subscribers' : 'Other';

        if (!acc[platform]) {
          acc[platform] = {};
        }
        if (!acc[platform][serviceType]) {
          acc[platform][serviceType] = [];
        }

        acc[platform][serviceType].push({
          id: service.service.toString(),
          platform,
          service_type: serviceType,
          package_name: service.name,
          quantity: parseInt(service.max),
          price: Math.round(parseFloat(service.rate) * 1000), // Convert to Naira (approximate)
          min_quantity: parseInt(service.min),
          max_quantity: parseInt(service.max),
          description: service.name,
          is_popular: false,
          is_active: true,
          jap_service_id: service.service,
        });

        return acc;
      }, {} as Record<string, Record<string, any[]>>);

      return groupedServices;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 2,
  });
};

export const useJAPBalance = () => {
  return useQuery({
    queryKey: ['jap-balance'],
    queryFn: async () => {
      const apiKey = process.env.REACT_APP_JAP_API_KEY || 
                     import.meta.env.VITE_JAP_API_KEY;
      
      if (!apiKey) {
        throw new Error('JustAnotherPanel API key not configured');
      }

      const api = new JustAnotherPanelAPI(apiKey);
      return api.getBalance();
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
