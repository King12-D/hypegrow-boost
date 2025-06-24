
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface DiscountCode {
  id: string;
  code: string;
  discount_percent: number;
  discount_amount?: number;
  max_uses?: number;
  current_uses: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
}

export const useDiscountCodes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const validateDiscount = useMutation({
    mutationFn: async ({ code, orderAmount }: { code: string; orderAmount: number }) => {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) throw new Error('Invalid discount code');

      const now = new Date();
      const validFrom = new Date(data.valid_from);
      const validUntil = data.valid_until ? new Date(data.valid_until) : null;

      if (now < validFrom) {
        throw new Error('Discount code is not yet valid');
      }

      if (validUntil && now > validUntil) {
        throw new Error('Discount code has expired');
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        throw new Error('Discount code has reached maximum uses');
      }

      const discountAmount = data.discount_amount || 
        (orderAmount * data.discount_percent / 100);

      return {
        ...data,
        calculated_discount: Math.min(discountAmount, orderAmount),
      };
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid Discount Code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createDiscountCode = useMutation({
    mutationFn: async (discountData: Omit<DiscountCode, 'id' | 'current_uses'>) => {
      if (!user) throw new Error('Must be authenticated');

      const { data, error } = await supabase
        .from('discount_codes')
        .insert({
          ...discountData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
      toast({
        title: "Discount Code Created",
        description: "New discount code has been created successfully.",
      });
    },
  });

  return {
    validateDiscount,
    createDiscountCode,
  };
};
