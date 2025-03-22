
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
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-4 bg-candy-fivestar rounded-sm shadow-md relative flex items-center justify-center">
              <span className="text-[8px] font-bold text-amber-800">5★</span>
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 to-transparent opacity-50 rounded-sm"></div>
            </div>
          </div>
        );
      case 'milkybar':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-4 bg-candy-milkybar rounded-sm shadow-md relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-40 rounded-sm"></div>
              <div className="absolute top-1 left-1 right-1 h-[1px] bg-amber-100"></div>
            </div>
          </div>
        );
      case 'dairymilk':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-6 bg-candy-dairymilk rounded-sm shadow-md grid grid-cols-2 grid-rows-2 gap-[1px] p-[1px]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-candy-dairymilk border-t border-l border-amber-800 border-opacity-30"></div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-700 to-transparent opacity-30 rounded-sm"></div>
            </div>
          </div>
        );
      case 'eclairs':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-5 h-5 bg-candy-eclairs rounded-full shadow-md relative">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-600 to-transparent opacity-40 rounded-full"></div>
              <div className="absolute inset-1 rounded-full border border-amber-800 border-opacity-30"></div>
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
        "absolute w-10 h-10 flex items-center justify-center cursor-pointer",
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
