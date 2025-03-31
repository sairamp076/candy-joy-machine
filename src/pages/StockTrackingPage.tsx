
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchMachineStock, 
  fetchFloorStock, 
  fetchVendorStock, 
  FloorStock,
  VendorStock,
  getCandyTypeColor
} from '@/services/stockService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CandyType, CANDY_DETAILS } from '@/utils/candyUtils';
import Candy from '@/components/Candy';
import { Package, ChartBar, ChartPie, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StockTrackingPage = () => {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

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

  const formatStockData = (stockData: FloorStock[]) => {
    return stockData?.map(floor => ({
      floor: `Floor ${floor.floor_number}`,
      fivestar: parseInt(floor.five_star_stock),
      milkybar: parseInt(floor.milky_bar_stock),
      dairymilk: parseInt(floor.dairy_milk_stock),
      eclairs: parseInt(floor.eclairs_stock),
      ferrero: parseInt(floor.ferro_rocher_stock)
    })) || [];
  };

  const formatVendorStockForPie = (vendorData?: VendorStock) => {
    if (!vendorData) return [];
    
    return [
      { name: '5 Star', value: parseInt(vendorData.five_star_stock), type: 'fivestar' as CandyType },
      { name: 'Milky Bar', value: parseInt(vendorData.milky_bar_stock), type: 'milkybar' as CandyType },
      { name: 'Dairy Milk', value: parseInt(vendorData.dairy_milk_stock), type: 'dairymilk' as CandyType },
      { name: 'Eclairs', value: parseInt(vendorData.eclairs_stock), type: 'eclairs' as CandyType },
      { name: 'Ferrero Rocher', value: parseInt(vendorData.ferro_rocher_stock), type: 'ferrero' as CandyType }
    ];
  };

  const getFloorDetail = (floorNumber: string) => {
    return machineStock?.find(floor => floor.floor_number === floorNumber) || null;
  };

  const renderFloorNode = (floor: FloorStock) => {
    const fiveStar = parseInt(floor.five_star_stock);
    const milkyBar = parseInt(floor.milky_bar_stock);
    const dairyMilk = parseInt(floor.dairy_milk_stock);
    const eclairs = parseInt(floor.eclairs_stock);
    const ferrero = parseInt(floor.ferro_rocher_stock);
    
    const total = fiveStar + milkyBar + dairyMilk + eclairs + ferrero;
    const percentFull = Math.min(100, Math.round((total / (5 * 10)) * 100));
    
    let statusColor = 'bg-green-500';
    if (percentFull < 30) statusColor = 'bg-red-500';
    else if (percentFull < 60) statusColor = 'bg-yellow-500';
    
    return (
      <Popover key={floor.floor_number}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`rounded-full w-24 h-24 flex flex-col items-center justify-center border-2 ${
              selectedFloor === floor.floor_number ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            }`}
            onClick={() => setSelectedFloor(floor.floor_number)}
          >
            <div className={`w-3 h-3 rounded-full ${statusColor} absolute top-2 right-2`}></div>
            <Package className="mb-1" />
            <div className="text-sm font-semibold">Floor {floor.floor_number}</div>
            <div className="text-xs text-gray-500">{percentFull}% full</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-2">
            <h3 className="font-semibold">Floor {floor.floor_number} Stock</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'fivestar' as CandyType, label: '5 Star', stock: fiveStar },
                { type: 'milkybar' as CandyType, label: 'Milky Bar', stock: milkyBar },
                { type: 'dairymilk' as CandyType, label: 'Dairy Milk', stock: dairyMilk },
                { type: 'eclairs' as CandyType, label: 'Eclairs', stock: eclairs },
                { type: 'ferrero' as CandyType, label: 'Ferrero Rocher', stock: ferrero }
              ].map(candy => (
                <div key={candy.label} className="flex items-center gap-2 p-1 rounded hover:bg-gray-100">
                  <div className="w-8 h-8 relative">
                    <Candy
                      candy={{
                        id: `stock-${candy.type}`,
                        type: candy.type,
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
                    <div className="text-sm font-medium">{candy.label}</div>
                    <div className="text-xs">
                      <span className={candy.stock < 3 ? 'text-red-600 font-semibold' : ''}>
                        {candy.stock}/{CANDY_DETAILS[candy.type].defaultCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Stock Tracking</h1>
          <p className="text-gray-500">Monitor and analyze inventory levels across all floors</p>
        </div>
        <Button onClick={refreshAllData} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Stock Distribution Overview</CardTitle>
              <div className="flex gap-2">
                <ChartBar className="h-5 w-5 text-blue-500" />
                <ChartPie className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <CardDescription>
              Visualization of candy stock levels across all floors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar">
              <TabsList className="mb-4">
                <TabsTrigger value="bar" className="flex items-center gap-2">
                  <ChartBar className="h-4 w-4" />
                  <span>Bar Chart</span>
                </TabsTrigger>
                <TabsTrigger value="pie" className="flex items-center gap-2">
                  <ChartPie className="h-4 w-4" />
                  <span>Pie Chart</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bar" className="h-[400px]">
                {isMachineStockLoading ? (
                  <div className="h-full flex items-center justify-center">Loading chart data...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatStockData(machineStock || [])}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="floor" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fivestar" name="5 Star" fill={getCandyTypeColor('fivestar')} />
                      <Bar dataKey="milkybar" name="Milky Bar" fill={getCandyTypeColor('milkybar')} />
                      <Bar dataKey="dairymilk" name="Dairy Milk" fill={getCandyTypeColor('dairymilk')} />
                      <Bar dataKey="eclairs" name="Eclairs" fill={getCandyTypeColor('eclairs')} />
                      <Bar dataKey="ferrero" name="Ferrero Rocher" fill={getCandyTypeColor('ferrero')} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>

              <TabsContent value="pie" className="h-[400px]">
                {isVendorStockLoading ? (
                  <div className="h-full flex items-center justify-center">Loading chart data...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatVendorStockForPie(vendorStock)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {formatVendorStockForPie(vendorStock).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getCandyTypeColor(entry.type)} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Floor Details</CardTitle>
            <CardDescription>
              {selectedFloor ? `Viewing Floor ${selectedFloor}` : "Select a floor to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedFloor && getFloorDetail(selectedFloor) ? (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Floor {selectedFloor} Inventory</h3>
                
                {Object.entries(CANDY_DETAILS).map(([type, details]) => {
                  const floorData = getFloorDetail(selectedFloor);
                  let stockValue = 0;
                  
                  if (floorData) {
                    if (type === 'fivestar') stockValue = parseInt(floorData.five_star_stock);
                    else if (type === 'milkybar') stockValue = parseInt(floorData.milky_bar_stock);
                    else if (type === 'dairymilk') stockValue = parseInt(floorData.dairy_milk_stock);
                    else if (type === 'eclairs') stockValue = parseInt(floorData.eclairs_stock);
                    else if (type === 'ferrero') stockValue = parseInt(floorData.ferro_rocher_stock);
                  }
                  
                  const percentFull = Math.round((stockValue / details.defaultCount) * 100);
                  
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="w-10 h-10 relative">
                        <Candy
                          candy={{
                            id: `detail-${type}`,
                            type: type as CandyType,
                            x: 0,
                            y: 0,
                            rotation: 0
                          }}
                          onEat={() => {}}
                          isDisplayOnly={true}
                          containerWidth={40}
                          containerHeight={40}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{details.name}</span>
                          <span className={stockValue < 3 ? 'text-red-600 font-semibold' : 'font-medium'}>
                            {stockValue}/{details.defaultCount}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              percentFull < 30 ? 'bg-red-500' : 
                              percentFull < 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${percentFull}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <Package className="h-12 w-12 mb-2" />
                <p>Select a floor to view detailed stock information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Floor Network View</CardTitle>
          <CardDescription>Interactive view of all floor vending machines</CardDescription>
        </CardHeader>
        <CardContent>
          {isMachineStockLoading ? (
            <div className="h-[200px] flex items-center justify-center">Loading floor data...</div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center py-4">
              {machineStock?.map(floor => renderFloorNode(floor))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockTrackingPage;
