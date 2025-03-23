
import React from 'react';
import { Candy as CandyType, playSound } from '@/utils/candyUtils';
import { cn } from '@/lib/utils';

interface CandyProps {
  candy: CandyType;
  onEat: (id: string) => void;
  isNew?: boolean;
  isDisplayOnly?: boolean;
  containerWidth: number;
  containerHeight: number;
}

const Candy = ({ 
  candy, 
  onEat, 
  isNew = false, 
  isDisplayOnly = false, 
  containerWidth, 
  containerHeight 
}: CandyProps) => {
  
  const handleEat = () => {
    if (!isDisplayOnly) {
      playSound('eat');
      onEat(candy.id);
    }
  };
  
  // Define candy shapes based on type
  const getCandyShape = () => {
    switch (candy.type) {
      case 'fivestar':
        return (
          <div className="w-full h-full flex items-center justify-center perspective">
            <div className="candy-wrapper w-16 h-5 relative">
              <div className="w-16 h-5 bg-yellow-600 rounded-sm shadow-lg relative flex items-center justify-center transform-gpu border-2 border-yellow-900">
                <span className="text-[10px] font-bold text-yellow-900 z-10">5★</span>
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-sm"></div>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-yellow-400"></div>
              </div>
            </div>
          </div>
        );
      case 'milkybar':
        return (
          <div className="w-full h-full flex items-center justify-center perspective">
            <div className="candy-wrapper w-14 h-5 relative">
              <div className="w-14 h-5 bg-amber-50 rounded-sm shadow-lg relative border-2 border-amber-200">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-amber-100 rounded-sm"></div>
                <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-amber-100"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-amber-800">MILKYBAR</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'dairymilk':
        return (
          <div className="w-full h-full flex items-center justify-center perspective">
            <div className="candy-wrapper w-14 h-7 relative">
              <div className="w-14 h-7 bg-purple-900 rounded-sm shadow-lg grid grid-cols-2 grid-rows-2 gap-[1px] p-[1px] border-2 border-purple-950">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-purple-800 border-t border-l border-purple-700 border-opacity-30"></div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-800 to-purple-900 opacity-70 rounded-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-purple-100">DAIRY MILK</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'eclairs':
        return (
          <div className="w-full h-full flex items-center justify-center perspective">
            <div className="candy-wrapper relative">
              <div className="w-16 h-6 bg-amber-400 rounded-full shadow-lg relative flex items-center justify-center overflow-hidden border-2 border-amber-800">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-500 opacity-80"></div>
                
                {/* Candy wrapper twist ends */}
                <div className="absolute -left-2 w-4 h-6 bg-indigo-600 rounded-r-full border-r border-indigo-900"></div>
                <div className="absolute -right-2 w-4 h-6 bg-indigo-600 rounded-l-full border-l border-indigo-900"></div>
                
                {/* Candy label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-indigo-900 transform -rotate-3">Eclairs</span>
                </div>
                
                {/* Circular patterns on wrapper */}
                <div className="absolute top-1 left-3 w-2 h-2 border border-indigo-900 rounded-full"></div>
                <div className="absolute bottom-1 right-5 w-1.5 h-1.5 border border-indigo-900 rounded-full"></div>
                <div className="absolute bottom-0.5 left-5 w-1 h-1 border border-indigo-900 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isDisplayOnly) {
    // Simple static display for candy in display window
    return (
      <div 
        className={cn(
          "w-16 h-8 flex items-center justify-center cursor-default",
          isDisplayOnly ? "scale-75" : ""
        )}
        style={{ 
          position: 'relative',
          transform: `rotate(${candy.rotation}deg)`
        }}
      >
        {getCandyShape()}
      </div>
    );
  }

  // Removed motion animation for candies in the collection tray
  return (
    <div
      onClick={handleEat}
      className={cn(
        "absolute w-16 h-8 flex items-center justify-center cursor-pointer",
      )}
      style={{ 
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translateX(${candy.x}px) translateY(${candy.y}px) rotate(${candy.rotation}deg)`
      }}
    >
      {getCandyShape()}
    </div>
  );
};

export default Candy;
