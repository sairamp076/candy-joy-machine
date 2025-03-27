
import React from 'react';
import { HistoryItem, CANDY_DETAILS } from '@/utils/candyUtils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HistoryPanelProps {
  history: HistoryItem[];
  className?: string;
}

const HistoryPanel = ({ history, className }: HistoryPanelProps) => {
  if (history.length === 0) {
    return (
      <div className={cn("bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-md", className)}>
        <h2 className="text-xl font-semibold mb-4">Candy History</h2>
        <p className="text-gray-500 italic text-center">No candies eaten yet!</p>
      </div>
    );
  }

  // Group by candy type
  const groupedHistory = history.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = {
        count: 0,
        totalScore: 0,
        items: []
      };
    }
    acc[item.type].count += 1;
    acc[item.type].totalScore += item.score;
    acc[item.type].items.push(item);
    return acc;
  }, {} as Record<string, { count: number; totalScore: number; items: HistoryItem[] }>);

  // Calculate total score
  const totalScore = Object.values(groupedHistory).reduce(
    (sum, group) => sum + group.totalScore, 
    0
  );

  return (
    <div className={cn("bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-md", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Candy History</h2>
        <div className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
          Total: {totalScore}
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedHistory).map(([type, group]) => (
          <motion.div 
            key={type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  `bg-${type === 'fivestar' ? 'yellow-400' : 
                    type === 'milkybar' ? 'yellow-100' :
                    type === 'dairymilk' ? 'purple-700' :
                    type === 'eclairs' ? 'amber-600' :
                    'orange-400'}`
                )}></div>
                <h3 className="font-medium">{CANDY_DETAILS[type as keyof typeof CANDY_DETAILS].name}</h3>
              </div>
              <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                x{group.count}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
