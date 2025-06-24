
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, X, Tag } from 'lucide-react';
import { useDiscountCodes } from '@/hooks/useDiscountCodes';

interface DiscountCodeInputProps {
  orderAmount: number;
  onDiscountApplied: (discount: { code: string; amount: number; id: string }) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: { code: string; amount: number };
}

const DiscountCodeInput = ({ 
  orderAmount, 
  onDiscountApplied, 
  onDiscountRemoved,
  appliedDiscount 
}: DiscountCodeInputProps) => {
  const [code, setCode] = useState('');
  const { validateDiscount } = useDiscountCodes();

  const handleApplyDiscount = async () => {
    if (!code.trim()) return;

    try {
      const discount = await validateDiscount.mutateAsync({
        code: code.trim(),
        orderAmount,
      });

      onDiscountApplied({
        code: discount.code,
        amount: discount.calculated_discount,
        id: discount.id,
      });
      
      setCode('');
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountRemoved();
  };

  if (appliedDiscount) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Code "{appliedDiscount.code}" applied
          </span>
          <Badge variant="outline" className="text-green-600 border-green-300">
            -₦{appliedDiscount.amount.toLocaleString()}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveDiscount}
          className="text-green-600 hover:text-green-800"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="discount-code">Discount Code</Label>
      <div className="flex space-x-2">
        <Input
          id="discount-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter discount code"
          className="flex-1"
        />
        <Button
          onClick={handleApplyDiscount}
          disabled={!code.trim() || validateDiscount.isPending}
          variant="outline"
        >
          {validateDiscount.isPending ? 'Checking...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
};

export default DiscountCodeInput;
