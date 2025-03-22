
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Candy from './Candy';
import HistoryPanel from './HistoryPanel';
import { 
  Candy as CandyType, 
  HistoryItem,
  createCandy, 
  getCandyCountForScore, 
  generateCandies, 
  playSound, 
  CANDY_DETAILS
} from '@/utils/candyUtils';
import { cn } from '@/lib/utils';

const CandyMachine = () => {
  const [candies, setCandies] = useState<CandyType[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // Refs for measuring container dimensions
  const displayWindowRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  
  // Input ref for score
  const scoreInputRef = useRef<HTMLInputElement>(null);

  // Update the container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (displayWindowRef.current) {
        setWindowDimensions({
          width: displayWindowRef.current.offsetWidth,
          height: displayWindowRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    // Initial candies for display window
    setCandies(generateCandies(8, windowDimensions.width, windowDimensions.height));
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle single candy dispensing
  const handleDispense = () => {
    if (isDispensing) return;
    
    setIsDispensing(true);
    playSound('button');
    
    setTimeout(() => {
      const newCandy = createCandy(
        trayRef.current?.offsetWidth || 300, 
        50
      );
      
      setCandies(prev => [...prev, newCandy]);
      playSound('drop');
      
      setIsDispensing(false);
    }, 300);
  };

  // Handle multiple candy dispensing based on score
  const handleWinDrop = () => {
    if (isDispensing) return;
    
    const userScore = parseInt(scoreInputRef.current?.value || "0", 10);
    if (isNaN(userScore) || userScore <= 0) return;
    
    setIsDispensing(true);
    playSound('button');
    
    // Determine how many candies to drop based on score
    const candyCount = getCandyCountForScore(userScore);
    
    // Stagger the candy drops
    let droppedCount = 0;
    
    const dropInterval = setInterval(() => {
      if (droppedCount >= candyCount) {
        clearInterval(dropInterval);
        setIsDispensing(false);
        return;
      }
      
      const newCandy = createCandy(
        trayRef.current?.offsetWidth || 300, 
        50
      );
      
      setCandies(prev => [...prev, newCandy]);
      playSound('drop');
      
      droppedCount++;
    }, 200);
  };

  // Handle eating a candy
  const handleEatCandy = (id: string) => {
    setCandies(prev => 
      prev.map(candy => 
        candy.id === id ? { ...candy, isEaten: true } : candy
      )
    );
    
    // Find the eaten candy
    const eatenCandy = candies.find(candy => candy.id === id);
    
    if (eatenCandy) {
      // Calculate score based on candy type
      const candyScore = CANDY_DETAILS[eatenCandy.type].baseScore;
      
      // Add to history
      const historyItem: HistoryItem = {
        id: eatenCandy.id,
        type: eatenCandy.type,
        timestamp: new Date(),
        score: candyScore
      };
      
      setHistory(prev => [historyItem, ...prev]);
      
      // Update total score
      setScore(prev => prev + candyScore);
      
      // Remove eaten candy after animation
      setTimeout(() => {
        setCandies(prev => prev.filter(candy => candy.id !== id));
      }, 500);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
      {/* Candy Machine */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 bg-candy-machine-primary rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-6 rounded-t-xl border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">Candy Dispenser</h1>
        </div>
        
        {/* Display window */}
        <div className="relative p-6">
          <div 
            ref={displayWindowRef}
            className="display-window relative h-48 rounded-lg mb-6 overflow-hidden"
          >
            {/* Display some candies for visual effect */}
            {candies.filter(candy => !candy.isEaten).map(candy => (
              <Candy 
                key={candy.id}
                candy={candy}
                onEat={() => {}} // Cannot eat candies in display
                containerWidth={windowDimensions.width}
                containerHeight={windowDimensions.height}
              />
            ))}
          </div>
          
          {/* Collector tray */}
          <div 
            ref={trayRef}
            className="collector-tray relative h-40 rounded-lg mb-6 overflow-hidden"
          >
            {/* Candies in the tray that can be eaten */}
            <AnimatePresence>
              {candies.filter(candy => !candy.isEaten).map(candy => (
                <Candy 
                  key={candy.id}
                  candy={candy}
                  onEat={handleEatCandy}
                  isNew={true}
                  containerWidth={trayRef.current?.offsetWidth || 300}
                  containerHeight={trayRef.current?.offsetHeight || 120}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Control panel */}
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-lg shadow-inner-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleDispense}
                disabled={isDispensing}
                variant="secondary"
                size="large"
                className="w-full"
              >
                Dispense Candy
              </Button>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    ref={scoreInputRef}
                    type="number"
                    min="1"
                    placeholder="Enter score"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <Button
                    onClick={handleWinDrop}
                    disabled={isDispensing}
                    variant="primary"
                    className="whitespace-nowrap"
                  >
                    Win Drop
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter score to get candy rewards!<br />
                  1-50: 1-2 candies<br />
                  51-100: 3-5 candies<br />
                  101+: 6-10 candies
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* History and Score Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full lg:w-80 space-y-6"
      >
        {/* Score display */}
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Score</h2>
          <div className="text-4xl font-bold text-blue-600">{score}</div>
        </div>
        
        {/* History panel */}
        <HistoryPanel history={history} />
      </motion.div>
    </div>
  );
};

export default CandyMachine;
