
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
              {/* Enhanced 5 Star design based on the image */}
              <div className="w-16 h-5 bg-yellow-500 rounded-sm shadow-lg relative flex items-center justify-center transform-gpu border-2 border-yellow-600">
                <div className="absolute top-0 left-0 right-0 h-full w-full bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                <div className="absolute top-0 left-0 w-8 h-5 rounded-l-sm flex items-center justify-center">
                  <div className="absolute top-0 left-1 w-6 h-5 rounded-l-sm overflow-hidden">
                    <div className="absolute top-0.5 left-0 right-0 h-4 flex items-center justify-center">
                      <span className="text-[10px] font-extrabold text-white z-10 drop-shadow-md">5</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-10 h-5 rounded-r-sm flex items-center justify-center">
                  <div className="absolute top-0.5 right-1 w-6 h-4 flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-white z-10 -skew-x-12">★★★★★</span>
                  </div>
                </div>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-yellow-300"></div>
                
                {/* Cadbury logo */}
                <div className="absolute -left-1 -top-1 w-4 h-4 rounded-full bg-purple-800 border border-purple-900 flex items-center justify-center z-20">
                  <span className="text-[5px] font-bold text-white transform rotate-0">C</span>
                </div>
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
              {/* Enhanced Dairy Milk design based on the image */}
              <div className="w-14 h-7 bg-purple-800 rounded-sm shadow-lg border-2 border-purple-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-purple-900"></div>
                
                {/* Silk Bubbly design element */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Cadbury logo */}
                  <div className="text-[6px] font-fancy text-yellow-300 transform -skew-x-12 mt-0.5">Cadbury</div>
                  
                  {/* Dairy Milk text */}
                  <div className="text-[8px] font-bold text-white mt-0.5">Dairy Milk</div>
                  
                  {/* Silk text */}
                  <div className="text-[10px] italic font-bold text-yellow-300 transform -skew-x-12 -mt-0.5">Silk</div>
                  
                  {/* Bubbly text */}
                  <div className="text-[8px] font-bold text-white mt-0.5">BUBBLY</div>
                </div>
                
                {/* Bubble texture */}
                <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-purple-500 opacity-60"></div>
                <div className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full bg-purple-500 opacity-60"></div>
                <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-purple-500 opacity-60"></div>
                <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-purple-500 opacity-60"></div>
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-500 opacity-60"></div>
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
      case 'ferrero':
        return (
          <div className="w-full h-full flex items-center justify-center perspective">
            <div className="candy-wrapper relative">
              <div className="w-10 h-10 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full shadow-lg relative border-2 border-amber-700 overflow-hidden">
                {/* Gold foil wrapper details */}
                <div className="absolute inset-0 bg-amber-400 opacity-60 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-amber-800 rounded-full border-2 border-amber-900 flex items-center justify-center">
                    <div className="w-4 h-4 bg-amber-600 rounded-full flex items-center justify-center">
                      <span className="text-[5px] font-bold text-white transform rotate-0">FR</span>
                    </div>
                  </div>
                </div>
                
                {/* Gold wrapper texture */}
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-full h-0.5 bg-amber-200 opacity-50"
                    style={{ 
                      top: `${(i+1) * 10}%`, 
                      transform: `rotate(${i * 22.5}deg)` 
                    }}
                  ></div>
                ))}
                
                {/* Label at the top */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-5 h-2 bg-white rounded-b-sm">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[4px] font-bold text-amber-800">FERRERO</span>
                  </div>
                </div>
                
                {/* Paper cup base */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-amber-900 border-t border-amber-950"></div>
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
