
import React from 'react';
import { Link } from 'react-router-dom';
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
  Facebook,
  Twitter,
  Linkedin,
  Camera
} from 'lucide-react';

interface JAPServiceCardProps {
  service: {
    id: string;
    platform: string;
    service_type: string;
    package_name: string;
    quantity: number;
    price: number;
    min_quantity: number;
    max_quantity: number;
    description: string;
    jap_service_id: number;
  };
  platformConfig: {
    icon: any;
    color: string;
  };
}

const JAPServiceCard: React.FC<JAPServiceCardProps> = ({ service, platformConfig }) => {
  const { track } = useAnalytics();

  const serviceIcons = {
    'Followers': Users,
    'Likes': Heart,
    'Comments': MessageCircle,
    'Views': Eye,
    'Subscribers': Users,
    'Watch Hours': Clock,
    'Retweets': Share,
    'Other': Share
  };

  const ServiceIcon = serviceIcons[service.service_type as keyof typeof serviceIcons] || Users;

  const handleOrderClick = () => {
    track('jap_service_order_clicked', {
      platform: service.platform,
      service_type: service.service_type,
      package_name: service.package_name,
      jap_service_id: service.jap_service_id,
    });
  };

  return (
    <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <ServiceIcon className="w-4 h-4 mr-2 text-purple-600" />
            <span className="font-semibold text-gray-900 text-sm">{service.package_name}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{service.description}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-purple-600">₦{service.price.toLocaleString()}</span>
            <span className="text-xs text-gray-500">
              {service.min_quantity.toLocaleString()}-{service.max_quantity.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center text-xs text-green-600 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Real & High Quality
          </div>
        </div>
      </div>
      
      <Link
        to={`/order?serviceId=${service.jap_service_id}&service=${encodeURIComponent(service.service_type)}&package=${encodeURIComponent(service.package_name)}&price=${encodeURIComponent(service.price)}&platform=${encodeURIComponent(service.platform)}&minQty=${service.min_quantity}&maxQty=${service.max_quantity}`}
        onClick={handleOrderClick}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-center text-sm block"
      >
        Order Now
      </Link>
    </div>
  );
};

export default JAPServiceCard;
