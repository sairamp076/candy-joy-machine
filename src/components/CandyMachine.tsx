
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
  generateDisplayCandies,
  playSound, 
  CANDY_DETAILS,
  createEclairsCandy,
  calculateTotalScore
} from '@/utils/candyUtils';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { PackagePlus, Package, ShoppingCart, RefreshCw } from 'lucide-react';

const CandyMachine = () => {
  // Updated state to track candy counts in each compartment
  const [candyCounts, setCandyCounts] = useState<{[key in CandyType]: number}>({
    fivestar: CANDY_DETAILS.fivestar.defaultCount,
    milkybar: CANDY_DETAILS.milkybar.defaultCount,
    dairymilk: CANDY_DETAILS.dairymilk.defaultCount,
    eclairs: CANDY_DETAILS.eclairs.defaultCount
  });
  
  const [displayCandies, setDisplayCandies] = useState<{[key: string]: CandyType[]}>({
    fivestar: [],
    milkybar: [],
    dairymilk: [],
    eclairs: []
  });
  const [collectedCandies, setCollectedCandies] = useState<CandyType[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  const [refillCount, setRefillCount] = useState<number>(5);
  
  // Refs for measuring container dimensions
  const displayWindowRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  
  // Input ref for score
  const scoreInputRef = useRef<HTMLInputElement>(null);

  // Initialize machine with candies
  useEffect(() => {
    // Generate display candies for each candy type compartment
    initializeCandies();
  }, []);
  
  const initializeCandies = () => {
    const newDisplayCandies = {
      fivestar: generateDisplayCandies(candyCounts.fivestar, 'fivestar'),
      milkybar: generateDisplayCandies(candyCounts.milkybar, 'milkybar'),
      dairymilk: generateDisplayCandies(candyCounts.dairymilk, 'dairymilk'),
      eclairs: generateDisplayCandies(candyCounts.eclairs, 'eclairs')
    };
    
    setDisplayCandies(newDisplayCandies);
  };

  // Handle single candy dispensing (only Eclairs)
  const handleDispense = () => {
    if (isDispensing || candyCounts.eclairs <= 0) return;
    
    setIsDispensing(true);
    playSound('button');
    
    // Decrease the count of Eclairs
    setCandyCounts(prev => ({
      ...prev,
      eclairs: prev.eclairs - 1
    }));
    
    // Update display candies to reflect the reduced count
    setDisplayCandies(prev => ({
      ...prev,
      eclairs: generateDisplayCandies(candyCounts.eclairs - 1, 'eclairs')
    }));
    
    // Create a new Eclairs candy in the collection tray
    setTimeout(() => {
      const trayWidth = trayRef.current?.offsetWidth || 300;
      const trayHeight = trayRef.current?.offsetHeight || 120;
      
      const newCandy = createEclairsCandy(trayWidth, trayHeight / 2);
      
      setCollectedCandies(prev => [...prev, newCandy]);
      playSound('drop');
      
      setIsDispensing(false);
    }, 300);
  };

  // Handle refill for all compartments
  const handleRefillAll = () => {
    if (isDispensing) return;
    
    playSound('button');
    
    // Reset all candy counts to default
    setCandyCounts({
      fivestar: CANDY_DETAILS.fivestar.defaultCount,
      milkybar: CANDY_DETAILS.milkybar.defaultCount,
      dairymilk: CANDY_DETAILS.dairymilk.defaultCount,
      eclairs: CANDY_DETAILS.eclairs.defaultCount
    });
    
    // Refill all compartments with default count
    const newDisplayCandies = {
      fivestar: generateDisplayCandies(CANDY_DETAILS.fivestar.defaultCount, 'fivestar'),
      milkybar: generateDisplayCandies(CANDY_DETAILS.milkybar.defaultCount, 'milkybar'),
      dairymilk: generateDisplayCandies(CANDY_DETAILS.dairymilk.defaultCount, 'dairymilk'),
      eclairs: generateDisplayCandies(CANDY_DETAILS.eclairs.defaultCount, 'eclairs')
    };
    
    setDisplayCandies(newDisplayCandies);
  };

  // Handle refill for a specific compartment
  const handleRefillCompartment = (type: CandyType) => {
    if (isDispensing) return;
    
    playSound('button');
    
    // Update the count for the specific compartment
    setCandyCounts(prev => ({
      ...prev,
      [type]: Math.min(prev[type] + refillCount, CANDY_DETAILS[type].defaultCount)
    }));
    
    // Generate new candies for the specific compartment
    setDisplayCandies(prev => ({
      ...prev,
      [type]: generateDisplayCandies(
        Math.min(candyCounts[type] + refillCount, CANDY_DETAILS[type].defaultCount), 
        type
      )
    }));
  };

  // Handle collecting all candies
  const handleCollectAll = () => {
    if (collectedCandies.length === 0) return;
    
    // Add all collected candies to history
    const now = new Date();
    
    collectedCandies.forEach(candy => {
      const candyScore = CANDY_DETAILS[candy.type].baseScore;
      
      const historyItem: HistoryItem = {
        id: candy.id,
        type: candy.type,
        timestamp: now,
        score: candyScore
      };
      
      setHistory(prev => [historyItem, ...prev]);
    });
    
    // Clear collection tray
    setCollectedCandies([]);
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
    
    // Prepare to drop candies
    let droppedCount = 0;
    let remainingTypes = Object.keys(candyCounts).filter(
      type => candyCounts[type as CandyType] > 0
    );
    
    if (remainingTypes.length === 0) {
      setIsDispensing(false);
      return; // No candies left to dispense
    }
    
    // Drop candies one by one
    const dropInterval = setInterval(() => {
      if (droppedCount >= candyCount || remainingTypes.length === 0) {
        clearInterval(dropInterval);
        setIsDispensing(false);
        return;
      }
      
      // Randomly select a candy type that still has candies
      const randomTypeIndex = Math.floor(Math.random() * remainingTypes.length);
      const selectedType = remainingTypes[randomTypeIndex] as CandyType;
      
      // Check if we still have candies of this type
      if (candyCounts[selectedType] <= 0) {
        remainingTypes = remainingTypes.filter(type => type !== selectedType);
        return;
      }
      
      // Decrease the count
      setCandyCounts(prev => ({
        ...prev,
        [selectedType]: prev[selectedType] - 1
      }));
      
      // Update display candies
      setDisplayCandies(prev => ({
        ...prev,
        [selectedType]: generateDisplayCandies(candyCounts[selectedType] - 1, selectedType)
      }));
      
      // Create a new candy of the selected type
      const newCandy = createCandy(selectedType, trayWidth, trayHeight / 2);
      
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
      {/* 3D Candy Machine with improved cylindrical shape */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 bg-gradient-to-b from-gray-300 to-gray-400 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-500 relative"
        style={{
          transform: "perspective(1000px) rotateX(5deg)",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Machine header with brand */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-md border-b-4 border-gray-600">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-md tracking-wider">CANDY HUB</h1>
          <p className="text-sm text-center text-gray-100">Premium Candy Vending</p>
        </div>
        
        {/* Machine body with enhanced cylindrical shape */}
        <div className="relative p-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-xl">
          {/* Product display window */}
          <div 
            ref={displayWindowRef}
            className="display-window relative h-72 rounded-lg mb-6 overflow-hidden border-8 border-gray-600 shadow-inner bg-gradient-to-b from-gray-100 to-gray-200"
            style={{
              borderRadius: "12px 12px 30px 30px",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)"
            }}
          >
            {/* Glass reflection effect */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-white opacity-20 transform skew-y-3"></div>
            
            {/* Candy compartments grid */}
            <div className="grid grid-cols-2 gap-2 p-3 h-full">
              {/* 5 Star compartment */}
              <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                  A1: 5 Star ({candyCounts.fivestar})
                </div>
                <div className="flex flex-wrap justify-center items-center h-full">
                  {displayCandies.fivestar.map((candy, index) => (
                    <div key={`display-fivestar-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                      <Candy 
                        candy={candy}
                        onEat={() => {}} 
                        isDisplayOnly={true}
                        containerWidth={100}
                        containerHeight={60}
                      />
                    </div>
                  ))}
                </div>
                {/* Refill button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="absolute right-2 bottom-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1">
                      <RefreshCw size={12} />
                      Refill
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Refill 5 Star Compartment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the number of candies to add:
                        <Input 
                          type="number" 
                          min="1" 
                          max="20" 
                          className="mt-2" 
                          value={refillCount}
                          onChange={(e) => setRefillCount(Number(e.target.value))}
                        />
                        <div className="mt-2 text-sm">
                          Current: {candyCounts.fivestar} / {CANDY_DETAILS.fivestar.defaultCount}
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRefillCompartment('fivestar')}>Refill</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              {/* Milkybar compartment */}
              <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                  A2: Milkybar ({candyCounts.milkybar})
                </div>
                <div className="flex flex-wrap justify-center items-center h-full">
                  {displayCandies.milkybar.map((candy, index) => (
                    <div key={`display-milkybar-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                      <Candy 
                        candy={candy}
                        onEat={() => {}}
                        isDisplayOnly={true}
                        containerWidth={100}
                        containerHeight={60}
                      />
                    </div>
                  ))}
                </div>
                {/* Refill button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="absolute right-2 bottom-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1">
                      <RefreshCw size={12} />
                      Refill
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Refill Milkybar Compartment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the number of candies to add:
                        <Input 
                          type="number" 
                          min="1" 
                          max="20" 
                          className="mt-2" 
                          value={refillCount}
                          onChange={(e) => setRefillCount(Number(e.target.value))}
                        />
                        <div className="mt-2 text-sm">
                          Current: {candyCounts.milkybar} / {CANDY_DETAILS.milkybar.defaultCount}
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRefillCompartment('milkybar')}>Refill</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              {/* Dairy Milk compartment */}
              <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                  A3: Dairy Milk ({candyCounts.dairymilk})
                </div>
                <div className="flex flex-wrap justify-center items-center h-full">
                  {displayCandies.dairymilk.map((candy, index) => (
                    <div key={`display-dairymilk-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                      <Candy 
                        candy={candy}
                        onEat={() => {}}
                        isDisplayOnly={true}
                        containerWidth={100}
                        containerHeight={60}
                      />
                    </div>
                  ))}
                </div>
                {/* Refill button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="absolute right-2 bottom-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1">
                      <RefreshCw size={12} />
                      Refill
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Refill Dairy Milk Compartment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the number of candies to add:
                        <Input 
                          type="number" 
                          min="1" 
                          max="20" 
                          className="mt-2" 
                          value={refillCount}
                          onChange={(e) => setRefillCount(Number(e.target.value))}
                        />
                        <div className="mt-2 text-sm">
                          Current: {candyCounts.dairymilk} / {CANDY_DETAILS.dairymilk.defaultCount}
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRefillCompartment('dairymilk')}>Refill</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              {/* Eclairs compartment */}
              <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                  A4: Eclairs ({candyCounts.eclairs})
                </div>
                <div className="flex flex-wrap justify-center items-center h-full">
                  {displayCandies.eclairs.map((candy, index) => (
                    <div key={`display-eclairs-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                      <Candy 
                        candy={candy}
                        onEat={() => {}}
                        isDisplayOnly={true}
                        containerWidth={100}
                        containerHeight={60}
                      />
                    </div>
                  ))}
                </div>
                {/* Refill button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="absolute right-2 bottom-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1">
                      <RefreshCw size={12} />
                      Refill
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Refill Eclairs Compartment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the number of candies to add:
                        <Input 
                          type="number" 
                          min="1" 
                          max="20" 
                          className="mt-2" 
                          value={refillCount}
                          onChange={(e) => setRefillCount(Number(e.target.value))}
                        />
                        <div className="mt-2 text-sm">
                          Current: {candyCounts.eclairs} / {CANDY_DETAILS.eclairs.defaultCount}
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRefillCompartment('eclairs')}>Refill</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
          
          {/* Enhanced machine dispensing mechanism with animation */}
          <div className="relative mx-auto w-3/4 h-8 bg-gray-700 rounded-t-lg mb-0 flex justify-center items-center">
            <div className="w-20 h-1 bg-black"></div>
            {isDispensing && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="animate-bounce w-4 h-4 bg-amber-400 rounded-full opacity-75"></div>
              </div>
            )}
          </div>
          
          {/* Collector tray */}
          <div className="relative mx-auto w-3/4 perspective">
            <div 
              ref={trayRef}
              className="collector-tray relative h-40 rounded-b-xl overflow-hidden border-4 border-t-0 border-gray-700 bg-gray-800 shadow-inner"
              style={{
                borderBottomRightRadius: "30px",
                borderBottomLeftRadius: "30px",
                boxShadow: "inset 0 5px 15px rgba(0,0,0,0.3)"
              }}
            >
              {/* Tray label */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                Collection Tray
              </div>
              
              {/* Collect All button */}
              <button 
                onClick={handleCollectAll}
                className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full hover:bg-green-600 transition-colors flex items-center gap-1"
                disabled={collectedCandies.length === 0}
              >
                <ShoppingCart size={12} />
                Collect All
              </button>
              
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
              {/* Left panel with operation controls */}
              <div className="bg-gray-800 p-4 rounded-md shadow-inner">
                <div className="mb-3 flex justify-between items-center">
                  <div className="text-sm text-white font-semibold">OPERATION</div>
                  <div className="w-8 h-4 bg-red-500 rounded-sm shadow-inner"></div>
                </div>
                
                <Button
                  onClick={handleDispense}
                  disabled={isDispensing || candyCounts.eclairs <= 0}
                  variant="secondary"
                  size="large"
                  className="w-full mb-3 bg-gradient-to-r from-gray-300 to-gray-400 border-2 border-gray-500 text-gray-900 font-bold flex items-center justify-center gap-2"
                >
                  <Package size={16} />
                  Dispense Eclairs
                </Button>
                
                <Button
                  onClick={handleRefillAll}
                  disabled={isDispensing}
                  variant="secondary"
                  size="large"
                  className="w-full bg-gradient-to-r from-blue-300 to-blue-400 border-2 border-blue-500 text-gray-900 font-bold flex items-center justify-center gap-2"
                >
                  <PackagePlus size={16} />
                  Refill All
                </Button>
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

          {/* Enhanced 3D Machine depth elements */}
          <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-400 to-transparent opacity-30"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-400 to-transparent opacity-30"></div>
            <div className="absolute left-8 right-8 top-0 h-8 bg-gradient-to-b from-gray-400 to-transparent opacity-30"></div>
            <div className="absolute left-8 right-8 bottom-0 h-8 bg-gradient-to-t from-gray-400 to-transparent opacity-30"></div>
          </div>
        </div>
        
        {/* Enhanced machine sides to create more pronounced 3D cylindrical effect */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-500 to-gray-300 opacity-80 rounded-l-3xl"></div>
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-500 to-gray-300 opacity-80 rounded-r-3xl"></div>
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
          <div className="text-sm text-gray-500 mt-2">
            History Total: {calculateTotalScore(history)}
          </div>
        </div>
        
        {/* History panel */}
        <HistoryPanel history={history} />
      </motion.div>
    </div>
  );
};

export default CandyMachine;
