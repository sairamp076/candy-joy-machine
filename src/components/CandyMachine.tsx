
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
  const [displayCandies, setDisplayCandies] = useState<{[key in CandyType]: CandyType[]}>({
    fivestar: [],
    milkybar: [],
    dairymilk: [],
    eclairs: []
  });
  const [collectedCandies, setCollectedCandies] = useState<CandyType[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  
  // Refs for measuring container dimensions
  const displayWindowRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  
  // Input ref for score
  const scoreInputRef = useRef<HTMLInputElement>(null);

  // Initialize machine with candies
  useEffect(() => {
    // Generate display candies for each candy type compartment
    const newDisplayCandies = {
      fivestar: generateCandies(6, 'fivestar'),
      milkybar: generateCandies(6, 'milkybar'),
      dairymilk: generateCandies(6, 'dairymilk'),
      eclairs: generateCandies(6, 'eclairs')
    };
    
    setDisplayCandies(newDisplayCandies);
  }, []);

  // Handle single candy dispensing
  const handleDispense = () => {
    if (isDispensing) return;
    
    setIsDispensing(true);
    playSound('button');
    
    // Get a random candy type
    const candyTypes: CandyType[] = ['fivestar', 'milkybar', 'dairymilk', 'eclairs'];
    const randomType = candyTypes[Math.floor(Math.random() * candyTypes.length)];
    
    // Create a new candy in the collection tray
    setTimeout(() => {
      const trayWidth = trayRef.current?.offsetWidth || 300;
      const trayHeight = trayRef.current?.offsetHeight || 120;
      
      const newCandy = createCandy(randomType, trayWidth, trayHeight / 2);
      
      setCollectedCandies(prev => [...prev, newCandy]);
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
    const trayWidth = trayRef.current?.offsetWidth || 300;
    const trayHeight = trayRef.current?.offsetHeight || 120;
    
    // Add the score from the input to the total score
    setScore(prevScore => prevScore + userScore);
    
    // Stagger the candy drops
    let droppedCount = 0;
    
    const dropInterval = setInterval(() => {
      if (droppedCount >= candyCount) {
        clearInterval(dropInterval);
        setIsDispensing(false);
        return;
      }
      
      const candyTypes: CandyType[] = ['fivestar', 'milkybar', 'dairymilk', 'eclairs'];
      const randomType = candyTypes[Math.floor(Math.random() * candyTypes.length)];
      
      const newCandy = createCandy(
        randomType,
        trayWidth, 
        trayHeight / 2
      );
      
      setCollectedCandies(prev => [...prev, newCandy]);
      playSound('drop');
      
      droppedCount++;
    }, 200);
  };

  // Handle eating a candy
  const handleEatCandy = (id: string) => {
    // Find the eaten candy
    const eatenCandy = collectedCandies.find(candy => candy.id === id);
    
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
      
      // Remove eaten candy
      setCollectedCandies(prev => prev.filter(candy => candy.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
      {/* Candy Machine */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 bg-gradient-to-b from-gray-300 to-gray-400 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-500"
      >
        {/* Machine header with brand */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-md border-b-4 border-gray-600">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-md tracking-wider">CANDY HUB</h1>
          <p className="text-sm text-center text-gray-100">Premium Candy Vending</p>
        </div>
        
        {/* 3D Machine body with perspective */}
        <div className="relative p-6 bg-gradient-to-b from-gray-200 to-gray-300 perspective">
          {/* Product display window */}
          <div 
            ref={displayWindowRef}
            className="display-window relative h-72 rounded-lg mb-6 overflow-hidden border-8 border-gray-600 shadow-inner bg-gradient-to-b from-gray-100 to-gray-200"
          >
            {/* Glass reflection effect */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white opacity-20 transform skew-y-3"></div>
            
            {/* Candy compartments grid */}
            <div className="grid grid-cols-2 gap-2 p-3 h-full">
              {/* 5 Star compartment */}
              <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                  A1: 5 Star
                </div>
                <div className="flex flex-wrap justify-center items-center h-full">
                  {displayCandies.fivestar.map((candy, index) => (
                    <div key={`display-${candy.id}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                      <Candy 
                        candy={candy}
                        onEat={() => {}} // Cannot eat display candies
                        isDisplayOnly={true}
                        containerWidth={100}
                        containerHeight={60}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Milkybar compartment */}
              <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                  A2: Milkybar
                </div>
                <div className="flex flex-wrap justify-center items-center h-full">
                  {displayCandies.milkybar.map((candy, index) => (
                    <div key={`display-${candy.id}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                      <Candy 
                        candy={candy}
                        onEat={() => {}} // Cannot eat display candies
                        isDisplayOnly={true}
                        containerWidth={100}
                        containerHeight={60}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dairy Milk compartment */}
              <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                  A3: Dairy Milk
                </div>
                <div className="flex flex-wrap justify-center items-center h-full">
                  {displayCandies.dairymilk.map((candy, index) => (
                    <div key={`display-${candy.id}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                      <Candy 
                        candy={candy}
                        onEat={() => {}} // Cannot eat display candies
                        isDisplayOnly={true}
                        containerWidth={100}
                        containerHeight={60}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Eclairs compartment */}
              <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                  A4: Eclairs
                </div>
                <div className="flex flex-wrap justify-center items-center h-full">
                  {displayCandies.eclairs.map((candy, index) => (
                    <div key={`display-${candy.id}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                      <Candy 
                        candy={candy}
                        onEat={() => {}} // Cannot eat display candies
                        isDisplayOnly={true}
                        containerWidth={100}
                        containerHeight={60}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Machine dispensing mechanism */}
          <div className="relative mx-auto w-3/4 h-8 bg-gray-700 rounded-t-lg mb-0 flex justify-center items-center">
            <div className="w-20 h-1 bg-black"></div>
          </div>
          
          {/* Collector tray */}
          <div className="relative mx-auto w-3/4 perspective">
            <div 
              ref={trayRef}
              className="collector-tray relative h-40 rounded-b-xl overflow-hidden border-4 border-t-0 border-gray-700 bg-gray-800 shadow-inner"
            >
              {/* Tray label */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                Collection Tray
              </div>
              
              {/* Candies in the tray that can be eaten */}
              <div className="relative h-full w-full">
                {collectedCandies.map(candy => (
                  <Candy 
                    key={candy.id}
                    candy={candy}
                    onEat={handleEatCandy}
                    containerWidth={trayRef.current?.offsetWidth || 300}
                    containerHeight={trayRef.current?.offsetHeight || 120}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* 3D Control panel with perspective */}
          <div className="mt-6 bg-gradient-to-r from-gray-600 to-gray-700 p-6 rounded-lg shadow-inner border-2 border-gray-500 transform rotate-x-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left panel with keypad */}
              <div className="bg-gray-800 p-4 rounded-md shadow-inner">
                <div className="mb-3 flex justify-between items-center">
                  <div className="text-sm text-white font-semibold">OPERATION</div>
                  <div className="w-8 h-4 bg-red-500 rounded-sm shadow-inner"></div>
                </div>
                
                <Button
                  onClick={handleDispense}
                  disabled={isDispensing}
                  variant="secondary"
                  size="large"
                  className="w-full mb-4 bg-gradient-to-r from-gray-300 to-gray-400 border-2 border-gray-500 text-gray-900 font-bold"
                >
                  Dispense Candy
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <div 
                      key={num} 
                      className="bg-gray-700 text-white h-8 rounded flex items-center justify-center cursor-pointer hover:bg-gray-600 text-sm font-semibold shadow-md"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right panel with score input */}
              <div className="bg-gray-800 p-4 rounded-md shadow-inner">
                <div className="mb-3 text-sm text-white font-semibold">SCORE REWARDS</div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={scoreInputRef}
                      type="number"
                      min="1"
                      placeholder="Enter score"
                      className="flex-1 px-3 py-2 bg-black bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <Button
                      onClick={handleWinDrop}
                      disabled={isDispensing}
                      variant="primary"
                      className="whitespace-nowrap bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-700 text-white"
                    >
                      Win Drop
                    </Button>
                  </div>
                  <div className="text-xs text-gray-300 bg-black bg-opacity-30 p-2 rounded">
                    <div className="font-semibold mb-1">Rewards Chart:</div>
                    <div>1-50 pts: 1-2 candies</div>
                    <div>51-100 pts: 3-5 candies</div>
                    <div>101+ pts: 6-10 candies</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Machine footer with coin slot */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-gray-600 flex items-center justify-center">
                  <div className="w-6 h-1 bg-black rounded"></div>
                </div>
                <div className="w-10 h-10 rounded-md bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-gray-600 flex items-center justify-center text-white text-xs font-mono">
                  OK
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-6 bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded mb-1"></div>
                <div className="text-xs text-white">COIN SLOT</div>
              </div>
            </div>
          </div>

          {/* 3D Machine depth elements */}
          <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-400 to-transparent opacity-30"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-400 to-transparent opacity-30"></div>
            <div className="absolute left-8 right-8 top-0 h-8 bg-gradient-to-b from-gray-400 to-transparent opacity-30"></div>
            <div className="absolute left-8 right-8 bottom-0 h-8 bg-gradient-to-t from-gray-400 to-transparent opacity-30"></div>
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
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 shadow-md border border-gray-200">
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
