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
  calculateTotalScore,
  getRandomCandyTypeExcluding
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
  const [score, setScore] = useState(0);
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




  const [email, setEmail] = useState("");
  const [showFrame, setShowFrame] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://hackai.service-now.com/api/snc/candyauthenticator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie:
              "BIGipServerpool_hackai=c4a53b71e722863906d11e0d6380e527; JSESSIONID=C6E94718F99E49F0FD32C9F243D0F038; glide_node_id_for_js=bc3e6ce5848075e1326798b0a2a05f7cb0f8e60809cf43ad618319fb4009edab; glide_user_route=glide.f0de4775f7e89ad60bb51e4d6c3d0ba6",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const sysId = data.result?.sys_id;

      if (sysId) {
        const updatedUrl = `https://hackai.service-now.com/now/candy_dispenser/user-details/user_details/${sysId}`;
        setIframeUrl(updatedUrl);
        setShowFrame(true);
        setErrorMessage("");
        startPolling(email);
      } else {
        setErrorMessage("Failed to connect. Please try again.");
        setShowFrame(false);
      }
    } catch (error) {
      console.error("API error:", error);
      setErrorMessage("Failed to connect. Please try again.");
      setShowFrame(false);
    }
  };

  const [polling, setPolling] = useState(false);
  const [scoreFound, setScoreFound] = useState(false);

  const startPolling = (email) => {
    setPolling(true);

    const pollInterval = setInterval(async () => {
      try {
        const pollResponse = await fetch(
          `https://hackai.service-now.com/api/snc/candyauthenticator?email=${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie:
                "BIGipServerpool_hackai=c4a53b71e722863906d11e0d6380e527; JSESSIONID=C6E94718F99E49F0FD32C9F243D0F038; glide_node_id_for_js=bc3e6ce5848075e1326798b0a2a05f7cb0f8e60809cf43ad618319fb4009edab; glide_user_route=glide.f0de4775f7e89ad60bb51e4d6c3d0ba6",
            },
          }
        );

        if (!pollResponse.ok) {
          throw new Error("Polling API request failed");
        }

        const pollData = await pollResponse.json();
        const newScore = pollData.result?.score;

        if (newScore && newScore !== "") {
          clearInterval(pollInterval);
          setScoreFound(true);
          setShowFrame(true);
          setScore(newScore)
          handleWinDrop(newScore)
          console.log("Score received:", score);
        }
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(pollInterval);
        setErrorMessage("Polling failed. Try again.");
      }
    }, 3000); // Poll every 3 seconds
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

  const handleWinDrop = (score) => {
    console.log("handling win drop");
    if (isDispensing) return;

    const userScore = score;
    if (isNaN(userScore) || userScore <= 0) {
      handleDispense();
      return;
    }

    setIsDispensing(true);
    playSound('button');

    const candyCount = getCandyCountForScore(userScore);
    const trayWidth = trayRef.current?.offsetWidth || 300;
    const trayHeight = trayRef.current?.offsetHeight || 120;

    let droppedEclairsCount = 0;
    let droppedOtherCount = 0;
    let usedCandyTypes: CandyTypeEnum[] = ['eclairs'];

    // Check if there are enough eclairs
    if (candyCount.eclairs > candyCounts.eclairs) {
      setIsDispensing(false);
      toast.error("Not enough Eclairs to dispense!");
      return;
    }

    toast.success(`Dropping candies based on score: ${userScore}!`);

    const dropInterval = setInterval(() => {
      // First dispense all eclairs
      if (droppedEclairsCount < candyCount.eclairs && candyCounts.eclairs > 0) {
        if (candyCounts.eclairs <= 0) {
          // If no eclairs remaining, move to other candies
          droppedEclairsCount = candyCount.eclairs;
        } else {
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
            eclairs: generateDisplayCandies(candyCounts.eclairs - droppedEclairsCount - 1, 'eclairs')
          }));

          const newCandy = createCandy('eclairs', trayWidth - 40, trayHeight / 2 - 20);
          setCollectedCandies(prev => [...prev, newCandy]);
          playSound('drop');
          droppedEclairsCount++;
        }
      } 
      // Then dispense other candy types
      else if (droppedOtherCount < candyCount.otherCandy) {
        // Select a random candy type excluding already used types
        const randomType = getRandomCandyTypeExcluding(usedCandyTypes as CandyTypeEnum[]);
        
        // If no available types or all compartments are empty, stop dispensing
        if (!randomType || Object.values(candyCounts).every(count => count <= 0)) {
          clearInterval(dropInterval);
          setIsDispensing(false);
          return;
        }

        // Check if we have this candy type in stock
        if (candyCounts[randomType] <= 0) {
          // Try again in the next interval
          return;
        }

        // Add this type to used types so we don't dispense it again
        usedCandyTypes.push(randomType as CandyTypeEnum);
        
        setCandyCounts(prev => ({
          ...prev,
          [randomType]: prev[randomType] - 1
        }));

        setStockLevels(prev => ({
          ...prev,
          vendingMachine: {
            ...prev.vendingMachine,
            [randomType]: prev.vendingMachine[randomType] - 1
          }
        }));

        setDisplayCandies(prev => ({
          ...prev,
          [randomType]: generateDisplayCandies(candyCounts[randomType] - 1, randomType as CandyTypeEnum)
        }));

        const newCandy = createCandy(randomType as CandyTypeEnum, trayWidth - 40, trayHeight / 2 - 20);
        setCollectedCandies(prev => [...prev, newCandy]);
        playSound('drop');
        droppedOtherCount++;
      } 
      // If we're done dispensing all candies, clear the interval
      else {
        clearInterval(dropInterval);
        setIsDispensing(false);
      }
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

  // Calculate the total score for the history panel
  const totalScore = calculateTotalScore(history);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 p-2 md:p-4">
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-3xl bg-gradient-to-b from-gray-300 to-gray-400 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-500 relative"
          style={{
            transform: "perspective(1000px) rotateX(5deg)",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Sheet for stock management */}
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

                {/* Stock management tabs */}
                <StockManagement 
                  stockLevels={stockLevels} 
                  onVendorRefill={handleVendorRefill} 
                />

                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      className="w-full"
                      onClick={() => { }}
                    >
                      Close
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Title header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-md border-b-4 border-gray-600">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-md tracking-wider">CANDY HUB</h1>
            <p className="text-sm text-center text-gray-100">Premium Candy Vending</p>
          </div>

          {/* Main machine display */}
          <div className="relative p-4 md:p-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-xl">
            {/* Display window for candy slots */}
            <div
              ref={displayWindowRef}
              className="display-window relative h-50 rounded-t-lg mb-4 overflow-hidden border-8 border-b-0 border-gray-600 shadow-inner bg-gradient-to-b from-gray-100 to-gray-200"
              style={{
                borderRadius: "12px 12px 0 0",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)"
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-12 bg-white opacity-20 transform skew-y-3"></div>

              <div className="grid grid-cols-3 gap-3 p-3 h-full">
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
                          onEat={() => { }}
                          isDisplayOnly={true}
                          containerWidth={100}
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
                          onEat={() => { }}
                          isDisplayOnly={true}
                          containerWidth={100}
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
                          onEat={() => { }}
                          isDisplayOnly={true}
                          containerWidth={100}
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
              </div>
            </div>

            {/* Score input */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-inner">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full">
                  <label htmlFor="score-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Score:
                  </label>
                  <Input
                    id="score-input"
                    ref={scoreInputRef}
                    type="number"
                    min="0"
                    placeholder="Enter score to dispense candy"
                    className="w-full"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                  />
                </div>
                <Button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
                  onClick={() => handleWinDrop(score)}
                  disabled={isDispensing}
                >
                  <Zap size={16} />
                  Dispense by Score
                </Button>
                <Button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleRefillAll}
                  disabled={isDispensing}
                >
                  <PackagePlus size={16} />
                  Refill All
                </Button>
              </div>
            </div>

            {/* Candy tray */}
            <div 
              ref={trayRef} 
              className="candy-tray relative bg-gray-100 h-32 rounded-lg border-8 border-t-0 border-gray-600 overflow-hidden shadow-inner"
              style={{
                borderRadius: "0 0 12px 12px",
                boxShadow: "inset 0 4px 10px rgba(0,0,0,0.1)"
              }}
            >
              <div className="absolute top-0 left-0 right-0 bg-gray-700 h-3"></div>
              
              {/* Dispense button */}
              <button
                onClick={handleDispense}
                disabled={isDispensing || candyCounts.eclairs <= 0}
                className={`absolute right-4 top-4 px-4 py-2 rounded-full flex items-center gap-2 transition ${
                  isDispensing
