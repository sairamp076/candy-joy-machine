
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchMachineStock, 
  fetchFloorStock, 
  fetchVendorStock,
  FloorStock,
  VendorStock,
  getCandyTypeColor
} from '@/services/stockService';
import { CandyType, CANDY_DETAILS } from '@/utils/candyUtils';
import Candy from '@/components/Candy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Store, Package, User, Truck, RefreshCw, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react';

const StockManagementPage = () => {
  const [selectedFloor, setSelectedFloor] = useState<string>("1");
  const [selectedCandyType, setSelectedCandyType] = useState<CandyType>("fivestar");
  const [refillAmount, setRefillAmount] = useState<number>(5);

  const { 
    data: machineStock, 
    isLoading: isMachineStockLoading, 
    refetch: refetchMachineStock 
  } = useQuery({
    queryKey: ['machineStock'],
    queryFn: fetchMachineStock
  });

  const { 
    data: floorStock, 
    isLoading: isFloorStockLoading, 
    refetch: refetchFloorStock 
  } = useQuery({
    queryKey: ['floorStock'],
    queryFn: fetchFloorStock
  });

  const { 
    data: vendorStock, 
    isLoading: isVendorStockLoading, 
    refetch: refetchVendorStock 
  } = useQuery({
    queryKey: ['vendorStock'],
    queryFn: fetchVendorStock
  });

  const refreshAllData = () => {
    refetchMachineStock();
    refetchFloorStock();
    refetchVendorStock();
  };

  const handleRefill = () => {
    // In a real application, we would make an API call here to update the stock
    // For now, we'll just show a toast
    toast({
      title: "Stock Refilled",
      description: `Added ${refillAmount} ${CANDY_DETAILS[selectedCandyType].name} to Floor ${selectedFloor}`,
      variant: "default",
    });
  };

  const handleBulkRefill = () => {
    // In a real application, we would make an API call here to update all machine stock
    // For now, we'll just show a toast
    toast({
      title: "Bulk Refill Initiated",
      description: "All machine stocks have been refilled to their default levels",
      variant: "default",
    });
  };

  const getMachineStockForFloor = (floorNumber: string): FloorStock | undefined => {
    return machineStock?.find(item => item.floor_number === floorNumber);
  };

  const getFloorStockForFloor = (floorNumber: string): FloorStock | undefined => {
    return floorStock?.find(item => item.floor_number === floorNumber);
  };

  const getCandyStockForFloor = (floorStock: FloorStock | undefined, type: CandyType): number => {
    if (!floorStock) return 0;
    
    switch(type) {
      case 'fivestar': return parseInt(floorStock.five_star_stock);
      case 'milkybar': return parseInt(floorStock.milky_bar_stock);
      case 'dairymilk': return parseInt(floorStock.dairy_milk_stock);
      case 'eclairs': return parseInt(floorStock.eclairs_stock);
      case 'ferrero': return parseInt(floorStock.ferro_rocher_stock);
      default: return 0;
    }
  };

  const getStockLevelStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 30) return { color: "text-red-600", bg: "bg-red-100", icon: <AlertTriangle className="h-4 w-4 text-red-600" /> };
    if (percentage < 70) return { color: "text-amber-600", bg: "bg-amber-100", icon: <AlertTriangle className="h-4 w-4 text-amber-600" /> };
    return { color: "text-green-600", bg: "bg-green-100", icon: <CheckCircle2 className="h-4 w-4 text-green-600" /> };
  };

  // Check if any machine needs refill (any candy type is below 10)
  const needsRefill = () => {
    if (!machineStock) return false;
    
    return machineStock.some(floor => 
      parseInt(floor.five_star_stock) < 10 ||
      parseInt(floor.milky_bar_stock) < 10 ||
      parseInt(floor.eclairs_stock) < 10 ||
      parseInt(floor.dairy_milk_stock) < 10 ||
      parseInt(floor.ferro_rocher_stock) < 10
    );
  };

  // Format stock data for charts
  const formatStockDataForCharts = () => {
    if (!machineStock) return [];
    
    return machineStock.map(floor => ({
      floor: `Floor ${floor.floor_number}`,
      fivestar: parseInt(floor.five_star_stock),
      milkybar: parseInt(floor.milky_bar_stock),
      dairymilk: parseInt(floor.dairy_milk_stock),
      eclairs: parseInt(floor.eclairs_stock),
      ferrero: parseInt(floor.ferro_rocher_stock),
      maxStock: 10 // Default max stock
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-gray-500">Monitor and refill inventory across all vending machines</p>
        </div>
        <Button onClick={refreshAllData} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Stock Visualization</CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>
              Real-time stock levels across all floors
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isMachineStockLoading ? (
              <div className="h-full flex items-center justify-center">Loading chart data...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatStockDataForCharts()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="floor" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="maxStock" name="Max Stock" fill="#e0e0e0" stackId="a" />
                  <Bar dataKey="fivestar" name="5 Star" fill={getCandyTypeColor('fivestar')} stackId="b" />
                  <Bar dataKey="milkybar" name="Milky Bar" fill={getCandyTypeColor('milkybar')} stackId="c" />
                  <Bar dataKey="dairymilk" name="Dairy Milk" fill={getCandyTypeColor('dairymilk')} stackId="d" />
                  <Bar dataKey="eclairs" name="Eclairs" fill={getCandyTypeColor('eclairs')} stackId="e" />
                  <Bar dataKey="ferrero" name="Ferrero Rocher" fill={getCandyTypeColor('ferrero')} stackId="f" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage stock levels quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Bulk Refill</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="default" 
                      disabled={!needsRefill()} 
                      className="flex items-center gap-2"
                    >
                      <Truck className="h-4 w-4" />
                      Refill All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Bulk Refill</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will refill all vending machines to their default stock levels.
                        Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkRefill}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold">Single Machine Refill</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Floor</label>
                      <Select 
                        value={selectedFloor} 
                        onValueChange={setSelectedFloor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                        <SelectContent>
                          {machineStock?.map(floor => (
                            <SelectItem key={floor.floor_number} value={floor.floor_number}>
                              Floor {floor.floor_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Candy Type</label>
                      <Select 
                        value={selectedCandyType} 
                        onValueChange={(value) => setSelectedCandyType(value as CandyType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select candy" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CANDY_DETAILS).map(([type, details]) => (
                            <SelectItem key={type} value={type}>
                              {details.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount to Refill</label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={refillAmount}
                      onChange={(e) => setRefillAmount(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <Button 
                    className="w-full flex items-center gap-2" 
                    onClick={handleRefill}
                  >
                    <Package className="h-4 w-4" />
                    Refill Stock
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="machine" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="machine" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Machine Stock</span>
          </TabsTrigger>
          <TabsTrigger value="floor" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Floor Stock</span>
          </TabsTrigger>
          <TabsTrigger value="vendor" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Vendor Stock</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="machine" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vending Machine Inventory</CardTitle>
              <CardDescription>
                Current stock levels in all vending machines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMachineStockLoading ? (
                <div className="h-40 flex items-center justify-center">Loading machine stock data...</div>
              ) : (
                <div className="space-y-4">
                  {machineStock?.map(floor => {
                    const fivestar = parseInt(floor.five_star_stock);
                    const milkybar = parseInt(floor.milky_bar_stock);
                    const dairymilk = parseInt(floor.dairy_milk_stock);
                    const eclairs = parseInt(floor.eclairs_stock);
                    const ferrero = parseInt(floor.ferro_rocher_stock);
                    
                    const needsRefill = fivestar < 10 || milkybar < 10 || dairymilk < 10 || eclairs < 10 || ferrero < 10;
                    
                    return (
                      <div key={floor.floor_number} className={`p-4 rounded-lg ${needsRefill ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg">Floor {floor.floor_number}</h3>
                          {needsRefill && (
                            <span className="text-amber-600 text-sm flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              Needs refill
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          {[
                            { type: 'fivestar' as CandyType, stock: fivestar },
                            { type: 'milkybar' as CandyType, stock: milkybar },
                            { type: 'dairymilk' as CandyType, stock: dairymilk },
                            { type: 'eclairs' as CandyType, stock: eclairs },
                            { type: 'ferrero' as CandyType, stock: ferrero }
                          ].map(item => {
                            const status = getStockLevelStatus(item.stock, 10);
                            
                            return (
                              <div key={item.type} className={`p-2 rounded ${item.stock < 10 ? status.bg : 'bg-white'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 relative">
                                    <Candy
                                      candy={{
                                        id: `machine-${floor.floor_number}-${item.type}`,
                                        type: item.type,
                                        x: 0,
                                        y: 0,
                                        rotation: 0
                                      }}
                                      onEat={() => {}}
                                      isDisplayOnly={true}
                                      containerWidth={32}
                                      containerHeight={32}
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{CANDY_DETAILS[item.type].name}</div>
                                    <div className="flex items-center gap-1">
                                      {status.icon}
                                      <span className={`text-xs ${status.color}`}>
                                        {item.stock}/{CANDY_DETAILS[item.type].defaultCount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="floor" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Floor Manager Inventory</CardTitle>
              <CardDescription>
                Available stock with floor managers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFloorStockLoading ? (
                <div className="h-40 flex items-center justify-center">Loading floor stock data...</div>
              ) : (
                <div className="space-y-4">
                  {floorStock?.map(floor => (
                    <div key={floor.floor_number} className="p-4 rounded-lg bg-gray-50">
                      <h3 className="font-semibold text-lg mb-3">Floor {floor.floor_number} Manager</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                          { type: 'fivestar' as CandyType, stock: parseInt(floor.five_star_stock) },
                          { type: 'milkybar' as CandyType, stock: parseInt(floor.milky_bar_stock) },
                          { type: 'dairymilk' as CandyType, stock: parseInt(floor.dairy_milk_stock) },
                          { type: 'eclairs' as CandyType, stock: parseInt(floor.eclairs_stock) },
                          { type: 'ferrero' as CandyType, stock: parseInt(floor.ferro_rocher_stock) }
                        ].map(item => {
                          const status = getStockLevelStatus(item.stock, 20);
                          
                          return (
                            <div key={item.type} className={`p-2 rounded ${item.stock < 5 ? status.bg : 'bg-white'}`}>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 relative">
                                  <Candy
                                    candy={{
                                      id: `floor-${floor.floor_number}-${item.type}`,
                                      type: item.type,
                                      x: 0,
                                      y: 0,
                                      rotation: 0
                                    }}
                                    onEat={() => {}}
                                    isDisplayOnly={true}
                                    containerWidth={32}
                                    containerHeight={32}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{CANDY_DETAILS[item.type].name}</div>
                                  <div className="flex items-center gap-1">
                                    {status.icon}
                                    <span className={`text-xs ${status.color}`}>
                                      {item.stock}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vendor" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Warehouse Inventory</CardTitle>
              <CardDescription>
                Available stock at the warehouse
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isVendorStockLoading ? (
                <div className="h-40 flex items-center justify-center">Loading vendor stock data...</div>
              ) : (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-1">{vendorStock?.vendor_name || "Main Vendor"}</h3>
                  <p className="text-sm text-gray-500 mb-4">Central warehouse stock levels</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { type: 'fivestar' as CandyType, stock: parseInt(vendorStock?.five_star_stock || "0") },
                      { type: 'milkybar' as CandyType, stock: parseInt(vendorStock?.milky_bar_stock || "0") },
                      { type: 'dairymilk' as CandyType, stock: parseInt(vendorStock?.dairy_milk_stock || "0") },
                      { type: 'eclairs' as CandyType, stock: parseInt(vendorStock?.eclairs_stock || "0") },
                      { type: 'ferrero' as CandyType, stock: parseInt(vendorStock?.ferro_rocher_stock || "0") }
                    ].map(item => (
                      <div key={item.type} className="bg-white p-2 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative">
                            <Candy
                              candy={{
                                id: `vendor-${item.type}`,
                                type: item.type,
                                x: 0,
                                y: 0,
                                rotation: 0
                              }}
                              onEat={() => {}}
                              isDisplayOnly={true}
                              containerWidth={32}
                              containerHeight={32}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{CANDY_DETAILS[item.type].name}</div>
                            <div className="text-xs font-semibold">{item.stock}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockManagementPage;
