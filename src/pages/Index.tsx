
import React from 'react';
import CandyMachine from '@/components/CandyMachine';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-blue-50 py-2 overflow-x-hidden">
      <div className="container mx-auto px-2 md:px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 pt-2 mb-4">
          Candy Vending Machine
        </h1>
        <CandyMachine />
      </div>
    </div>
  );
};

export default Index;
