
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { JustAnotherPanelAPI } from '@/services/justAnotherPanelApi';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CreateJAPOrderData {
  serviceId: number;
  link: string;
  quantity: number;
  packageName: string;
  platform: string;
  serviceType: string;
  amount: number;
}

export const useCreateJAPOrder = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateJAPOrderData) => {
      if (!user) throw new Error('User must be authenticated');

      const apiKey = process.env.REACT_APP_JAP_API_KEY || 
                     import.meta.env.VITE_JAP_API_KEY;
      
      if (!apiKey) {
        throw new Error('JustAnotherPanel API key not configured');
      }

      // Create order in JustAnotherPanel
      const api = new JustAnotherPanelAPI(apiKey);
      const japOrder = await api.createOrder(
        orderData.serviceId,
        orderData.link,
        orderData.quantity
      );

      // Store order in our database with JAP order ID
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          platform: orderData.platform,
          service_type: orderData.serviceType,
          package_name: orderData.packageName,
          quantity: orderData.quantity,
          amount: orderData.amount,
          username: orderData.link.split('/').pop() || '',
          post_link: orderData.link,
          status: 'processing',
          payment_status: 'paid',
          notes: `JAP Order ID: ${japOrder.order}`,
        })
        .select()
        .single();

      if (error) throw error;
      return { ...data, jap_order_id: japOrder.order };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order Placed Successfully!",
        description: "Your social media boost order is now being processed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useJAPOrderStatus = (japOrderId: number) => {
  return useQuery({
    queryKey: ['jap-order-status', japOrderId],
    queryFn: async () => {
      const apiKey = process.env.REACT_APP_JAP_API_KEY || 
                     import.meta.env.VITE_JAP_API_KEY;
      
      if (!apiKey) {
        throw new Error('JustAnotherPanel API key not configured');
      }

      const api = new JustAnotherPanelAPI(apiKey);
      return api.getOrderStatus(japOrderId);
    },
    enabled: !!japOrderId,
    refetchInterval: 30000, // Check status every 30 seconds
  });
};
