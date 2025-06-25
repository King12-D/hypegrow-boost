
import { useQuery } from '@tanstack/react-query';
import { JustAnotherPanelAPI } from '@/services/justAnotherPanelApi';

export const useJAPServices = () => {
  return useQuery({
    queryKey: ['jap-services'],
    queryFn: async () => {
      const api = new JustAnotherPanelAPI();
      const services = await api.getServices();

      console.log('Raw JAP Services:', services); // Debug log

      // Group services by platform and type for better organization
      const groupedServices = services.reduce((acc, service) => {
        // Extract platform from category or name
        let platform = 'Other';
        const categoryLower = service.category.toLowerCase();
        const nameLower = service.name.toLowerCase();
        
        if (categoryLower.includes('instagram') || nameLower.includes('instagram')) {
          platform = 'Instagram';
        } else if (categoryLower.includes('tiktok') || nameLower.includes('tiktok')) {
          platform = 'TikTok';
        } else if (categoryLower.includes('youtube') || nameLower.includes('youtube')) {
          platform = 'YouTube';
        } else if (categoryLower.includes('facebook') || nameLower.includes('facebook')) {
          platform = 'Facebook';
        } else if (categoryLower.includes('twitter') || nameLower.includes('twitter')) {
          platform = 'Twitter';
        } else if (categoryLower.includes('linkedin') || nameLower.includes('linkedin')) {
          platform = 'LinkedIn';
        } else if (categoryLower.includes('snapchat') || nameLower.includes('snapchat')) {
          platform = 'Snapchat';
        } else if (categoryLower.includes('telegram') || nameLower.includes('telegram')) {
          platform = 'Telegram';
        }

        // Determine service type
        const serviceType = nameLower.includes('followers') || nameLower.includes('follower') ? 'Followers' :
                           nameLower.includes('likes') || nameLower.includes('like') ? 'Likes' :
                           nameLower.includes('views') || nameLower.includes('view') ? 'Views' :
                           nameLower.includes('comments') || nameLower.includes('comment') ? 'Comments' :
                           nameLower.includes('subscribers') || nameLower.includes('subscriber') ? 'Subscribers' :
                           nameLower.includes('shares') || nameLower.includes('share') ? 'Shares' :
                           nameLower.includes('retweets') || nameLower.includes('retweet') ? 'Retweets' : 'Other';

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
          quantity: parseInt(service.max) || 1000,
          price: Math.round(parseFloat(service.rate) * 1000), // Convert to local currency
          min_quantity: parseInt(service.min) || 1,
          max_quantity: parseInt(service.max) || 1000,
          description: service.name,
          is_popular: false,
          is_active: true,
          jap_service_id: service.service,
        });

        return acc;
      }, {} as Record<string, Record<string, any[]>>);

      console.log('Grouped Services:', groupedServices); // Debug log
      return groupedServices;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useJAPBalance = () => {
  return useQuery({
    queryKey: ['jap-balance'],
    queryFn: async () => {
      const api = new JustAnotherPanelAPI();
      return api.getBalance();
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
