
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface CreatePaymentData {
  orderId: string;
  amount: number;
  paymentMethod: string;
  bankReference?: string;
}

export const useCreatePayment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: CreatePaymentData) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('payments')
        .insert({
          order_id: paymentData.orderId,
          user_id: user.id,
          amount: paymentData.amount,
          payment_method: paymentData.paymentMethod,
          bank_reference: paymentData.bankReference,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Payment Record Created",
        description: "Your payment has been recorded and is awaiting verification.",
      });
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUploadPaymentProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, file }: { paymentId: string; file: File }) => {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${paymentId}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Update payment record with proof URL
      const { data, error } = await supabase
        .from('payments')
        .update({ 
          payment_proof_url: uploadData.path,
          status: 'submitted'
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Payment Proof Uploaded",
        description: "Your payment proof has been uploaded and is being reviewed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUserPayments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['payments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          orders (
            platform,
            service_type,
            package_name,
            amount
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
