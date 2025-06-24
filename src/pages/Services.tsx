
import React from 'react';
import { useJAPServices } from '@/hooks/useJAPServices';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Camera,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import JAPServiceCard from '@/components/JAPServiceCard';

const Services = () => {
  const { data: groupedServices, isLoading, error } = useJAPServices();
  const { track } = useAnalytics();

  const platformConfig = {
    'Instagram': { icon: Instagram, color: 'from-pink-500 to-purple-600' },
    'TikTok': { icon: MessageCircle, color: 'from-gray-900 to-gray-700' },
    'YouTube': { icon: Youtube, color: 'from-red-500 to-red-600' },
    'Facebook': { icon: Facebook, color: 'from-blue-600 to-blue-700' },
    'Twitter': { icon: Twitter, color: 'from-blue-400 to-blue-500' },
    'LinkedIn': { icon: Linkedin, color: 'from-blue-700 to-blue-800' },
    'Snapchat': { icon: Camera, color: 'from-yellow-400 to-yellow-500' },
    'Telegram': { icon: MessageCircle, color: 'from-blue-500 to-blue-600' }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading real-time services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Unavailable</h2>
          <p className="text-gray-600 mb-4">
            Unable to load services. Please check your internet connection or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Real Social Media Growth
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Authentic engagement from real users across all major social platforms. 
            All services are delivered safely and comply with platform guidelines.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Real Users Only</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Shield className="w-5 h-5 mr-2" />
              <span className="font-semibold">Safe & Secure</span>
            </div>
            <div className="flex items-center text-purple-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Services by Platform */}
        {Object.entries(groupedServices || {}).map(([platform, services]) => {
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
                {Object.entries(services).map(([serviceType, serviceList]) => (
                  <div key={serviceType} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className={`bg-gradient-to-r ${config.color} p-6 text-white`}>
                      <h3 className="text-xl font-bold mb-2">{platform} {serviceType}</h3>
                      <p className="opacity-90">Premium quality, fast delivery</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                        {(serviceList as any[]).slice(0, 6).map((service) => (
                          <JAPServiceCard
                            key={service.id}
                            service={service}
                            platformConfig={config}
                          />
                        ))}
                      </div>
                      
                      {(serviceList as any[]).length > 6 && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-500">
                            +{(serviceList as any[]).length - 6} more services available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Features Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Why Choose Our Platform?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Real Engagement</h4>
              <p className="text-sm opacity-90">All followers, likes, and views come from real, active users</p>
            </div>
            <div>
              <Shield className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">100% Safe</h4>
              <p className="text-sm opacity-90">Our methods comply with all platform guidelines</p>
            </div>
            <div>
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Instant Start</h4>
              <p className="text-sm opacity-90">Most orders begin within minutes of payment</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 inline-block"
          >
            Need Help? Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
