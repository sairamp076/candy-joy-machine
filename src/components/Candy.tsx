
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Candy as CandyType, playSound } from '@/utils/candyUtils';
import { cn } from '@/lib/utils';

interface CandyProps {
  candy: CandyType;
  onEat: (id: string) => void;
  isNew?: boolean;
  containerWidth: number;
  containerHeight: number;
}

const Candy = ({ candy, onEat, isNew = false, containerWidth, containerHeight }: CandyProps) => {
  const [position, setPosition] = useState({ x: candy.x, y: candy.y });
  const [rotation, setRotation] = useState(candy.rotation);
  const [isDragging, setIsDragging] = useState(false);
  const candyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNew) {
      // Animate entry
      const finalY = Math.min(containerHeight - 40, containerHeight * 0.6 + Math.random() * (containerHeight * 0.3));
      
      // Animate the candy dropping
      const dropAnimation = setTimeout(() => {
        setPosition({ x: candy.x, y: finalY });
        setRotation(rotation + (Math.random() * 360 - 180));
      }, 100);
      
      return () => clearTimeout(dropAnimation);
    }
  }, [isNew, containerHeight, candy.x, rotation]);
  
  const handleEat = () => {
    if (!candy.isEaten && !isDragging) {
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
              <div className="w-16 h-5 bg-yellow-600 rounded-sm shadow-lg relative flex items-center justify-center transform-gpu">
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
              <div className="w-14 h-5 bg-amber-50 rounded-sm shadow-lg relative">
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
              <div className="w-14 h-7 bg-purple-900 rounded-sm shadow-lg grid grid-cols-2 grid-rows-2 gap-[1px] p-[1px]">
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
              {/* This resembles the Eclairs candy from the provided image */}
              <div className="w-16 h-6 bg-amber-400 rounded-full shadow-lg relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-500 opacity-80"></div>
                
                {/* Candy wrapper twist ends */}
                <div className="absolute -left-2 w-4 h-6 bg-indigo-600 rounded-r-full"></div>
                <div className="absolute -right-2 w-4 h-6 bg-indigo-600 rounded-l-full"></div>
                
                {/* Candy label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-indigo-900 transform -rotate-3">Eclairs</span>
                </div>
                
                {/* Circular patterns on wrapper */}
                <div className="absolute top-1 left-3 w-2 h-2 border border-indigo-400 rounded-full"></div>
                <div className="absolute bottom-1 right-5 w-1.5 h-1.5 border border-indigo-400 rounded-full"></div>
                <div className="absolute bottom-0.5 left-5 w-1 h-1 border border-indigo-400 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={candyRef}
      initial={{ opacity: isNew ? 0 : 1 }}
      animate={{ 
        opacity: 1,
        x: position.x, 
        y: position.y,
        rotate: rotation,
        scale: isDragging ? 1.1 : 1
      }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        opacity: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.9 }}
      drag
      dragConstraints={{
        top: 0,
        left: 0,
        right: containerWidth - 40,
        bottom: containerHeight - 40
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onClick={handleEat}
      className={cn(
        "absolute w-16 h-8 flex items-center justify-center cursor-pointer",
        candy.isEaten && "opacity-0 pointer-events-none",
        isNew && "z-10"
      )}
      style={{ 
        x: position.x, 
        y: position.y,
        rotate: rotation
      }}
    >
      {getCandyShape()}
    </motion.div>
  );
};

export default Candy;
