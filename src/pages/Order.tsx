
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle, ShoppingCart, CheckCircle } from 'lucide-react';

const Order = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    platform: searchParams.get('platform') || '',
    service: searchParams.get('service') || '',
    package: searchParams.get('package') || '',
    price: searchParams.get('price') || '',
    username: '',
    postLink: '',
    quantity: '',
    email: '',
    whatsapp: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { name: 'TikTok', icon: MessageCircle, color: 'from-gray-900 to-gray-700' },
    { name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { name: 'WhatsApp', icon: MessageCircle, color: 'from-green-500 to-green-600' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
    setOrderPlaced(true);
    
    // In a real app, you would send this data to your backend
    // For now, we'll just simulate the order placement
  };

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
              Your order has been received. We'll start processing it within 24 hours. 
              You'll receive updates on WhatsApp.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
              <p className="text-sm text-gray-600">
                Platform: {formData.platform}<br />
                Service: {formData.service}<br />
                Package: {formData.package}<br />
                Price: {formData.price}
              </p>
            </div>
            <div className="space-y-3">
              <Link
                to="/payment"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 block text-center"
              >
                Proceed to Payment
              </Link>
              <Link
                to="/services"
                className="w-full border border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 block text-center"
              >
                Order More Services
              </Link>
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

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  placeholder="e.g., Instagram Followers"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Package */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package *
                </label>
                <input
                  type="text"
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000 Followers"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="₦0"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username/Handle *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="@yourusername"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Post Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post/Video Link
                </label>
                <input
                  type="url"
                  name="postLink"
                  value={formData.postLink}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Required for likes, comments, and views
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="+234 XXX XXX XXXX"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  For order updates and support
                </p>
              </div>
            </div>

            {/* Order Summary */}
            {formData.service && formData.package && formData.price && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-semibold">{formData.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold">{formData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-semibold">{formData.package}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-purple-600">{formData.price}</span>
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
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Order;
