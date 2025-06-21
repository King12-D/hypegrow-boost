
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCreateOrder } from '@/hooks/useOrders';
import { useServicePackages } from '@/hooks/useServicePackages';
import { useAuth } from '@/hooks/useAuth';
import { Instagram, Youtube, MessageCircle, ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const { data: packages } = useServicePackages();

  const [formData, setFormData] = useState({
    platform: searchParams.get('platform') || '',
    service: searchParams.get('service') || '',
    package: searchParams.get('package') || '',
    price: searchParams.get('price') || '',
    packageId: searchParams.get('packageId') || '',
    username: '',
    postLink: '',
    notes: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { name: 'TikTok', icon: MessageCircle, color: 'from-gray-900 to-gray-700' },
    { name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { name: 'WhatsApp', icon: MessageCircle, color: 'from-green-500 to-green-600' }
  ];

  useEffect(() => {
    if (formData.packageId && packages) {
      const pkg = packages.find(p => p.id === formData.packageId);
      if (pkg) {
        setSelectedPackage(pkg);
        setFormData(prev => ({
          ...prev,
          platform: pkg.platform,
          service: pkg.service_type,
          package: pkg.package_name,
          price: pkg.price.toString()
        }));
      }
    }
  }, [formData.packageId, packages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPackage) {
      return;
    }

    try {
      const orderData = {
        platform: selectedPackage.platform,
        service_type: selectedPackage.service_type,
        package_name: selectedPackage.package_name,
        quantity: selectedPackage.quantity,
        amount: selectedPackage.price,
        username: formData.username,
        post_link: formData.postLink || undefined,
        notes: formData.notes || undefined,
      };

      const order = await createOrder.mutateAsync(orderData);
      setOrderPlaced(true);
      
      // Redirect to payment after 2 seconds
      setTimeout(() => {
        navigate(`/payment?orderId=${order.id}`);
      }, 2000);
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
              Your order has been received. Redirecting to payment...
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
              <p className="text-sm text-gray-600">
                Platform: {formData.platform}<br />
                Service: {formData.service}<br />
                Package: {formData.package}<br />
                Price: ₦{formData.price}
              </p>
            </div>
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
              Place Your Order
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Fill in the details below to boost your social media presence
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Complete your order information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <Label htmlFor="username">Username/Handle *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="@yourusername"
                    required
                  />
                </div>

                {/* Post Link */}
                <div>
                  <Label htmlFor="postLink">Post/Video Link</Label>
                  <Input
                    id="postLink"
                    name="postLink"
                    type="url"
                    value={formData.postLink}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Required for likes, comments, and views
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or requirements..."
                  rows={3}
                />
              </div>

              {/* Order Summary */}
              {selectedPackage && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform:</span>
                      <span className="font-semibold">{selectedPackage.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-semibold">{selectedPackage.service_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-semibold">{selectedPackage.package_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-semibold">{selectedPackage.quantity.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-purple-600">₦{selectedPackage.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Delivery starts within 24 hours of payment confirmation</li>
                  <li>• Accounts must be public during service delivery</li>
                  <li>• No refunds after service delivery has started</li>
                  <li>• We provide 30-day retention guarantee</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={createOrder.isPending || !selectedPackage}
              >
                {createOrder.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}
                Place Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;
