
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Youtube, MessageCircle, TrendingUp, Users, Heart, Play, Star } from 'lucide-react';

const Home = () => {
  const testimonials = [
    {
      name: "Chioma A.",
      text: "Got 10k followers in just 2 days! Amazing service.",
      rating: 5,
      platform: "Instagram"
    },
    {
      name: "Kemi O.",
      text: "My TikTok videos are getting way more views now. Love it!",
      rating: 5,
      platform: "TikTok"
    },
    {
      name: "David M.",
      text: "YouTube subscribers increased by 5000 in a week. Highly recommend!",
      rating: 5,
      platform: "YouTube"
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Instant Growth",
      description: "See results within 24 hours of placing your order"
    },
    {
      icon: Users,
      title: "Real Engagement",
      description: "High-quality followers and genuine interactions"
    },
    {
      icon: Star,
      title: "24/7 Support",
      description: "Round-the-clock customer service via WhatsApp"
    }
  ];

  const platforms = [
    {
      icon: Instagram,
      name: "Instagram",
      color: "from-pink-500 to-purple-600",
      services: ["Followers", "Likes", "Comments", "Views"]
    },
    {
      icon: MessageCircle,
      name: "TikTok",
      color: "from-gray-900 to-gray-700",
      services: ["Followers", "Likes", "Views", "Shares"]
    },
    {
      icon: Youtube,
      name: "YouTube",
      color: "from-red-500 to-red-600",
      services: ["Subscribers", "Likes", "Views", "Watch Hours"]
    },
    {
      icon: MessageCircle,
      name: "WhatsApp",
      color: "from-green-500 to-green-600",
      services: ["Status Views", "Bulk Posting", "Marketing"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Boost Your Social Media
            </span>
            <br />
            <span className="text-gray-900">Fame Instantly!</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get thousands of followers, likes, and views in just 24 hours. 
            Grow your Instagram, TikTok, YouTube, and WhatsApp presence with our premium services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/order"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              Place Order
            </Link>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Supported Platforms
            </span>
          </h2>
          <p className="text-gray-600 text-center mb-12 text-lg">
            Grow your presence across all major social media platforms
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${platform.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <platform.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">{platform.name}</h3>
                <ul className="space-y-2">
                  {platform.services.map((service, idx) => (
                    <li key={idx} className="text-gray-600 text-center">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose HypeGrow?
            </span>
          </h2>
          <p className="text-gray-600 text-center mb-12 text-lg">
            We deliver results that matter for your social media growth
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What Our Customers Say
            </span>
          </h2>
          <p className="text-gray-600 text-center mb-12 text-lg">
            Join thousands of satisfied customers who boosted their social media
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{testimonial.name}</span>
                  <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    {testimonial.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Go Viral?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your social media growth journey today with our premium services
          </p>
          <Link
            to="/services"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center"
          >
            Boost Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
