
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatePayment } from '@/hooks/usePayments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import PaymentProofUpload from '@/components/PaymentProofUpload';
import LoadingSpinner from '@/components/LoadingSpinner';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');
  const [bankReference, setBankReference] = useState('');
  const [copied, setCopied] = useState('');
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);

  const createPayment = useCreatePayment();

  // Fetch order details
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });

  // Check if payment already exists for this order
  const { data: existingPayment } = useQuery({
    queryKey: ['payment', orderId],
    queryFn: async () => {
      if (!orderId) return null;

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });

  useEffect(() => {
    if (existingPayment) {
      setPaymentCreated(true);
      setCurrentPaymentId(existingPayment.id);
    }
  }, [existingPayment]);

  const bankDetails = {
    bank: 'First Bank of Nigeria',
    accountNumber: '3034567890',
    accountName: 'HypeGrow Solutions Limited',
    amount: order ? `₦${order.amount.toLocaleString()}` : '₦0'
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleCreatePayment = async () => {
    if (!order) return;

    try {
      const payment = await createPayment.mutateAsync({
        orderId: order.id,
        amount: order.amount,
        paymentMethod: selectedMethod,
        bankReference: bankReference || undefined,
      });
      
      setCurrentPaymentId(payment.id);
      setPaymentCreated(true);
    } catch (error) {
      console.error('Payment creation failed:', error);
    }
  };

  if (orderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading payment details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              The order you're trying to pay for could not be found.
            </CardDescription>
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
              Complete Payment
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Secure your order with our trusted payment methods
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bank Transfer */}
                <div 
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'bank_transfer' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedMethod('bank_transfer')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={selectedMethod === 'bank_transfer'}
                      onChange={() => setSelectedMethod('bank_transfer')}
                      className="mr-3"
                    />
                    <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Bank Transfer</h3>
                      <p className="text-gray-600">Transfer directly to our bank account</p>
                    </div>
                  </div>

                  {selectedMethod === 'bank_transfer' && (
                    <div className="mt-6">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Bank Account Details</h4>
                        <div className="space-y-3">
                          {Object.entries(bankDetails).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <div>
                                <span className="text-gray-600 capitalize">
                                  {key === 'accountNumber' ? 'Account Number' : 
                                   key === 'accountName' ? 'Account Name' : 
                                   key}:
                                </span>
                                <p className="font-semibold">{value}</p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(value, key)}
                                className="text-purple-600 hover:text-purple-700 flex items-center"
                              >
                                {copied === key ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <Label htmlFor="bank-reference">Bank Reference (Optional)</Label>
                          <Input
                            id="bank-reference"
                            placeholder="Enter transaction reference or note"
                            value={bankReference}
                            onChange={(e) => setBankReference(e.target.value)}
                          />
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                            <div className="text-sm text-blue-800">
                              <p className="font-semibold mb-1">Payment Instructions:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Transfer the exact amount to the account above</li>
                                <li>Take a screenshot of your payment receipt</li>
                                <li>Upload the receipt using the form below</li>
                                <li>We'll verify payment within 30 minutes</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Money */}
                <div 
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'mobile_money' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedMethod('mobile_money')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="mobile_money"
                      checked={selectedMethod === 'mobile_money'}
                      onChange={() => setSelectedMethod('mobile_money')}
                      className="mr-3"
                    />
                    <Smartphone className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Mobile Money</h3>
                      <p className="text-gray-600">Pay with Opay, PalmPay, Kuda (Coming Soon)</p>
                    </div>
                  </div>

                  {selectedMethod === 'mobile_money' && (
                    <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-900 mb-2">Coming Soon</h4>
                        <p className="text-gray-600">
                          Mobile money integration is coming soon. For now, please use bank transfer.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Payment Button */}
                {!paymentCreated && (
                  <div className="pt-4">
                    <Button
                      onClick={handleCreatePayment}
                      disabled={createPayment.isPending || selectedMethod === 'mobile_money'}
                      className="w-full"
                      size="lg"
                    >
                      {createPayment.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      Create Payment Record
                    </Button>
                  </div>
                )}

                {/* Payment Proof Upload */}
                {paymentCreated && currentPaymentId && (
                  <div className="pt-4">
                    <PaymentProofUpload paymentId={currentPaymentId} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-semibold">{order.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold">{order.service_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-semibold">{order.package_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">{order.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="font-semibold">@{order.username}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-purple-600">
                    ₦{order.amount.toLocaleString()}
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-semibold">Secure Payment</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your payment is protected and encrypted
                  </p>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>✓ 24-hour delivery start</p>
                  <p>✓ 30-day retention guarantee</p>
                  <p>✓ 24/7 customer support</p>
                  <p>✓ Money-back guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
