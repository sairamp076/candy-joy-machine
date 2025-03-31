
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface StockSummary {
  name: string;
  value: number;
  color: string;
}

const StockTracker = () => {
  const navigate = useNavigate();
  
  // Mock data for the summary
  const [stockSummary, setStockSummary] = useState<StockSummary[]>([
    { name: 'Milky Bar', value: 170, color: '#f0f0f0' },
    { name: 'Ferro Rocher', value: 170, color: '#d4af37' },
    { name: 'Eclairs', value: 170, color: '#a52a2a' },
    { name: 'Dairy Milk', value: 170, color: '#4b0082' },
    { name: 'Five Star', value: 170, color: '#ffd700' },
  ]);

  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Stock Tracker
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Current Stock Overview</DialogTitle>
          </DialogHeader>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockSummary}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Button 
            className="w-full mt-4"
            onClick={() => navigate('/stock-management')}
          >
            View Full Stock Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockTracker;
