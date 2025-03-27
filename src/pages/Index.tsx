
import React, { useState } from 'react';
import CandyMachine from '@/components/CandyMachine';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Index = () => {
  const [email, setEmail] = useState<string>('');
  const [showCandyMachine, setShowCandyMachine] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Show success message and redirect to candy machine
    toast.success('Welcome! Enjoy the candy machine experience');
    setShowCandyMachine(true);
  };

  if (showCandyMachine) {
    return <CandyMachine />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-blue-50 py-8 flex items-center justify-center overflow-x-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
            <h1 className="text-3xl font-bold text-center mb-1">Candy Joy Machine</h1>
            <p className="text-sm text-center text-red-100">Experience the sweetness of virtual treats</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Ready to Begin?</h2>
              <p className="text-gray-600">Enter your email address to start playing with our virtual candy vending machine!</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-2 px-4 rounded-md hover:from-red-700 hover:to-red-800 transition-colors duration-300"
              >
                Start Playing
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              We'll only use your email to enhance your candy experience. No spam, we promise!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
