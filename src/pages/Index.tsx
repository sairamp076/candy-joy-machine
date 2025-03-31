
import React from 'react';
import CandyMachine from '@/components/CandyMachine';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-blue-50 py-8 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to FunFinity AI
          </h1>
          <p className="text-lg text-gray-600">
            Experience our interactive candy vending machine and AI-powered learning platform.
          </p>
        </div>
        
        <CandyMachine />
      </div>
    </div>
  );
};

export default Index;
