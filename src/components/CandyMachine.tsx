import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Candy from './Candy';
import HistoryPanel from './HistoryPanel';
import StockManagement from './StockManagement';
import { 
  Candy as CandyType, 
  CandyType as CandyTypeEnum,
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
import { 
  PackagePlus, 
  Package, 
  ShoppingCart, 
  RefreshCw, 
  Menu, 
  Truck, 
  User, 
  Store,
  Zap,
  Trophy
} from 'lucide-react';
import { toast } from "sonner";
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StockLevels {
  vendingMachine: Record<CandyTypeEnum, number>;
  floorManager: Record<CandyTypeEnum, number>;
  vendor: Record<CandyTypeEnum, number>;
}

const CandyMachine = () => {
  const [candyCounts, setCandyCounts] = useState<Record<CandyTypeEnum, number>>({
    fivestar: CANDY_DETAILS.fivestar.defaultCount,
    milkybar: CANDY_DETAILS.milkybar.defaultCount,
    dairymilk: CANDY_DETAILS.dairymilk.defaultCount,
    eclairs: CANDY_DETAILS.eclairs.defaultCount,
    ferrero: CANDY_DETAILS.ferrero.defaultCount
  });
  
  const [stockLevels, setStockLevels] = useState<StockLevels>({
    vendingMachine: { ...candyCounts },
    floorManager: {
      fivestar: 20,
      milkybar: 20,
      dairymilk: 20,
      eclairs: 20,
      ferrero: 20
    },
    vendor: {
      fivestar: 50,
      milkybar: 50,
      dairymilk: 50,
      eclairs: 50,
      ferrero: 50
    }
  });
  
  const [displayCandies, setDisplayCandies] = useState<Record<CandyTypeEnum, CandyType[]>>({
    fivestar: [],
    milkybar: [],
    dairymilk: [],
    eclairs: [],
    ferrero: []
  });
  const [collectedCandies, setCollectedCandies] = useState<CandyType[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  const [refillCount, setRefillCount] = useState<number>(5);
  
  const displayWindowRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  
  const scoreInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeCandies();
    setStockLevels(prev => ({
      ...prev,
      vendingMachine: { ...candyCounts }
    }));
  }, []);
  
  const initializeCandies = () => {
    const newDisplayCandies: Record<CandyTypeEnum, CandyType[]> = {
      fivestar: generateDisplayCandies(candyCounts.fivestar, 'fivestar'),
      milkybar: generateDisplayCandies(candyCounts.milkybar, 'milkybar'),
      dairymilk: generateDisplayCandies(candyCounts.dairymilk, 'dairymilk'),
      eclairs: generateDisplayCandies(candyCounts.eclairs, 'eclairs'),
      ferrero: generateDisplayCandies(candyCounts.ferrero, 'ferrero')
    };
    
    setDisplayCandies(newDisplayCandies);
  };

  const handleDispense = () => {
    if (isDispensing || candyCounts.eclairs <= 0) return;
    
    setIsDispensing(true);
    playSound('button');
    
    setCandyCounts(prev => ({
      ...prev,
      eclairs: prev.eclairs - 1
    }));
    
    setStockLevels(prev => ({
      ...prev,
      vendingMachine: {
        ...prev.vendingMachine,
        eclairs: prev.vendingMachine.eclairs - 1
      }
    }));
    
    setDisplayCandies(prev => ({
      ...prev,
      eclairs: generateDisplayCandies(candyCounts.eclairs - 1, 'eclairs')
    }));
    
    setTimeout(() => {
      const trayWidth = trayRef.current?.offsetWidth || 300;
      const trayHeight = trayRef.current?.offsetHeight || 120;
      
      const newCandy = createEclairsCandy(trayWidth - 40, trayHeight / 2 - 20);
      
      setCollectedCandies(prev => [...prev, newCandy]);
      playSound('drop');
      
      setIsDispensing(false);
    }, 300);
  };

  const handleRefillAll = () => {
    if (isDispensing) return;
    
    const canRefill = Object.keys(candyCounts).every(
      type => stockLevels.floorManager[type as CandyTypeEnum] >= (CANDY_DETAILS[type as CandyTypeEnum].defaultCount - candyCounts[type as CandyTypeEnum])
    );
    
    if (!canRefill) {
      toast.error("Floor manager doesn't have enough stock for complete refill");
      return;
    }
    
    playSound('button');
    toast.success("All compartments refilled!");
    
    const stockNeeded: Record<CandyTypeEnum, number> = {} as Record<CandyTypeEnum, number>;
    Object.keys(candyCounts).forEach(type => {
      const candyType = type as CandyTypeEnum;
      stockNeeded[candyType] = CANDY_DETAILS[candyType].defaultCount - candyCounts[candyType];
    });
    
    setStockLevels(prev => {
      const newFloorManagerStock = { ...prev.floorManager };
      Object.keys(stockNeeded).forEach(type => {
        const candyType = type as CandyTypeEnum;
        newFloorManagerStock[candyType] -= stockNeeded[candyType];
      });
      
      return {
        ...prev,
        floorManager: newFloorManagerStock,
        vendingMachine: {
          fivestar: CANDY_DETAILS.fivestar.defaultCount,
          milkybar: CANDY_DETAILS.milkybar.defaultCount,
          dairymilk: CANDY_DETAILS.dairymilk.defaultCount,
          eclairs: CANDY_DETAILS.eclairs.defaultCount,
          ferrero: CANDY_DETAILS.ferrero.defaultCount
        }
      };
    });
    
    setCandyCounts({
      fivestar: CANDY_DETAILS.fivestar.defaultCount,
      milkybar: CANDY_DETAILS.milkybar.defaultCount,
      dairymilk: CANDY_DETAILS.dairymilk.defaultCount,
      eclairs: CANDY_DETAILS.eclairs.defaultCount,
      ferrero: CANDY_DETAILS.ferrero.defaultCount
    });
    
    const newDisplayCandies: Record<CandyTypeEnum, CandyType[]> = {
      fivestar: generateDisplayCandies(CANDY_DETAILS.fivestar.defaultCount, 'fivestar'),
      milkybar: generateDisplayCandies(CANDY_DETAILS.milkybar.defaultCount, 'milkybar'),
      dairymilk: generateDisplayCandies(CANDY_DETAILS.dairymilk.defaultCount, 'dairymilk'),
      eclairs: generateDisplayCandies(CANDY_DETAILS.eclairs.defaultCount, 'eclairs'),
      ferrero: generateDisplayCandies(CANDY_DETAILS.ferrero.defaultCount, 'ferrero')
    };
    
    setDisplayCandies(newDisplayCandies);
  };

  const handleRefillCompartment = (type: CandyTypeEnum) => {
    if (isDispensing) return;
    
    const currentCount = candyCounts[type];
    const maxCount = CANDY_DETAILS[type].defaultCount;
    
    if (currentCount >= maxCount) {
      toast.error(`${CANDY_DETAILS[type].name} compartment is already full!`);
      return;
    }
    
    const refillAmount = Math.min(refillCount, maxCount - currentCount);
    
    if (stockLevels.floorManager[type] < refillAmount) {
      toast.error(`Floor manager doesn't have enough ${CANDY_DETAILS[type].name} stock!`);
      return;
    }
    
    playSound('button');
    
    const newCount = currentCount + refillAmount;
    
    setCandyCounts(prev => ({
      ...prev,
      [type]: newCount
    }));
    
    setStockLevels(prev => ({
      ...prev,
      floorManager: {
        ...prev.floorManager,
        [type]: prev.floorManager[type] - refillAmount
      },
      vendingMachine: {
        ...prev.vendingMachine,
        [type]: newCount
      }
    }));
    
    toast.success(`${CANDY_DETAILS[type].name} compartment refilled to ${newCount}!`);
    
    setDisplayCandies(prev => ({
      ...prev,
      [type]: generateDisplayCandies(newCount, type)
    }));
  };

  const handleVendorRefill = (type: CandyTypeEnum, amount: number) => {
    if (stockLevels.vendor[type] < amount) {
      toast.error(`Vendor doesn't have enough ${CANDY_DETAILS[type].name} stock!`);
      return;
    }
    
    setStockLevels(prev => ({
      ...prev,
      vendor: {
        ...prev.vendor,
        [type]: prev.vendor[type] - amount
      },
      floorManager: {
        ...prev.floorManager,
        [type]: prev.floorManager[type] + amount
      }
    }));
    
    toast.success(`Floor manager received ${amount} ${CANDY_DETAILS[type].name} from vendor!`);
  };

  const handleCollectAll = () => {
    if (collectedCandies.length === 0) return;
    
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
    
    toast.success(`Collected ${collectedCandies.length} candies!`);
    
    setCollectedCandies([]);
  };

  const handleWinDrop = () => {
    if (isDispensing) return;
    
    const userScore = parseInt(scoreInputRef.current?.value || "0", 10);
    if (isNaN(userScore) || userScore <= 0) {
      toast.error("Please enter a valid score!");
      return;
    }
    
    setIsDispensing(true);
    playSound('button');
    
    const candyCount = getCandyCountForScore(userScore);
    const trayWidth = trayRef.current?.offsetWidth || 300;
    const trayHeight = trayRef.current?.offsetHeight || 120;
    
    setScore(prevScore => prevScore + userScore);
    
    let droppedCount = 0;
    let remainingTypes: CandyTypeEnum[] = (Object.keys(candyCounts) as CandyTypeEnum[]).filter(
      type => candyCounts[type] > 0
    );
    
    if (remainingTypes.length === 0) {
      setIsDispensing(false);
      toast.error("No candies left to dispense!");
      return;
    }
    
    toast.success(`Dropping ${candyCount} candies based on score: ${userScore}!`);
    
    const dropInterval = setInterval(() => {
      if (droppedCount >= candyCount || remainingTypes.length === 0) {
        clearInterval(dropInterval);
        setIsDispensing(false);
        return;
      }
      
      const randomTypeIndex = Math.floor(Math.random() * remainingTypes.length);
      const selectedType = remainingTypes[randomTypeIndex];
      
      if (candyCounts[selectedType] <= 0) {
        remainingTypes = remainingTypes.filter(type => type !== selectedType);
        return;
      }
      
      setCandyCounts(prev => ({
        ...prev,
        [selectedType]: prev[selectedType] - 1
      }));
      
      setStockLevels(prev => ({
        ...prev,
        vendingMachine: {
          ...prev.vendingMachine,
          [selectedType]: prev.vendingMachine[selectedType] - 1
        }
      }));
      
      setDisplayCandies(prev => ({
        ...prev,
        [selectedType]: generateDisplayCandies(candyCounts[selectedType] - 1, selectedType)
      }));
      
      const newCandy = createCandy(selectedType, trayWidth - 40, trayHeight / 2 - 20);
      
      setCollectedCandies(prev => [...prev, newCandy]);
      playSound('drop');
      
      droppedCount++;
    }, 200);
  };

  const handleEatCandy = (id: string) => {
    const eatenCandy = collectedCandies.find(candy => candy.id === id);
    
    if (eatenCandy) {
      const candyScore = CANDY_DETAILS[eatenCandy.type].baseScore;
      
      const historyItem: HistoryItem = {
        id: eatenCandy.id,
        type: eatenCandy.type,
        timestamp: new Date(),
        score: candyScore
      };
      
      setHistory(prev => [historyItem, ...prev]);
      toast.success(`Enjoyed a ${CANDY_DETAILS[eatenCandy.type].name}! +${candyScore} points`);
      
      setCollectedCandies(prev => prev.filter(candy => candy.id !== id));
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 p-2 md:p-4">
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl bg-gradient-to-b from-gray-300 to-gray-400 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-500 relative"
          style={{
            transform: "perspective(1000px) rotateX(5deg)",
            transformStyle: "preserve-3d"
          }}
        >
          <div className="absolute top-4 right-4 z-30">
            <Sheet>
              <SheetTrigger asChild>
                <button className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full shadow-lg transition-all">
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-center text-xl font-bold">Stock Management</SheetTitle>
                  <SheetDescription className="text-center">
                    Monitor and manage inventory levels
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6">
                  <Tabs defaultValue="machine" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="machine" className="flex items-center gap-2">
                        <Store size={16} />
                        <span>Machine Stock</span>
                      </TabsTrigger>
                      <TabsTrigger value="floor" className="flex items-center gap-2">
                        <User size={16} />
                        <span>Floor Stock</span>
                      </TabsTrigger>
                      <TabsTrigger value="vendor" className="flex items-center gap-2">
                        <Truck size={16} />
                        <span>Vendor Stock</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="machine" className="space-y-4 mt-4">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4">Vending Machine Inventory</h3>
                        <div className="space-y-3">
                          {Object.entries(stockLevels.vendingMachine).map(([type, count]) => (
                            <div key={`machine-${type}`} className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 flex items-center justify-center">
                                  <Candy 
                                    candy={{id: `stock-${type}`, type: type as CandyTypeEnum, x: 0, y: 0, rotation: 0}}
                                    onEat={() => {}}
                                    isDisplayOnly={true}
                                    containerWidth={50}
                                    containerHeight={30}
                                  />
                                </div>
                                <span className="font-medium">{CANDY_DETAILS[type as CandyTypeEnum].name}</span>
                              </div>
                              <div className="flex items-center">
                                <span className={`px-3 py-1 rounded ${count < 3 ? 'bg-red-100 text-red-800' : count < 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                  {count}/{CANDY_DETAILS[type as CandyTypeEnum].defaultCount}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="floor" className="space-y-4 mt-4">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4">Floor Manager Inventory</h3>
                        <div className="space-y-3">
                          {Object.entries(stockLevels.floorManager).map(([type, count]) => (
                            <div key={`floor-${type}`} className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 flex items-center justify-center">
                                  <Candy 
                                    candy={{id: `floor-${type}`, type: type as CandyTypeEnum, x: 0, y: 0, rotation: 0}}
                                    onEat={() => {}}
                                    isDisplayOnly={true}
                                    containerWidth={50}
                                    containerHeight={30}
                                  />
                                </div>
                                <span className="font-medium">{CANDY_DETAILS[type as CandyTypeEnum].name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded ${count < 5 ? 'bg-red-100 text-red-800' : count < 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                  {count}
                                </span>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded">
                                      Request
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Request Stock from Vendor</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        How many {CANDY_DETAILS[type as CandyTypeEnum].name} would you like to request?
                                        <Input 
                                          type="number" 
                                          min="1" 
                                          max="20" 
                                          defaultValue="10"
                                          className="mt-2" 
                                          id={`request-${type}`}
                                        />
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => {
                                        const input = document.getElementById(`request-${type}`) as HTMLInputElement;
                                        const amount = parseInt(input.value);
                                        if (!isNaN(amount) && amount > 0) {
                                          handleVendorRefill(type as CandyTypeEnum, amount);
                                        }
                                      }}>Request</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="vendor" className="space-y-4 mt-4">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4">Vendor Warehouse Inventory</h3>
                        <div className="space-y-3">
                          {Object.entries(stockLevels.vendor).map(([type, count]) => (
                            <div key={`vendor-${type}`} className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 flex items-center justify-center">
                                  <Candy 
                                    candy={{id: `vendor-${type}`, type: type as CandyTypeEnum, x: 0, y: 0, rotation: 0}}
                                    onEat={() => {}}
                                    isDisplayOnly={true}
                                    containerWidth={50}
                                    containerHeight={30}
                                  />
                                </div>
                                <span className="font-medium">{CANDY_DETAILS[type as CandyTypeEnum].name}</span>
                              </div>
                              <div className="flex items-center">
                                <span className={`px-3 py-1 rounded ${count < 20 ? 'bg-red-100 text-red-800' : count < 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                  {count}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <SheetFooter>
                  <SheetClose asChild>
                    <Button 
                      className="w-full"
                      onClick={() => {}}
                    >
                      Close
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-md border-b-4 border-gray-600">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-md tracking-wider">CANDY HUB</h1>
            <p className="text-sm text-center text-gray-100">Premium Candy Vending</p>
          </div>
          
          <div className="relative p-4 md:p-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-xl">
            
            <div className="flex flex-row h-[600px] gap-4">
              <div className="w-2/5 flex flex-col gap-2 h-full">
                <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300 flex-1">
                  <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                    A1: 5 Star ({candyCounts.fivestar})
                  </div>
                  <div className="flex flex-wrap justify-center items-center h-full">
                    {displayCandies.fivestar.slice(0, 5).map((candy, index) => (
                      <div key={`display-fivestar-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                        <Candy 
                          candy={candy}
                          onEat={() => {}}
                          isDisplayOnly={true}
                          containerWidth={90}
                          containerHeight={60}
                        />
                      </div>
                    ))}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="absolute right-2 bottom-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md">
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
                            max="10" 
                            className="mt-2" 
                            value={refillCount}
                            onChange={(e) => setRefillCount(Number(e.target.value))}
                          />
                          <div className="mt-2 text-sm">
                            Current: {candyCounts.fivestar} / {CANDY_DETAILS.fivestar.defaultCount}
                          </div>
                          <div className="mt-1 text-sm">
                            Floor Stock: {stockLevels.floorManager.fivestar}
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
                
                <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300 flex-1">
                  <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                    A2: Milkybar ({candyCounts.milkybar})
                  </div>
                  <div className="flex flex-wrap justify-center items-center h-full">
                    {displayCandies.milkybar.slice(0, 5).map((candy, index) => (
                      <div key={`display-milkybar-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                        <Candy 
                          candy={candy}
                          onEat={() => {}}
                          isDisplayOnly={true}
                          containerWidth={90}
                          containerHeight={60}
                        />
                      </div>
                    ))}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="absolute right-2 bottom-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md">
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
                            max="10" 
                            className="mt-2" 
                            value={refillCount}
                            onChange={(e) => setRefillCount(Number(e.target.value))}
                          />
                          <div className="mt-2 text-sm">
                            Current: {candyCounts.milkybar} / {CANDY_DETAILS.milkybar.defaultCount}
                          </div>
                          <div className="mt-1 text-sm">
                            Floor Stock: {stockLevels.floorManager.milkybar}
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
                
                <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300 flex-1">
                  <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                    A3: Dairy Milk ({candyCounts.dairymilk})
                  </div>
                  <div className="flex flex-wrap justify-center items-center h-full">
                    {displayCandies.dairymilk.slice(0, 5).map((candy, index) => (
                      <div key={`display-dairymilk-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                        <Candy 
                          candy={candy}
                          onEat={() => {}}
                          isDisplayOnly={true}
                          containerWidth={90}
                          containerHeight={60}
                        />
                      </div>
                    ))}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="absolute right-2 bottom-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md">
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
                            max="10" 
                            className="mt-2" 
                            value={refillCount}
                            onChange={(e) => setRefillCount(Number(e.target.value))}
                          />
                          <div className="mt-2 text-sm">
                            Current: {candyCounts.dairymilk} / {CANDY_DETAILS.dairymilk.defaultCount}
                          </div>
                          <div className="mt-1 text-sm">
                            Floor Stock: {stockLevels.floorManager.dairymilk}
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
                
                <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300 flex-1">
                  <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                    A4: Eclairs ({candyCounts.eclairs})
                  </div>
                  <div className="flex flex-wrap justify-center items-center h-full">
                    {displayCandies.eclairs.slice(0, 5).map((candy, index) => (
                      <div key={`display-eclairs-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
                        <Candy 
                          candy={candy}
                          onEat={() => {}}
                          isDisplayOnly={true}
                          containerWidth={90}
                          containerHeight={60}
                        />
                      </div>
                    ))}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="absolute right-2 bottom-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md">
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
