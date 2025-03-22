
import React from 'react';
import { motion } from 'framer-motion';
import CandyMachine from '@/components/CandyMachine';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Candy Dispenser Simulator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the joy of a real candy machine! Dispense chocolates, collect rewards based on your score, and enjoy your virtual treats.
          </p>
        </motion.div>

        <CandyMachine />
      </div>
    </div>
  );
};

export default Index;
