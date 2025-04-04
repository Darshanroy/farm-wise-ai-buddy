
import React from 'react';
import WelcomeSection from '@/components/WelcomeSection';
import ChatInterface from '@/components/ChatInterface';
import { Sprout } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-farm-green-100/40 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/farm-pattern.svg')] opacity-5 z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-farm-green-500/20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-farm-green-500" />
              <span className="font-bold text-xl text-farm-green-700">FarmWise</span>
            </div>
            <div>
              <a 
                href="https://github.com/yourusername/farm-wise-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-farm-brown-600 hover:text-farm-green-700 transition-colors"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <WelcomeSection />
          <ChatInterface />
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-farm-brown-600">
          <p>© 2025 FarmWise AI Buddy • Helping farmers grow better</p>
          {/* <p className="mt-1 text-xs">This is a demo application. Advice is simulated.</p> */}
        </footer>
      </main>
    </div>
  );
};

export default Index;
