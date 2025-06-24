
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCreateJAPOrder } from '@/hooks/useJAPOrders';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const createJAPOrder = useCreateJAPOrder();

  const [formData, setFormData] = useState({
    serviceId: searchParams.get('serviceId') || '',
    platform: searchParams.get('platform') || '',
    service: searchParams.get('service') || '',
    package: searchParams.get('package') || '',
    price: searchParams.get('price') || '',
    minQty: parseInt(searchParams.get('minQty') || '0'),
    maxQty: parseInt(searchParams.get('maxQty') || '1000'),
    link: '',
    quantity: parseInt(searchParams.get('minQty') || '100'),
    notes: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const calculatePrice = () => {
    const basePrice = parseFloat(formData.price) || 0;
    const ratio = formData.quantity / 1000; // Assuming base price is per 1000
    return Math.round(basePrice * ratio);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceId || !formData.link || !formData.quantity) {
      return;
    }

    if (formData.quantity < formData.minQty || formData.quantity > formData.maxQty) {
      return;
    }

    try {
      const orderData = {
        serviceId: parseInt(formData.serviceId),
        link: formData.link,
        quantity: formData.quantity,
        packageName: formData.package,
        platform: formData.platform,
        serviceType: formData.service,
        amount: calculatePrice(),
      };

      await createJAPOrder.mutateAsync(orderData);
      setOrderPlaced(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Order creation failed:', error);
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your order is now being processed by our real engagement network. You'll see results within minutes!
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
              <p className="text-sm text-gray-600">
                Platform: {formData.platform}<br />
                Service: {formData.service}<br />
                Quantity: {formData.quantity.toLocaleString()}<br />
                Total: ₦{calculatePrice().toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
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
              Configure your social media growth order
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
                    placeholder="https://instagram.com/username or https://tiktok.com/@username"
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

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure your account/post is public</li>
                      <li>Do not change your username during delivery</li>
                      <li>Results typically start within 5-30 minutes</li>
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
                disabled={createJAPOrder.isPending || !formData.link || !formData.quantity}
              >
                {createJAPOrder.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}
                Place Order - ₦{calculatePrice().toLocaleString()}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;
