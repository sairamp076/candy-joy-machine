
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface FloorStock {
  floor_number: string;
  milky_bar_stock: string;
  ferro_rocher_stock: string;
  eclairs_stock: string;
  dairy_milk_stock: string;
  five_star_stock: string;
}

interface VendorStock {
  vendor_name: string;
  milky_bar_stock: string;
  ferro_rocher_stock: string;
  eclairs_stock: string;
  dairy_milk_stock: string;
  five_star_stock: string;
}

const StockManagementPage = () => {
  const [floorStocks, setFloorStocks] = useState<FloorStock[]>([
    {"floor_number":"1","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"2","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"3","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"4","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"5","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"6","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"7","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"8","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"9","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"10","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"11","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"12","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"13","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"14","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"15","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"16","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"},
    {"floor_number":"17","milky_bar_stock":"10","ferro_rocher_stock":"10","eclairs_stock":"10","dairy_milk_stock":"10","five_star_stock":"10"}
  ]);
  
  const [vendorStock, setVendorStock] = useState<VendorStock>({
    "vendor_name": "karachi bakery",
    "milky_bar_stock": "100",
    "ferro_rocher_stock": "100",
    "eclairs_stock": "100",
    "dairy_milk_stock": "100",
    "five_star_stock": "100"
  });

  const [selectedFloor, setSelectedFloor] = useState<FloorStock | null>(null);
  const [refillValues, setRefillValues] = useState({
    milky_bar_stock: "0",
    ferro_rocher_stock: "0",
    eclairs_stock: "0",
    dairy_milk_stock: "0",
    five_star_stock: "0"
  });

  const candyTypes = ["milky_bar", "ferro_rocher", "eclairs", "dairy_milk", "five_star"];
  const candyColors = {
    milky_bar: "#f0f0f0",
    ferro_rocher: "#d4af37",
    eclairs: "#a52a2a",
    dairy_milk: "#4b0082",
    five_star: "#ffd700"
  };

  const handleRefill = (floorNumber: string) => {
    // Update vendor stock
    const newVendorStock = { ...vendorStock };
    const newFloorStocks = [...floorStocks];
    const floorIndex = newFloorStocks.findIndex(f => f.floor_number === floorNumber);
    
    if (floorIndex === -1) return;
    
    let hasInsufficientStock = false;
    
    candyTypes.forEach(candy => {
      const stockKey = `${candy}_stock` as keyof typeof refillValues;
      const refillAmount = parseInt(refillValues[stockKey] || "0", 10);
      const vendorAmount = parseInt(newVendorStock[stockKey as keyof VendorStock] || "0", 10);
      
      if (refillAmount > vendorAmount) {
        hasInsufficientStock = true;
        toast({
          title: "Insufficient Stock",
          description: `Vendor doesn't have enough ${candy.replace('_', ' ')} to refill.`,
          variant: "destructive"
        });
        return;
      }
      
      newVendorStock[stockKey as keyof VendorStock] = (vendorAmount - refillAmount).toString();
      
      const currentFloorStock = parseInt(newFloorStocks[floorIndex][stockKey as keyof FloorStock] || "0", 10);
      newFloorStocks[floorIndex][stockKey as keyof FloorStock] = (currentFloorStock + refillAmount).toString();
    });
    
    if (!hasInsufficientStock) {
      setVendorStock(newVendorStock);
      setFloorStocks(newFloorStocks);
      setRefillValues({
        milky_bar_stock: "0",
        ferro_rocher_stock: "0",
        eclairs_stock: "0",
        dairy_milk_stock: "0",
        five_star_stock: "0"
      });
      toast({
        title: "Stock Refilled",
        description: `Successfully refilled stock on floor ${floorNumber}.`,
      });
    }
  };
  
  const formatDataForBarChart = () => {
    return floorStocks.map(floor => ({
      floor: `Floor ${floor.floor_number}`,
      "Milky Bar": parseInt(floor.milky_bar_stock),
      "Ferro Rocher": parseInt(floor.ferro_rocher_stock),
      "Eclairs": parseInt(floor.eclairs_stock),
      "Dairy Milk": parseInt(floor.dairy_milk_stock),
      "Five Star": parseInt(floor.five_star_stock),
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Stock Management</h1>
      
      <Tabs defaultValue="floors">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="floors">Floor Stock</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Stock</TabsTrigger>
        </TabsList>
        
        <TabsContent value="floors">
          <Card>
            <CardHeader>
              <CardTitle>Floor-wise Stock Status</CardTitle>
              <CardDescription>
                View and manage stock for each floor's vending machine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatDataForBarChart()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="floor" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Milky Bar" fill={candyColors.milky_bar} />
                    <Bar dataKey="Ferro Rocher" fill={candyColors.ferro_rocher} />
                    <Bar dataKey="Eclairs" fill={candyColors.eclairs} />
                    <Bar dataKey="Dairy Milk" fill={candyColors.dairy_milk} />
                    <Bar dataKey="Five Star" fill={candyColors.five_star} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {floorStocks.map((floor) => (
                  <Dialog key={floor.floor_number}>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>Floor {floor.floor_number}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-around">
                            {candyTypes.map((candy) => {
                              const stockKey = `${candy}_stock` as keyof typeof floor;
                              return (
                                <div key={candy} className="text-center">
                                  <div 
                                    className="w-6 h-6 mx-auto mb-1 rounded-full" 
                                    style={{ backgroundColor: candyColors[candy as keyof typeof candyColors] }}
                                  />
                                  <p className="text-xs">{floor[stockKey]}</p>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Floor {floor.floor_number} Stock Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {candyTypes.map((candy) => {
                          const stockKey = `${candy}_stock` as keyof typeof floor;
                          const displayName = candy.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ');
                          
                          return (
                            <div key={candy} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full" 
                                  style={{ backgroundColor: candyColors[candy as keyof typeof candyColors] }}
                                />
                                <span>{displayName}</span>
                              </div>
                              <span className="font-bold">{floor[stockKey]}</span>
                            </div>
                          );
                        })}
                        
                        <div className="mt-6">
                          <h4 className="font-bold mb-2">Refill Stock</h4>
                          {candyTypes.map((candy) => {
                            const stockKey = `${candy}_stock` as keyof typeof refillValues;
                            const displayName = candy.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ');
                            
                            return (
                              <div key={candy} className="flex items-center gap-2 mb-2">
                                <span className="w-24">{displayName}</span>
                                <Input 
                                  type="number" 
                                  min="0"
                                  value={refillValues[stockKey]}
                                  onChange={(e) => setRefillValues({
                                    ...refillValues,
                                    [stockKey]: e.target.value
                                  })}
                                  className="w-20"
                                />
                              </div>
                            );
                          })}
                          
                          <Button 
                            className="w-full mt-4"
                            onClick={() => handleRefill(floor.floor_number)}
                          >
                            Refill Stock
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vendor">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Stock Status</CardTitle>
              <CardDescription>Karachi Bakery - Master Inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[{
                      name: "Vendor Stock",
                      "Milky Bar": parseInt(vendorStock.milky_bar_stock),
                      "Ferro Rocher": parseInt(vendorStock.ferro_rocher_stock),
                      "Eclairs": parseInt(vendorStock.eclairs_stock),
                      "Dairy Milk": parseInt(vendorStock.dairy_milk_stock),
                      "Five Star": parseInt(vendorStock.five_star_stock),
                    }]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Milky Bar" fill={candyColors.milky_bar} />
                    <Bar dataKey="Ferro Rocher" fill={candyColors.ferro_rocher} />
                    <Bar dataKey="Eclairs" fill={candyColors.eclairs} />
                    <Bar dataKey="Dairy Milk" fill={candyColors.dairy_milk} />
                    <Bar dataKey="Five Star" fill={candyColors.five_star} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {candyTypes.map((candy) => {
                        const stockKey = `${candy}_stock` as keyof typeof vendorStock;
                        const displayName = candy.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        
                        return (
                          <div key={candy} className="text-center p-4 rounded-lg shadow-sm border">
                            <div 
                              className="w-12 h-12 mx-auto mb-2 rounded-full" 
                              style={{ backgroundColor: candyColors[candy as keyof typeof candyColors] }}
                            />
                            <p className="font-medium">{displayName}</p>
                            <p className="text-2xl font-bold mt-1">{vendorStock[stockKey]}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockManagementPage;
