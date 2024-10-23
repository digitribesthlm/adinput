import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Brand';
  const imageName = process.env.NEXT_PUBLIC_IMAGE_NAME || '/placeholder.jpg';

  const adPlatforms = [
    {
      name: "Facebook Ads",
      description: "Manage Facebook campaigns with a single input - we'll optimize your ad content across formats."
    },
    {
      name: "Google Ads",
      description: "Write once, deploy everywhere across Search, Display, and Performance Max campaigns."
    },
    {
      name: "LinkedIn Ads",
      description: "Transform your content automatically into professional B2B-focused ad variations."
    },
    {
      name: "Twitter Ads",
      description: "Auto-adapt your message into engaging Twitter-optimized ad formats."
    },
    {
      name: "Bing Ads",
      description: "Extend your reach to Bing users without additional content creation effort."
    },
    {
      name: "Instagram Ads",
      description: "Convert your input into visually appealing Instagram-ready ad formats."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">{brandName}</span>
            </div>
            <div>
              <button className="text-gray-600 hover:text-blue-600 font-medium">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center gap-12 py-16">
            {/* Left Column with Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-teal-50">
                <img 
                  src={imageName}
                  alt="Unified Ad Management" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/800'; // Fallback image
                  }}
                />
              </div>
            </div>

            {/* Right Column with Text */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-6">
                <h1 className="space-y-2">
                  <span className="block text-6xl lg:text-7xl font-black tracking-tight text-gray-900">
                    ONE INPUT
                  </span>
                  <span className="block text-6xl lg:text-7xl font-black tracking-tight text-blue-500">
                    ALL
                  </span>
                  <span className="block text-6xl lg:text-7xl font-black tracking-tight text-teal-500">
                    PLATFORMS
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mt-6">
                  Save countless hours with our unified ad management platform. 
                  Write your ad copy once, and we'll automatically optimize it 
                  for every major advertising platform. Smart automation meets 
                  seamless deployment.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button className="inline-flex items-center px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="inline-flex items-center px-6 py-3 text-base font-bold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                  See How It Works
                </button>
              </div>
            </div>
          </div>

          {/* Ad Platforms Grid Section */}
          <div className="py-16">
            <h2 className="text-4xl font-bold text-center mb-12">One Input, Every Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adPlatforms.map((platform, index) => (
                <div 
                  key={index} 
                  className="p-8 rounded-xl border hover:shadow-lg transition-all duration-300 bg-white hover:scale-105"
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <span className="text-blue-600 text-2xl font-bold">
                          {platform.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center text-gray-800">
                      {platform.name}
                    </h3>
                    <p className="text-gray-600 text-center">
                      {platform.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Brand Section */}
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
              <span className="text-xl font-bold text-blue-600">{brandName}</span>
              <p className="text-gray-600 text-sm mt-2">
                Simplifying digital advertising through smart automation.
              </p>
            </div>

            {/* Horizontal Legal Links */}
            <div className="flex flex-wrap justify-center items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                Privacy Policy
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                Terms of Service
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                Cookie Policy
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-600 text-sm pt-8 border-t border-gray-200 w-full">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;