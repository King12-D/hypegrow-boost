
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle, Users, Heart, Play, Eye, Share, Clock } from 'lucide-react';

const Services = () => {
  const services = [
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      packages: [
        {
          name: 'Instagram Followers',
          icon: Users,
          options: [
            { quantity: '100 Followers', price: '₦500', popular: false },
            { quantity: '500 Followers', price: '₦2,000', popular: true },
            { quantity: '1,000 Followers', price: '₦3,500', popular: false },
            { quantity: '5,000 Followers', price: '₦15,000', popular: false },
          ]
        },
        {
          name: 'Instagram Likes',
          icon: Heart,
          options: [
            { quantity: '100 Likes', price: '₦300', popular: false },
            { quantity: '500 Likes', price: '₦1,200', popular: true },
            { quantity: '1,000 Likes', price: '₦2,000', popular: false },
            { quantity: '5,000 Likes', price: '₦8,000', popular: false },
          ]
        },
        {
          name: 'Instagram Comments',
          icon: MessageCircle,
          options: [
            { quantity: '10 Comments', price: '₦400', popular: false },
            { quantity: '25 Comments', price: '₦800', popular: true },
            { quantity: '50 Comments', price: '₦1,500', popular: false },
            { quantity: '100 Comments', price: '₦2,800', popular: false },
          ]
        }
      ]
    },
    {
      platform: 'TikTok',
      icon: MessageCircle,
      color: 'from-gray-900 to-gray-700',
      packages: [
        {
          name: 'TikTok Followers',
          icon: Users,
          options: [
            { quantity: '100 Followers', price: '₦600', popular: false },
            { quantity: '500 Followers', price: '₦2,500', popular: true },
            { quantity: '1,000 Followers', price: '₦4,000', popular: false },
            { quantity: '5,000 Followers', price: '₦18,000', popular: false },
          ]
        },
        {
          name: 'TikTok Views',
          icon: Eye,
          options: [
            { quantity: '1,000 Views', price: '₦200', popular: false },
            { quantity: '10,000 Views', price: '₦1,500', popular: true },
            { quantity: '50,000 Views', price: '₦6,000', popular: false },
            { quantity: '100,000 Views', price: '₦10,000', popular: false },
          ]
        },
        {
          name: 'TikTok Likes',
          icon: Heart,
          options: [
            { quantity: '100 Likes', price: '₦400', popular: false },
            { quantity: '500 Likes', price: '₦1,500', popular: true },
            { quantity: '1,000 Likes', price: '₦2,500', popular: false },
            { quantity: '5,000 Likes', price: '₦10,000', popular: false },
          ]
        }
      ]
    },
    {
      platform: 'YouTube',
      icon: Youtube,
      color: 'from-red-500 to-red-600',
      packages: [
        {
          name: 'YouTube Subscribers',
          icon: Users,
          options: [
            { quantity: '100 Subscribers', price: '₦800', popular: false },
            { quantity: '500 Subscribers', price: '₦3,500', popular: true },
            { quantity: '1,000 Subscribers', price: '₦6,500', popular: false },
            { quantity: '5,000 Subscribers', price: '₦30,000', popular: false },
          ]
        },
        {
          name: 'YouTube Views',
          icon: Play,
          options: [
            { quantity: '1,000 Views', price: '₦300', popular: false },
            { quantity: '10,000 Views', price: '₦2,500', popular: true },
            { quantity: '50,000 Views', price: '₦10,000', popular: false },
            { quantity: '100,000 Views', price: '₦18,000', popular: false },
          ]
        },
        {
          name: 'YouTube Watch Hours',
          icon: Clock,
          options: [
            { quantity: '100 Hours', price: '₦1,500', popular: false },
            { quantity: '500 Hours', price: '₦6,000', popular: true },
            { quantity: '1,000 Hours', price: '₦10,000', popular: false },
            { quantity: '4,000 Hours', price: '₦35,000', popular: false },
          ]
        }
      ]
    },
    {
      platform: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      packages: [
        {
          name: 'Status Views',
          icon: Eye,
          options: [
            { quantity: '500 Views', price: '₦400', popular: false },
            { quantity: '1,000 Views', price: '₦700', popular: true },
            { quantity: '5,000 Views', price: '₦3,000', popular: false },
            { quantity: '10,000 Views', price: '₦5,500', popular: false },
          ]
        },
        {
          name: 'Bulk Posting',
          icon: Share,
          options: [
            { quantity: '50 Groups', price: '₦1,000', popular: false },
            { quantity: '100 Groups', price: '₦1,800', popular: true },
            { quantity: '250 Groups', price: '₦4,000', popular: false },
            { quantity: '500 Groups', price: '₦7,500', popular: false },
          ]
        }
      ]
    }
  ];

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
            Choose from our comprehensive range of social media boosting services. 
            All packages include high-quality engagement and 24/7 support.
          </p>
        </div>

        {services.map((service, serviceIndex) => (
          <div key={serviceIndex} className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mr-4`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{service.platform}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {service.packages.map((pkg, pkgIndex) => (
                <div key={pkgIndex} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                    <div className="flex items-center mb-2">
                      <pkg.icon className="w-6 h-6 mr-2" />
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                    </div>
                    <p className="opacity-90">High-quality, fast delivery</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {pkg.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex} 
                          className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                            option.popular 
                              ? `border-gradient-to-r ${service.color} bg-gradient-to-r from-purple-50 to-pink-50` 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <span className="font-semibold text-gray-900">{option.quantity}</span>
                                {option.popular && (
                                  <span className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <span className="text-2xl font-bold text-purple-600">{option.price}</span>
                            </div>
                            <Link
                              to={`/order?service=${encodeURIComponent(pkg.name)}&package=${encodeURIComponent(option.quantity)}&price=${encodeURIComponent(option.price)}&platform=${encodeURIComponent(service.platform)}`}
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
              ))}
            </div>
          </div>
        ))}

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
