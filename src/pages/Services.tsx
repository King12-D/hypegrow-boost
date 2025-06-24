
import React from 'react';
import { Link } from 'react-router-dom';
import { useServicePackages } from '@/hooks/useServicePackages';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Users, 
  Heart, 
  Eye, 
  Share, 
  Clock, 
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Camera
} from 'lucide-react';

const Services = () => {
  const { data: packages, isLoading, error } = useServicePackages();
  const { track } = useAnalytics();

  const platformConfig = {
    'Instagram': { icon: Instagram, color: 'from-pink-500 to-purple-600' },
    'TikTok': { icon: MessageCircle, color: 'from-gray-900 to-gray-700' },
    'YouTube': { icon: Youtube, color: 'from-red-500 to-red-600' },
    'WhatsApp': { icon: MessageCircle, color: 'from-green-500 to-green-600' },
    'Facebook': { icon: Facebook, color: 'from-blue-600 to-blue-700' },
    'Twitter': { icon: Twitter, color: 'from-blue-400 to-blue-500' },
    'LinkedIn': { icon: Linkedin, color: 'from-blue-700 to-blue-800' },
    'Snapchat': { icon: Camera, color: 'from-yellow-400 to-yellow-500' },
    'Telegram': { icon: MessageCircle, color: 'from-blue-500 to-blue-600' }
  };

  const serviceIcons = {
    'Followers': Users,
    'Likes': Heart,
    'Comments': MessageCircle,
    'Views': Eye,
    'Subscribers': Users,
    'Watch Hours': Clock,
    'Status Views': Eye,
    'Bulk Posting': Share,
    'Connections': Users,
    'Retweets': Share,
    'Members': Users
  };

  const handleOrderClick = (platform: string, serviceType: string, packageName: string) => {
    track('service_order_clicked', {
      platform,
      service_type: serviceType,
      package_name: packageName,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Services</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Group packages by platform and service type
  const groupedPackages = packages?.reduce((acc, pkg) => {
    if (!acc[pkg.platform]) {
      acc[pkg.platform] = {};
    }
    if (!acc[pkg.platform][pkg.service_type]) {
      acc[pkg.platform][pkg.service_type] = [];
    }
    acc[pkg.platform][pkg.service_type].push(pkg);
    return acc;
  }, {} as Record<string, Record<string, typeof packages>>);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of social media boosting services across all major platforms. 
            All packages include high-quality engagement and 24/7 support.
          </p>
        </div>

        {Object.entries(groupedPackages || {}).map(([platform, services]) => {
          const config = platformConfig[platform as keyof typeof platformConfig];
          if (!config) return null;

          return (
            <div key={platform} className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center mr-4`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{platform}</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {Object.entries(services).map(([serviceType, servicePackages]) => {
                  const ServiceIcon = serviceIcons[serviceType as keyof typeof serviceIcons] || Users;
                  
                  return (
                    <div key={serviceType} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className={`bg-gradient-to-r ${config.color} p-6 text-white`}>
                        <div className="flex items-center mb-2">
                          <ServiceIcon className="w-6 h-6 mr-2" />
                          <h3 className="text-xl font-bold">{platform} {serviceType}</h3>
                        </div>
                        <p className="opacity-90">High-quality, fast delivery</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-4">
                          {servicePackages.map((pkg) => (
                            <div 
                              key={pkg.id} 
                              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                                pkg.is_popular 
                                  ? `border-gradient-to-r ${config.color} bg-gradient-to-r from-purple-50 to-pink-50` 
                                  : 'border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-semibold text-gray-900">{pkg.package_name}</span>
                                    {pkg.is_popular && (
                                      <span className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-2xl font-bold text-purple-600">₦{pkg.price.toLocaleString()}</span>
                                  <p className="text-sm text-gray-500">{pkg.quantity.toLocaleString()} {serviceType}</p>
                                </div>
                                <Link
                                  to={`/order?service=${encodeURIComponent(serviceType)}&package=${encodeURIComponent(pkg.package_name)}&price=${encodeURIComponent(pkg.price)}&platform=${encodeURIComponent(platform)}&packageId=${pkg.id}`}
                                  onClick={() => handleOrderClick(platform, serviceType, pkg.package_name)}
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                >
                                  Order Now
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Package?</h3>
          <p className="text-lg mb-6 opacity-90">
            Contact us for bulk orders or custom requirements. We offer special pricing for large orders.
          </p>
          <Link
            to="/contact"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 inline-block"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
