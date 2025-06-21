
import React, { useState } from 'react';
import { CreditCard, Smartphone, Copy, CheckCircle, AlertCircle } from 'lucide-react';

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [copied, setCopied] = useState('');

  const bankDetails = {
    bank: 'First Bank of Nigeria',
    accountNumber: '1234567890',
    accountName: 'HypeGrow Solutions',
    amount: '₦3,500'
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment proof submitted:', paymentProof);
    // Handle payment proof submission
  };

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
            Choose your preferred payment method to complete your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Methods</h2>
              
              {/* Bank Transfer */}
              <div className="space-y-4">
                <div 
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'bank' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedMethod('bank')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={selectedMethod === 'bank'}
                      onChange={() => setSelectedMethod('bank')}
                      className="mr-3"
                    />
                    <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Bank Transfer</h3>
                      <p className="text-gray-600">Transfer directly to our bank account</p>
                    </div>
                  </div>
                </div>

                {selectedMethod === 'bank' && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Bank Account Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <span className="text-gray-600">Bank Name:</span>
                          <p className="font-semibold">{bankDetails.bank}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <span className="text-gray-600">Account Number:</span>
                          <p className="font-semibold">{bankDetails.accountNumber}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
                          className="text-purple-600 hover:text-purple-700 flex items-center"
                        >
                          {copied === 'account' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <span className="text-gray-600">Account Name:</span>
                          <p className="font-semibold">{bankDetails.accountName}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankDetails.accountName, 'name')}
                          className="text-purple-600 hover:text-purple-700 flex items-center"
                        >
                          {copied === 'name' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                        <div>
                          <span className="opacity-90">Amount to Pay:</span>
                          <p className="font-bold text-xl">{bankDetails.amount}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankDetails.amount, 'amount')}
                          className="text-white hover:text-gray-200 flex items-center"
                        >
                          {copied === 'amount' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
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
                )}

                {/* Mobile Money Option */}
                <div 
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'mobile' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedMethod('mobile')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="mobile"
                      checked={selectedMethod === 'mobile'}
                      onChange={() => setSelectedMethod('mobile')}
                      className="mr-3"
                    />
                    <Smartphone className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Mobile Money</h3>
                      <p className="text-gray-600">Pay with Opay, PalmPay, Kuda (Coming Soon)</p>
                    </div>
                  </div>
                </div>

                {selectedMethod === 'mobile' && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mt-4">
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

              {/* Payment Proof Upload */}
              {selectedMethod === 'bank' && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Payment Proof</h3>
                  <form onSubmit={handleSubmitProof} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="payment-proof"
                      />
                      <label htmlFor="payment-proof" className="cursor-pointer">
                        <div className="space-y-2">
                          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-purple-600" />
                          </div>
                          <p className="text-gray-600">
                            {paymentProof ? paymentProof.name : 'Click to upload payment receipt'}
                          </p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      </label>
                    </div>
                    
                    {paymentProof && (
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Submit Payment Proof
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-semibold">Instagram</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">Followers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">1,000</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-purple-600">₦3,500</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
