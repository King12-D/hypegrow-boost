
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

      // First, check if payment has been verified for this order
      const { data: order } = await supabase
        .from('orders')
        .select('*, payments(*)')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .single();

      if (!order || !order.payments || order.payments.length === 0) {
        throw new Error('Payment must be completed and verified before service delivery');
      }

      const verifiedPayment = order.payments.find((p: any) => p.status === 'verified');
      if (!verifiedPayment) {
        throw new Error('Payment verification is required before service delivery');
      }

      // Only now proceed with JAP order creation
      const { data: japResponse, error: japError } = await supabase.functions.invoke('jap-services', {
        body: {
          action: 'add',
          service: orderData.serviceId,
          link: orderData.link,
          quantity: orderData.quantity
        }
      });

      if (japError) throw japError;

      if (japResponse.error) {
        throw new Error(japResponse.error);
      }

      // Update order with JAP order ID and set to processing
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'processing',
          notes: `${order.notes} | JAP Order ID: ${japResponse.order}`,
        })
        .eq('id', order.id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, jap_order_id: japResponse.order };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Service Started!",
        description: "Your social media boost is now being processed by real providers.",
      });
    },
    onError: (error) => {
      console.error('JAP Order Error:', error);
      toast({
        title: "Service Error",
        description: error.message || "Service could not be started. Please ensure payment is verified.",
        variant: "destructive",
      });
    },
  });
};

export const useJAPOrderStatus = (japOrderId: number) => {
  return useQuery({
    queryKey: ['jap-order-status', japOrderId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('jap-services', {
        body: {
          action: 'status',
          order: japOrderId
        }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!japOrderId,
    refetchInterval: 30000, // Check status every 30 seconds
  });
};
