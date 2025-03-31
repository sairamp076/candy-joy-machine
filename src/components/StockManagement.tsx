
import React from 'react';
import { 
  Candy as CandyType, 
  CandyType as CandyTypeEnum,
  CANDY_DETAILS 
} from '@/utils/candyUtils';
import Candy from './Candy';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, User, Truck } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StockLevels {
  vendingMachine: Record<CandyTypeEnum, number>;
  floorManager: Record<CandyTypeEnum, number>;
  vendor: Record<CandyTypeEnum, number>;
}

interface StockManagementProps {
  stockLevels: StockLevels;
  onVendorRefill: (type: CandyTypeEnum, amount: number) => void;
}

const StockManagement = ({ stockLevels, onVendorRefill }: StockManagementProps) => {
  return (
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
        
        {/* Machine Stock Tab */}
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
        
        {/* Floor Manager Stock Tab */}
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
                              onVendorRefill(type as CandyTypeEnum, amount);
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
        
        {/* Vendor Stock Tab */}
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
  );
};

export default StockManagement;
