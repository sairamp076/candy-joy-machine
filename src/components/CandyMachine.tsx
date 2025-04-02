import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Candy from './Candy';
import HistoryPanel from './HistoryPanel';
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
  getCompleteStock,
  getMachineStockForFloor,
  updateMachineStock,
  API_FIELD_MAPPING,
  getMachineStockForFloorNew
} from '@/utils/candyUtils';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import {
  ShoppingCart,
  RefreshCw,
  Zap,
  ChevronDown,
  Candy as CandyIcon
} from 'lucide-react';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const CandyMachine = () => {
  const [candyCounts, setCandyCounts] = useState<Record<CandyTypeEnum, number>>({
    fivestar: CANDY_DETAILS.fivestar.defaultCount,
    milkybar: CANDY_DETAILS.milkybar.defaultCount,
    dairymilk: CANDY_DETAILS.dairymilk.defaultCount,
    eclairs: CANDY_DETAILS.eclairs.defaultCount,
    ferrero: CANDY_DETAILS.ferrero.defaultCount
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
  const [selectedFloor, setSelectedFloor] = useState<string>("2");
  const [isLoadingStock, setIsLoadingStock] = useState<boolean>(false);
  const [completeStockData, setCompleteStockData] = useState(null);

  const displayWindowRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  const scoreInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  useEffect(() => {
    if (selectedFloor) {
      fetchFloorStockData();
    }
  }, [selectedFloor]);

  const fetchStockData = async () => {
    setIsLoadingStock(true);
    try {
      await fetchFloorStockData();
    } catch (error) {
      console.error("Error fetching stock data:", error);
      toast.error("Failed to fetch stock data");
    } finally {
      setIsLoadingStock(false);
    }
  };

  const fetchFloorStockData = async () => {
    setIsLoadingStock(true);
    try {
      const stockData = await getMachineStockForFloorNew(selectedFloor);
      
      if (stockData) {
        setCandyCounts(stockData);
        
        const newDisplayCandies: Record<CandyTypeEnum, CandyType[]> = {
          fivestar: generateDisplayCandies(stockData.fivestar, 'fivestar'),
          milkybar: generateDisplayCandies(stockData.milkybar, 'milkybar'),
          dairymilk: generateDisplayCandies(stockData.dairymilk, 'dairymilk'),
          eclairs: generateDisplayCandies(stockData.eclairs, 'eclairs'),
          ferrero: generateDisplayCandies(stockData.ferrero, 'ferrero')
        };
        
        setDisplayCandies(newDisplayCandies);
      } else {
        toast.error(`Failed to fetch stock data for floor ${selectedFloor}`);
        initializeCandies();
      }
    } catch (error) {
      console.error("Error fetching floor stock data:", error);
      toast.error(`Failed to fetch stock data for floor ${selectedFloor}`);
      initializeCandies();
    } finally {
      setIsLoadingStock(false);
    }
  };

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

  const handleDispense = async () => {
    if (isDispensing || candyCounts.eclairs <= 0) return;

    setIsDispensing(true);
    playSound('button');

    const newEclairsCount = candyCounts.eclairs - 1;
    
    setCandyCounts(prev => ({
      ...prev,
      eclairs: newEclairsCount
    }));

    setDisplayCandies(prev => ({
      ...prev,
      eclairs: generateDisplayCandies(newEclairsCount, 'eclairs')
    }));

    const floor = parseInt(selectedFloor, 10);
    await updateMachineStock(floor, API_FIELD_MAPPING.eclairs, newEclairsCount);

    setTimeout(() => {
      const trayWidth = trayRef.current?.offsetWidth || 300;
      const trayHeight = trayRef.current?.offsetHeight || 120;

      const newCandy = createEclairsCandy(trayWidth - 40, trayHeight / 2 - 20);

      setCollectedCandies(prev => [...prev, newCandy]);
      playSound('drop');

      setIsDispensing(false);
    }, 300);
  };

  const handleCollectAll = () => {
    if (collectedCandies.length === 0) return;

    const totalScore = collectedCandies.reduce((total, candy) => {
      return total + CANDY_DETAILS[candy.type].baseScore;
    }, 0);

    const collectedItems = [...collectedCandies];
    
    collectedItems.forEach(candy => {
      const historyItem: HistoryItem = {
        id: candy.id,
        type: candy.type,
        timestamp: new Date(),
        score: CANDY_DETAILS[candy.type].baseScore
      };
      setHistory(prev => [historyItem, ...prev]);
    });
    
    setCollectedCandies([]);
    
    toast.success(`Collected all candies! +${totalScore} points`);
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

  const handleWinDrop = (score) => {
    console.log("handling win drop"+score);
    if (isDispensing) return;

    const userScore = Number(score);
    if (isNaN(userScore) || userScore <= 0) {
      toast.error("Sorry Better Luck Next Time!");
      return;
    }

    setIsDispensing(true);
    playSound('button');

    const candyCount = getCandyCountForScore(userScore);
    const trayWidth = trayRef.current?.offsetWidth || 300;
    const trayHeight = trayRef.current?.offsetHeight || 120;

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

    const updatedCandyCounts = {...candyCounts};
    
    const dropInterval = setInterval(() => {
      if (droppedCount >= candyCount || remainingTypes.length === 0) {
        clearInterval(dropInterval);
        setIsDispensing(false);
        
        const floor = parseInt(selectedFloor, 10);
        Object.keys(updatedCandyCounts).forEach(type => {
          const candyType = type as CandyTypeEnum;
          if (updatedCandyCounts[candyType] !== candyCounts[candyType]) {
            const apiField = API_FIELD_MAPPING[candyType];
            updateMachineStock(floor, apiField, updatedCandyCounts[candyType]);
          }
        });
        
        return;
      }

      const randomTypeIndex = Math.floor(Math.random() * remainingTypes.length);
      const selectedType = remainingTypes[randomTypeIndex];

      if (updatedCandyCounts[selectedType] <= 0) {
        remainingTypes = remainingTypes.filter(type => type !== selectedType);
        return;
      }

      updatedCandyCounts[selectedType] -= 1;
      
      setCandyCounts(prev => ({
        ...prev,
        [selectedType]: updatedCandyCounts[selectedType]
      }));

      setDisplayCandies(prev => ({
        ...prev,
        [selectedType]: generateDisplayCandies(updatedCandyCounts[selectedType], selectedType)
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
      <div className="w-full max-w-xl mx-auto mb-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-gray-700 font-medium">Floor:</span>
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
              <SelectItem value="3">Floor 3</SelectItem>
            </SelectContent>
          </Select>
          <button 
            onClick={fetchStockData} 
            className="ml-2 p-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            disabled={isLoadingStock}
          >
            <RefreshCw size={16} className={isLoadingStock ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

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
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-md border-b-4 border-gray-600">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-md tracking-wider">CANDY HUB</h1>
            <p className="text-sm text-center text-gray-100">Premium Candy Vending</p>
          </div>

          <div className="relative p-4 md:p-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-xl">

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
                </div>

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
                </div>

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
                </div>
              </div>
            </div>
            
            <div className="relative mx-auto w-full h-80 bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-8 border-gray-700 transform perspective-1000 rotate-x-6 rotate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-700 via-gray-800 to-black opacity-80 pointer-events-none rounded-xl"></div>
              <div className="absolute inset-1 bg-black rounded-lg border-2 border-gray-600 shadow-inner"></div>
              <div className="absolute inset-1.5 bg-white rounded-sm overflow-hidden shadow-lg">
                {!showFrame ? (
                  <div className="flex flex-col items-center justify-center h-full bg-gray-800">
                    <h2 className="text-lg font-semibold text-white mb-4">
                      Get Started
                    </h2>

                    {errorMessage && (
                      <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}

                    <form onSubmit={handleSubmit} className="w-4/5 space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition duration-200"
                      >
                        Get Started
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="w-full h-full overflow-hidden">
                    <iframe
                      src={iframeUrl}
                      className="w-full h-full"
                      style={{
                        transform: "scale(0.75)",
                        transformOrigin: "top left",
                        width: "133.33%",
                        height: "133.33%",
                        border: "none",
                        overflow: "hidden",
                      }}
                      sandbox="allow-scripts allow-same-origin"
                    ></iframe>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                {showFrame?<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>:<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                {showFrame?(<span className="text-[10px] text-green-500">ACTIVE</span>):(<span className="text-[10px] text-red-500">Not Connected</span>)}
              </div>
            </div>

            <div
              className="display-window relative h-40 rounded-b-lg mt-4 overflow-hidden border-8 border-t-0 border-gray-600 shadow-inner bg-gradient-to-b from-gray-100 to-gray-200"
              style={{
                borderRadius: "0 0 12px 12px",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)"
              }}
            >
              <div className="grid grid-cols-2 gap-3 p-3 h-full">
                <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                  <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                    A4: Eclairs ({candyCounts.eclairs})
                  </div>
                  <div className="flex flex-wrap justify-center items-center h-full">
                    {displayCandies.eclairs.map((candy, index) => (
                      <div key={`display-eclairs-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
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
                </div>

                <div className="candy-compartment relative bg-black bg-opacity-5 rounded p-2 border border-gray-300">
                  <div className="absolute left-2 top-2 z-10 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs font-semibold">
                    A5: Ferrero ({candyCounts.ferrero})
                  </div>
                  <div className="flex flex-wrap justify-center items-center h-full">
                    {displayCandies.ferrero.map((candy, index) => (
                      <div key={`display-ferrero-${index}`} className="m-1" style={{ transform: `rotate(${index * 15}deg)` }}>
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
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-3/4 h-8 bg-gray-700 rounded-t-lg mb-0 mt-4 flex justify-center items-center">
              <div className="w-20 h-1 bg-black"></div>
              {isDispensing && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="animate-bounce w-4 h-4 bg-amber-400 rounded-full opacity-75"></div>
                </div>
              )}
            </div>

            <div className="relative mx-auto w-3/4 perspective">
              <div
                ref={trayRef}
                className="collector-tray relative h-24 rounded-b-xl overflow-hidden border-4 border-t-0 border-gray-700 bg-gray-800 shadow-inner"
                style={{
                  borderBottomRightRadius: "30px",
                  borderBottomLeftRadius: "30px",
                  boxShadow: "inset 0 5px 15px rgba(0,0,0,0.3)"
                }}
              >
                <div className="absolute top-1 left-2 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                  Collection Tray
                </div>

                <button
                  onClick={handleCollectAll}
                  className="absolute top-1 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full hover:bg-green-600 transition-colors flex items-center gap-1 z-20 shadow-md"
                  disabled={collectedCandies.length === 0}
                >
                  <ShoppingCart size={12} />
                  Collect All
                </button>

                <div className="relative h-full w-full">
                  <AnimatePresence>
                    {collectedCandies.map(candy => (
                      <motion.div
                        key={candy.id}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Candy
                          key={candy.id}
                          candy={candy}
                          onEat={handleEatCandy}
                          containerWidth={trayRef.current?.offsetWidth || 300}
                          containerHeight={trayRef.current?.offsetHeight || 80}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-400 to-transparent opacity-30"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-400 to-transparent opacity-30"></div>
              <div className="absolute left-8 right-8 top-0 h-8 bg-gradient-to-b from-gray-400 to-transparent opacity-30"></div>
              <div className="absolute left-8 right-8 bottom-0 h-8 bg-gradient-to-t from-gray-400 to-transparent opacity-30"></div>
            </div>
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-500 to-gray-300 opacity-80 rounded-l-3xl"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-500 to-gray-300 opacity-80 rounded-r-3xl"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full lg:w-80 space-y-6"
        >
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Your Score</h2>
            <div className="text-4xl font-bold text-blue-600">{score}</div>
          </div>

          <div className="bg-gray-800 p-4 rounded-md shadow-inner">
            <div className="mb-3 flex justify-between items-center">
              <div className="text-sm text-white font-semibold flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                OPERATION
              </div>
            </div>

            <Button
              onClick={handleDispense}
              className="w-full mb-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-2 border-green-700 shadow-lg flex items-center justify-center gap-2"
              disabled={isDispensing || candyCounts.eclairs <= 0}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Candy
                  candy={{ id: 'eclairs-button', type: 'eclairs', x: 0, y: 0, rotation: 0 }}
                  onEat={() => { }}
                  isDisplayOnly={true}
                  containerWidth={30}
                  containerHeight={20}
                />
              </div>
              Dispense Eclairs
            </Button>
          </div>

          <HistoryPanel history={history} />
        </motion.div>
      </div>
    </div>
  );
};

export default CandyMachine;
