
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, CheckCircle, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    japServiceId: searchParams.get('japServiceId') || '',
    platform: searchParams.get('platform') || '',
    service: searchParams.get('service') || '',
    package: searchParams.get('package') || '',
    basePrice: parseFloat(searchParams.get('price') || '0'),
    minQty: parseInt(searchParams.get('minQty') || '0'),
    maxQty: parseInt(searchParams.get('maxQty') || '1000'),
    link: '',
    quantity: parseInt(searchParams.get('minQty') || '100'),
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const calculatePrice = () => {
    // Convert JAP price (in USD cents) to Naira
    // JAP rates are typically in USD cents, so we need to convert properly
    const usdPrice = formData.basePrice / 100; // Convert cents to USD
    const nairaRate = 1600; // 1 USD = 1600 Naira (approximate)
    const pricePerThousand = usdPrice * nairaRate;
    
    // Calculate based on quantity
    const totalPrice = (pricePerThousand * formData.quantity) / 1000;
    return Math.max(Math.round(totalPrice), 100); // Minimum 100 Naira
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.japServiceId || !formData.link || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.quantity < formData.minQty || formData.quantity > formData.maxQty) {
      toast({
        title: "Invalid Quantity",
        description: `Quantity must be between ${formData.minQty.toLocaleString()} and ${formData.maxQty.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database first - this will NOT trigger the JAP service yet
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          platform: formData.platform,
          service_type: formData.service,
          package_name: formData.package,
          quantity: formData.quantity,
          amount: calculatePrice(),
          username: formData.link.split('/').pop() || '',
          post_link: formData.link,
          status: 'pending_payment', // Important: Order waits for payment
          payment_status: 'pending',
          notes: `JAP Service ID: ${formData.japServiceId}${formData.notes ? ` | ${formData.notes}` : ''}`,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Order Created",
        description: "Your order has been created. Please complete payment to start processing.",
      });

      // Redirect to payment page
      navigate(`/payment?orderId=${order.id}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to place an order.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Complete Your Order
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Get real engagement from authentic users worldwide
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Configuration</CardTitle>
            <CardDescription>
              Configure your social media growth order - Payment required before service delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Link/URL */}
                <div className="md:col-span-2">
                  <Label htmlFor="link">Profile/Post Link *</Label>
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://tiktok.com/@username or https://instagram.com/username"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your profile URL or specific post link
                  </p>
                </div>

                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={formData.minQty}
                    max={formData.maxQty}
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Min: {formData.minQty.toLocaleString()} - Max: {formData.maxQty.toLocaleString()}
                  </p>
                </div>

                {/* Price Display */}
                <div>
                  <Label>Total Price</Label>
                  <div className="text-2xl font-bold text-purple-600">
                    ₦{calculatePrice().toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">
                    Price updates based on quantity
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions..."
                  rows={3}
                />
              </div>

              {/* Service Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Service Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Platform:</span>
                    <p className="font-semibold">{formData.platform}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Service:</span>
                    <p className="font-semibold">{formData.service}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Package:</span>
                    <p className="font-semibold">{formData.package}</p>
                  </div>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <p className="font-semibold mb-1">Payment Required First:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>You must complete payment via bank transfer before service delivery</li>
                      <li>Service will only start after payment verification</li>
                      <li>You'll be redirected to payment page after creating this order</li>
                      <li>Upload payment proof for quick verification</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure your account/post is public</li>
                      <li>Do not change your username during delivery</li>
                      <li>Results typically start within 5-30 minutes after payment</li>
                      <li>All engagement comes from real, active users</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || !formData.link || !formData.quantity}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}
                Create Order & Proceed to Payment - ₦{calculatePrice().toLocaleString()}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;
