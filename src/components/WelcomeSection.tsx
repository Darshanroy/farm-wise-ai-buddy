
import React from 'react';
import { Leaf, Cloud, Bug, Info } from 'lucide-react';

const WelcomeSection: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-farm-green-700">
          FarmWise AI Buddy
        </h1>
        <p className="text-lg text-farm-brown-600">
          Your virtual farming assistant powered by AI
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-farm-green-100 flex items-start gap-3">
          <div className="bg-farm-green-100 p-2 rounded-full">
            <Leaf className="w-5 h-5 text-farm-green-700" />
          </div>
          <div>
            <h3 className="font-semibold text-farm-brown-800">Crop Guidance</h3>
            <p className="text-sm text-farm-brown-600">Get advice on planting, growing, and harvesting a variety of crops</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-farm-green-100 flex items-start gap-3">
          <div className="bg-farm-green-100 p-2 rounded-full">
            <Cloud className="w-5 h-5 text-farm-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-farm-brown-800">Weather Insights</h3>
            <p className="text-sm text-farm-brown-600">Understand how weather conditions affect your farming decisions</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-farm-green-100 flex items-start gap-3">
          <div className="bg-farm-green-100 p-2 rounded-full">
            <Bug className="w-5 h-5 text-farm-brown-600" />
          </div>
          <div>
            <h3 className="font-semibold text-farm-brown-800">Pest & Disease Control</h3>
            <p className="text-sm text-farm-brown-600">Solutions for managing pests and diseases affecting your plants</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-farm-green-100 flex items-start gap-3">
          <div className="bg-farm-green-100 p-2 rounded-full">
            <Info className="w-5 h-5 text-farm-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-farm-brown-800">Best Practices</h3>
            <p className="text-sm text-farm-brown-600">Learn sustainable and efficient farming techniques</p>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-2">
        <p className="text-farm-brown-600 italic">
          Ask me anything about farming and I'll do my best to help!
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;
